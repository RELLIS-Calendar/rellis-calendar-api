#!/bin/bash
# Force npm ci to run during deployment

set -e

echo "=========================================="
echo "Installing Node.js dependencies..."
echo "=========================================="

cd /var/app/staging

# Remove old node_modules if exists
if [ -d "node_modules" ]; then
    echo "Removing old node_modules..."
    rm -rf node_modules
fi

# Install dependencies
echo "Running npm ci..."
npm ci --production

echo "Dependencies installed successfully!"
echo "=========================================="

