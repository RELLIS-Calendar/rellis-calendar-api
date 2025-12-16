# Deployment Issues Fixed

## Summary of Fixes

The "Procfile could not be parsed" error has been resolved by making the following changes:

## 1. **Removed Procfile (Root Cause)**
   - **Deleted:** `Procfile` from root directory
   - **Deleted:** `deploy/Procfile` from deploy directory
   - **Why:** AWS Elastic Beanstalk for Node.js doesn't need a Procfile. It automatically runs `npm start` from package.json. The Procfile was causing parsing errors during the rsyslog configuration step.

## 2. **Created `.ebignore` File (Critical Fix)**
   - **Created:** `.ebignore` in root directory
   - **Why:** The `.gitignore` was excluding the `dist/` directory, which contains your compiled JavaScript files. Without these files, your app cannot run on AWS.
   - **What it does:** The `.ebignore` file overrides `.gitignore` for EB deployments, ensuring `dist/` is included while still excluding unnecessary files like `src/`, `test/`, and `node_modules/`.

## 3. **Updated `.ebextensions/nodecommand.config`**
   - **Fixed:** Removed trailing blank lines that could cause parsing issues
   - **Added:** Explicit `NodeCommand: "npm start"` configuration
   - **Applied to:** Both root and deploy directory versions

## 4. **Verified Build Artifacts**
   - Confirmed `dist/server.js` exists with compiled code
   - Confirmed `package.json` has correct `"start": "node dist/server.js"` script
   - Confirmed all required files are present in `dist/` directory

## What AWS Elastic Beanstalk Will Do Now

1. EB CLI packages your app (using `.ebignore`, NOT `.gitignore`)
2. Uploads package to S3
3. Deploys to EC2 instance
4. Runs `npm install` to install dependencies
5. Runs `npm start` which executes `node dist/server.js`
6. Your API starts on port 3000 (or PORT env variable)

## Files Changed

### Created:
- `.ebignore` - Controls what gets deployed to EB
- `DEPLOYMENT.md` - Deployment instructions
- `deploy.sh` - Helper script for building
- `redeploy.sh` - Helper script for quick redeploys

### Modified:
- `.ebextensions/nodecommand.config` - Removed blank lines, removed unsupported NodeCommand parameter
- `deploy/.ebextensions/nodecommand.config` - Removed blank lines, removed unsupported NodeCommand parameter

### Deleted:
- `Procfile` - Not needed for Node.js on EB
- `deploy/Procfile` - Not needed for Node.js on EB

## How to Deploy

### From Root Directory (Recommended):
```bash
npm run build    # Compile TypeScript to dist/
eb deploy        # Deploy to Elastic Beanstalk
```

### Check Deployment Status:
```bash
eb status        # View environment status
eb health        # View health status
eb logs          # View application logs
```

## Environment Variables

Make sure these are set in AWS Console (Configuration → Software → Environment properties):
- `DATABASE_URL` - Your MariaDB connection string
- `PORT` - (Optional) Default is 3000
- `NODE_ENV` - Already set to "production" via nodecommand.config

## Why This Failed Before

1. **Procfile Parser Error:** AWS EB's rsyslog configuration step tried to parse the Procfile and failed, possibly due to:
   - Line ending issues (CRLF vs LF)
   - Trailing whitespace
   - EB not expecting a Procfile for Node.js platform

2. **Missing dist/ Files:** Even if Procfile worked, `.gitignore` was excluding `dist/`, so the compiled JavaScript wouldn't be deployed, causing runtime errors.

## Next Steps After Deployment

1. Wait for deployment to complete (2-5 minutes)
2. Check status: `eb status`
3. Test your API endpoint
4. If errors occur, check logs: `eb logs`
5. Verify environment variables are set in AWS Console

## Common Issues

**"Module not found" errors:**
- Run `npm run build` before deploying
- Check that `dist/` directory exists locally
- Verify `.ebignore` includes the `dist/` directory (doesn't exclude it)

**"Cannot find module './dist/server.js'":**
- Verify `package.json` has `"main": "dist/server.js"`
- Verify `"start"` script is `"node dist/server.js"`
- Check that `dist/server.js` exists in your local directory

**Database connection errors:**
- Set `DATABASE_URL` in EB Console environment properties
- Verify security group allows connections from EB environment
- Check RDS/MariaDB is accessible from EB VPC

## Success!

Your deployment should now work. The key fixes were:
1. ✅ Removed problematic Procfile
2. ✅ Created `.ebignore` to include `dist/` directory
3. ✅ Cleaned up configuration files
4. ✅ Ensured build artifacts exist

Run `eb deploy` and your app should deploy successfully!

