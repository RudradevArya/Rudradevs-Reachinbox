import { ConfidentialClientApplication, Configuration, AuthorizationUrlRequest, AuthorizationCodeRequest } from "@azure/msal-node";
import { ClientSecretCredential } from "@azure/identity";
import { Client } from "@microsoft/microsoft-graph-client";
import { TokenCredentialAuthenticationProvider } from "@microsoft/microsoft-graph-client/authProviders/azureTokenCredentials";
import { config } from './config';

if (!config.outlook.clientId || !config.outlook.clientSecret || !config.outlook.tenantId || !config.outlook.redirectUri) {
  throw new Error('Outlook configuration is incomplete. Please check your .env file.');
}

const msalConfig: Configuration = {
  auth: {
    clientId: config.outlook.clientId,
    clientSecret: config.outlook.clientSecret,
    authority: `https://login.microsoftonline.com/${config.outlook.tenantId}`,
  }
};

const pca = new ConfidentialClientApplication(msalConfig);
const redirectUri = config.outlook.redirectUri as string;

export const getOutlookAuthUrl = async () => {
  const authCodeUrlParameters: AuthorizationUrlRequest = {
    scopes: ["https://graph.microsoft.com/.default"],
    redirectUri: redirectUri,
  };

  return await pca.getAuthCodeUrl(authCodeUrlParameters);
};

export const getOutlookToken = async (code: string) => {
  const tokenRequest: AuthorizationCodeRequest = {
    code: code,
    scopes: ["https://graph.microsoft.com/.default"],
    redirectUri: redirectUri,
  };

  const response = await pca.acquireTokenByCode(tokenRequest);
  return response.accessToken;
};

const credential = new ClientSecretCredential(
  config.outlook.tenantId,
  config.outlook.clientId,
  config.outlook.clientSecret
);

const authProvider = new TokenCredentialAuthenticationProvider(credential, {
  scopes: ['https://graph.microsoft.com/.default']
});

const graphClient = Client.initWithMiddleware({
  authProvider: authProvider
});

export const getOutlookClient = () => {
  return graphClient;
};
