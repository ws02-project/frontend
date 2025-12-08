import { config } from '../lib/config';

// Asgardeo Authentication Configuration
export const authConfig = {
  signInRedirectURL: config.redirectUrl,
  signOutRedirectURL: config.redirectUrl,
  clientID: config.asgardeoClientId,
  baseUrl: config.asgardeoBaseUrl,
  scope: ["openid", "email", "profile", "groups", "roles"],
  resourceServerURLs: [config.apiBaseUrl],
  // Use localStorage for session persistence across browser tabs
  storage: "localStorage" as const,
};

// API Configuration
export const apiConfig = {
  userServiceUrl: config.userServiceUrl,
  taskServiceUrl: config.taskServiceUrl,
  projectServiceUrl: config.projectServiceUrl,
};
