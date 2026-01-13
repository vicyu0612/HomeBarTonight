#!/bin/sh

#  ci_post_clone.sh
#  
#  This script runs after the repository is cloned by Xcode Cloud
#  but before the build starts.
#

# Stop on error
set -e

echo "📦 CI Post Clone: Step 1 - Installing Node.js..."
# Use Homebrew to install Node.js (Xcode Cloud environments have Homebrew)
# We use 'brew install node' to get the latest stable version
export HOMEBREW_NO_INSTALL_CLEANUP=1
brew install node

echo "📦 CI Post Clone: Step 2 - Installing Dependencies..."
# Install project dependencies (including Capacitor plugins)
npm ci

echo "📦 CI Post Clone: Step 3 - Building Web Assets..."
# Build the Vite/React app to generate the 'dist' folder
npm run build

echo "📦 CI Post Clone: Step 4 - Syncing Capacitor..."
# Sync the web assets and plugins to the native iOS project
# This ensures 'ios/App/App/public' is populated and native plugins are linked
npx cap sync ios

echo "✅ CI Post Clone: Completed Successfully!"
