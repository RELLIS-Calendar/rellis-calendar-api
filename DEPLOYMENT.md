# Deployment Instructions for AWS Elastic Beanstalk

## Issue Fixed
The "Procfile could not be parsed" error has been resolved by:
1. **Removing the Procfile** - AWS Elastic Beanstalk for Node.js doesn't need a Procfile
2. **Using package.json start script** - EB automatically runs `npm start`
3. **Fixing .ebextensions/nodecommand.config** - Removed trailing whitespace

## Deploy from Deploy Directory

### Option 1: Upload ZIP to AWS Console
1. Build the project:
   ```bash
   npm run build
   ```

2. Copy built files to deploy directory:
   ```bash
   cp -r dist deploy/
   ```

3. Create deployment package:
   ```bash
   cd deploy
   zip -r ../deploy-package.zip . -x "node_modules/*"
   ```

4. Upload `deploy-package.zip` to AWS Elastic Beanstalk console

### Option 2: Use EB CLI (if initialized in deploy directory)
1. Build the project:
   ```bash
   npm run build
   ```

2. Copy built files:
   ```bash
   cp -r dist deploy/
   ```

3. Deploy from deploy directory:
   ```bash
   cd deploy
   eb deploy
   ```

### Option 3: Use EB CLI from root (if initialized in root)
1. Build the project:
   ```bash
   npm run build
   ```

2. Deploy:
   ```bash
   eb deploy
   ```

## What Changed

### Files Removed:
- `Procfile` (root)
- `deploy/Procfile`

### Files Modified:
- `deploy/.ebextensions/nodecommand.config` - Added NodeCommand configuration

### How EB Will Start Your App:
AWS Elastic Beanstalk will automatically run `npm start` which executes `node dist/server.js` as defined in your package.json.

## Troubleshooting

If deployment still fails:
1. Check that `dist/server.js` exists after build
2. Verify package.json has `"start": "node dist/server.js"`
3. Check EB logs: `eb logs` or download from AWS console
4. Ensure environment variables are set in EB console (not in code)

## Environment Variables

Set these in AWS Elastic Beanstalk Console → Configuration → Software → Environment properties:
- `DATABASE_URL` - Your MariaDB connection string
- `NODE_ENV` - Set to `production` (already in nodecommand.config)
- Any other API keys or secrets

**Never commit .env files or secrets to version control!**

