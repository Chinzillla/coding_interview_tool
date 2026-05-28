# Azure Deployment

This guide deploys the app as a single Linux custom container on Azure App Service with Azure Container Registry. It keeps the SQLite database on App Service persistent storage at `/home/dev.db`.

This is for personal use. Keep the App Service scaled to one instance because SQLite is not a multi-instance production database.

## Security Defaults

The app has these deployment-focused defaults:

- First-run account creation requires `SETUP_TOKEN` in production.
- Only `ALLOWED_EMAIL` can create an account or sign in.
- Two-step verification with an authenticator app is required in production.
- Login attempts are rate-limited per IP and email.
- Security headers are sent by Next.js.
- The Python code runner is available only after the allowed email signs in with two-step verification and `ENABLE_CODE_RUNNER=true`.
- The Python runner does not inherit app secrets and runs as the low-privilege `nobody` user inside Linux containers.

The code runner executes user-submitted Python inside the app container. Allowed email plus two-step verification is the baseline; IP restrictions are still recommended when practical.

## Prerequisites

- Azure subscription
- Azure CLI installed, or Azure Cloud Shell
- Docker is optional because `az acr build` can build the image in Azure

Sign in:

```powershell
az login
```

## Variables

Change the names and region if you want. `ACR` and `APP` must be globally unique.

```powershell
$RG="coding-study-rg"
$LOC="eastus"
$ACR="codingstudyacr12345"
$PLAN="coding-study-plan"
$APP="coding-study-app-12345"
$IMAGE="coding-study-tool:v1"
$ALLOWED_EMAIL="you@example.com"
$AUTH_SECRET="$([guid]::NewGuid().ToString('N'))$([guid]::NewGuid().ToString('N'))"
$SETUP_TOKEN="$([guid]::NewGuid().ToString('N'))$([guid]::NewGuid().ToString('N'))"
```

Save the generated `$SETUP_TOKEN` somewhere safe. You need it only when creating the first account.

## Deploy Azure Resources with Bicep

The Bicep template in `infra/main.bicep` creates:

- Azure Container Registry with admin credentials disabled
- Linux App Service Plan
- Linux Web App configured for your custom container
- system-assigned managed identity on the Web App
- `AcrPull` role assignment so App Service can pull from ACR without registry passwords
- persistent `/home` storage settings for `file:/home/dev.db`
- auth, setup token, two-step verification, and code-runner app settings

The template provisions the resources but does not build the Docker image. Build the image into ACR after the Bicep deployment finishes.

```powershell
$DEPLOYMENT_NAME="coding-study-infra"

az group create --name $RG --location $LOC

az deployment group create `
  --name $DEPLOYMENT_NAME `
  --resource-group $RG `
  --template-file infra/main.bicep `
  --parameters `
    location="$LOC" `
    appName="$APP" `
    acrName="$ACR" `
    appServicePlanName="$PLAN" `
    imageRepository="coding-study-tool" `
    imageTag="v1" `
    allowedEmail="$ALLOWED_EMAIL" `
    authSecret="$AUTH_SECRET" `
    setupToken="$SETUP_TOKEN" `
    enableCodeRunner=true `
    twoFactorRequired=true

az acr build `
  --registry $ACR `
  --image "coding-study-tool:v1" `
  .

az webapp restart --resource-group $RG --name $APP

az deployment group show `
  --name $DEPLOYMENT_NAME `
  --resource-group $RG `
  --query "properties.outputs.appUrl.value" `
  --output tsv
```

Optional: restrict the app to one IP range by adding this parameter to the deployment command:

```powershell
allowedIpCidr="203.0.113.10/32"
```

Skip to [First Sign In](#first-sign-in) after the image build and restart complete.

## Create Azure Resources

Use this section only if you prefer manual Azure CLI commands instead of Bicep.

```powershell
az group create --name $RG --location $LOC

az acr create `
  --resource-group $RG `
  --name $ACR `
  --sku Basic

az acr build `
  --registry $ACR `
  --image $IMAGE `
  .

az appservice plan create `
  --name $PLAN `
  --resource-group $RG `
  --is-linux `
  --sku B1

az webapp create `
  --resource-group $RG `
  --plan $PLAN `
  --name $APP `
  --deployment-container-image-name "$ACR.azurecr.io/$IMAGE"
```

## Allow App Service to Pull from ACR

Use a system-assigned managed identity instead of registry passwords.

```powershell
$PRINCIPAL_ID = az webapp identity assign `
  --resource-group $RG `
  --name $APP `
  --query principalId `
  --output tsv

$REGISTRY_ID = az acr show `
  --resource-group $RG `
  --name $ACR `
  --query id `
  --output tsv

az role assignment create `
  --assignee $PRINCIPAL_ID `
  --scope $REGISTRY_ID `
  --role AcrPull

az webapp config set `
  --resource-group $RG `
  --name $APP `
  --generic-configurations '{"acrUseManagedIdentityCreds": true}'
```

## Configure App Settings

These settings tell App Service which port to route to, enable persistent `/home` storage, and point SQLite at `/home/dev.db`.

```powershell
az webapp config appsettings set `
  --resource-group $RG `
  --name $APP `
  --settings `
    WEBSITES_PORT=3000 `
    WEBSITES_ENABLE_APP_SERVICE_STORAGE=true `
    DATABASE_URL="file:/home/dev.db" `
    ALLOWED_EMAIL="$ALLOWED_EMAIL" `
    AUTH_SECRET="$AUTH_SECRET" `
    SETUP_TOKEN="$SETUP_TOKEN" `
    ENABLE_CODE_RUNNER=true

az webapp restart --resource-group $RG --name $APP
```

Open:

```powershell
az webapp browse --resource-group $RG --name $APP
```

Your site URL is:

```text
https://<your-app-name>.azurewebsites.net
```

## First Sign In

On first run, create your password using the setup token. The login screen will show an authenticator-app setup key. Add it to Microsoft Authenticator, Google Authenticator, 1Password, or another TOTP app, then enter the 6-digit code. This first account is the only account the app will create.

If you deploy with an existing database from before two-step verification was added, sign in with your existing email and password. The app will ask for the setup token before it shows the one-time authenticator setup key.

## Logs

```powershell
az webapp log config `
  --resource-group $RG `
  --name $APP `
  --docker-container-logging filesystem

az webapp log tail `
  --resource-group $RG `
  --name $APP
```

## Redeploy After Code Changes

```powershell
$IMAGE="coding-study-tool:v2"

az acr build `
  --registry $ACR `
  --image $IMAGE `
  .

az webapp config container set `
  --resource-group $RG `
  --name $APP `
  --container-image-name "$ACR.azurecr.io/$IMAGE"

az webapp restart --resource-group $RG --name $APP
```

## Optional: Restrict Access by IP

If you have a stable home IP address, restrict the app to that IP:

```powershell
az webapp config access-restriction add `
  --resource-group $RG `
  --name $APP `
  --rule-name "home-ip" `
  --action Allow `
  --ip-address "<your-public-ip>/32" `
  --priority 100

az webapp config access-restriction set `
  --resource-group $RG `
  --name $APP `
  --default-action Deny
```

## Optional: Disable Python Runner

If you ever want to deploy without remote Python execution:

```powershell
az webapp config appsettings set `
  --resource-group $RG `
  --name $APP `
  --settings ENABLE_CODE_RUNNER=false

az webapp restart --resource-group $RG --name $APP
```

Set it back to `true` to use the LeetCode-style runner again.

## Clean Up

This deletes the app, registry, and persistent database:

```powershell
az group delete --name $RG
```
