#!/bin/sh
set -e

# Replace environment variable placeholders in config.js
CONFIG_FILE="/usr/share/nginx/html/config.js"

echo "🔧 Injecting runtime configuration..."

# Replace placeholders with actual environment variables
sed -i "s|__VITE_ASGARDEO_CLIENT_ID__|${VITE_ASGARDEO_CLIENT_ID:-}|g" "$CONFIG_FILE"
sed -i "s|__VITE_ASGARDEO_BASE_URL__|${VITE_ASGARDEO_BASE_URL:-}|g" "$CONFIG_FILE"
sed -i "s|__VITE_REDIRECT_URL__|${VITE_REDIRECT_URL:-}|g" "$CONFIG_FILE"
sed -i "s|__VITE_API_BASE_URL__|${VITE_API_BASE_URL:-}|g" "$CONFIG_FILE"
sed -i "s|__VITE_USER_SERVICE_URL__|${VITE_USER_SERVICE_URL:-}|g" "$CONFIG_FILE"
sed -i "s|__VITE_TASK_SERVICE_URL__|${VITE_TASK_SERVICE_URL:-}|g" "$CONFIG_FILE"
sed -i "s|__VITE_PROJECT_SERVICE_URL__|${VITE_PROJECT_SERVICE_URL:-}|g" "$CONFIG_FILE"

echo "✅ Runtime configuration injected"

# Start nginx
exec nginx -g "daemon off;"

