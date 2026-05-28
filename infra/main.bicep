targetScope = 'resourceGroup'

@description('Azure region for all resources.')
param location string = resourceGroup().location

@description('Globally unique Azure App Service app name. The final URL is https://<appName>.azurewebsites.net.')
param appName string = 'coding-study-${uniqueString(resourceGroup().id)}'

@description('Globally unique Azure Container Registry name. Use lowercase letters and numbers only.')
@minLength(5)
@maxLength(50)
param acrName string = 'codingstudy${uniqueString(resourceGroup().id)}'

@description('App Service plan name.')
param appServicePlanName string = '${appName}-plan'

@description('Docker image repository inside the Azure Container Registry.')
param imageRepository string = 'coding-study-tool'

@description('Docker image tag that App Service should run.')
param imageTag string = 'v1'

@description('Only this email can create the first account or sign in.')
param allowedEmail string

@secure()
@description('Long random value used to sign app sessions.')
param authSecret string

@secure()
@description('One-time setup token required for account and authenticator setup.')
param setupToken string

@description('Enable the Python code runner. Keep true only for your private deployment.')
param enableCodeRunner bool = true

@description('Require authenticator-app two-step verification.')
param twoFactorRequired bool = true

@description('Optional CIDR block allowed to reach the app, for example 203.0.113.10/32. Leave blank to allow public access.')
param allowedIpCidr string = ''

@allowed([
  'B1'
  'B2'
  'B3'
  'P0v3'
  'P1v3'
])
@description('Linux App Service Plan SKU. B1 is the lowest recommended paid SKU for custom containers.')
param appServiceSkuName string = 'B1'

@allowed([
  'Basic'
  'Standard'
  'Premium'
])
@description('Azure Container Registry SKU.')
param acrSkuName string = 'Basic'

var appServiceSkuTier = startsWith(appServiceSkuName, 'P') ? 'PremiumV3' : 'Basic'
var containerImage = '${acr.properties.loginServer}/${imageRepository}:${imageTag}'
var booleanTrue = 'true'
var booleanFalse = 'false'
var ipSecurityRestrictions = empty(allowedIpCidr)
  ? []
  : [
      {
        name: 'allowed-client-ip'
        description: 'Only allow the configured client IP range.'
        ipAddress: allowedIpCidr
        action: 'Allow'
        priority: 100
      }
    ]

resource acr 'Microsoft.ContainerRegistry/registries@2023-07-01' = {
  name: acrName
  location: location
  sku: {
    name: acrSkuName
  }
  properties: {
    adminUserEnabled: false
  }
}

resource appServicePlan 'Microsoft.Web/serverfarms@2023-12-01' = {
  name: appServicePlanName
  location: location
  kind: 'linux'
  sku: {
    name: appServiceSkuName
    tier: appServiceSkuTier
    size: appServiceSkuName
    capacity: 1
  }
  properties: {
    reserved: true
  }
}

resource webApp 'Microsoft.Web/sites@2023-12-01' = {
  name: appName
  location: location
  kind: 'app,linux,container'
  identity: {
    type: 'SystemAssigned'
  }
  properties: {
    serverFarmId: appServicePlan.id
    httpsOnly: true
    clientAffinityEnabled: false
    siteConfig: {
      alwaysOn: true
      acrUseManagedIdentityCreds: true
      ftpsState: 'Disabled'
      http20Enabled: true
      linuxFxVersion: 'DOCKER|${containerImage}'
      minTlsVersion: '1.2'
      ipSecurityRestrictions: ipSecurityRestrictions
      ipSecurityRestrictionsDefaultAction: empty(allowedIpCidr) ? 'Allow' : 'Deny'
      scmIpSecurityRestrictions: ipSecurityRestrictions
      scmIpSecurityRestrictionsDefaultAction: empty(allowedIpCidr) ? 'Allow' : 'Deny'
      appSettings: [
        {
          name: 'WEBSITES_PORT'
          value: '3000'
        }
        {
          name: 'WEBSITES_ENABLE_APP_SERVICE_STORAGE'
          value: booleanTrue
        }
        {
          name: 'DATABASE_URL'
          value: 'file:/home/dev.db'
        }
        {
          name: 'ALLOWED_EMAIL'
          value: allowedEmail
        }
        {
          name: 'AUTH_SECRET'
          value: authSecret
        }
        {
          name: 'SETUP_TOKEN'
          value: setupToken
        }
        {
          name: 'TWO_FACTOR_REQUIRED'
          value: twoFactorRequired ? booleanTrue : booleanFalse
        }
        {
          name: 'ENABLE_CODE_RUNNER'
          value: enableCodeRunner ? booleanTrue : booleanFalse
        }
        {
          name: 'NEXT_TELEMETRY_DISABLED'
          value: '1'
        }
      ]
    }
  }
}

resource acrPullRoleAssignment 'Microsoft.Authorization/roleAssignments@2022-04-01' = {
  name: guid(acr.id, webApp.id, 'AcrPull')
  scope: acr
  properties: {
    principalId: webApp.identity.principalId
    principalType: 'ServicePrincipal'
    roleDefinitionId: subscriptionResourceId(
      'Microsoft.Authorization/roleDefinitions',
      '7f951dda-4ed3-4680-a7ca-43fe172d538d'
    )
  }
}

output appUrl string = 'https://${appName}.azurewebsites.net'
output acrLoginServer string = acr.properties.loginServer
output imageName string = containerImage
