import { config } from '../lib/config';

// Asgardeo Authentication Configuration
export const authConfig = {
  signInRedirectURL: config.redirectUrl,
  signOutRedirectURL: config.redirectUrl,
  clientID: config.asgardeoClientId,
  baseUrl: config.asgardeoBaseUrl,
  scope: ["openid", "email", "profile", "groups", "roles"],
  resourceServerURLs: [config.apiBaseUrl],
};

// API Configuration
export const apiConfig = {
  userServiceUrl: config.userServiceUrl,
  taskServiceUrl: config.taskServiceUrl,
  projectServiceUrl: config.projectServiceUrl,
};
