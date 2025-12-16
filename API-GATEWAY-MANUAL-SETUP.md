🚀 QUICK START: Create API Gateway via AWS Console
===================================================

## Step-by-Step Instructions (5 minutes)

### Step 1: Open API Gateway Console
1. Go to: https://console.aws.amazon.com/apigateway
2. Make sure you're in region: **us-east-2** (Ohio)
3. Click **"Create API"**

### Step 2: Choose HTTP API
1. Under **"HTTP API"**, click **"Build"**
2. Click **"Add integration"**

### Step 3: Configure Integration
1. **Integration type:** HTTP
2. **URL endpoint:** 
   ```
   http://rellis-calendar-api-env.eba-b5gm3tfj.us-east-2.elasticbeanstalk.com
   ```
3. **Name:** `rellis-calendar-backend`
4. **Method:** `ANY`
5. Click **"Next"**

### Step 4: Configure Routes
1. **Method:** `ANY`
2. **Resource path:** `/{proxy+}`
3. **Integration target:** Select `rellis-calendar-backend`
4. Click **"Next"**

### Step 5: Configure Stages
1. **Stage name:** `prod`
2. **Auto-deploy:** ✅ Enabled
3. Click **"Next"**

### Step 6: Review and Create
1. Review your settings
2. Click **"Create"**
3. **COPY YOUR API URL** - It looks like:
   ```
   https://abc123def4.execute-api.us-east-2.amazonaws.com
   ```

### Step 7: Configure CORS (Important!)
1. In your API, click **"CORS"** in the left menu
2. **Configure CORS settings:**
   - Access-Control-Allow-Origin: `https://main.d2nd1e6tb57dgk.amplifyapp.com`
   - Access-Control-Allow-Headers: `Content-Type,Authorization,X-Amz-Date,X-Api-Key,X-Amz-Security-Token`
   - Access-Control-Allow-Methods: `GET,POST,PUT,DELETE,OPTIONS`
3. Click **"Save"**

### Step 8: Test Your API
Open terminal and test:
```bash
curl https://YOUR-API-ID.execute-api.us-east-2.amazonaws.com/api/events
```

You should see your events data!

### Step 9: Update Frontend Redirect
In your `rellis-calendar-web` project, update `public/redirects.json`:

```json
[
  {
    "source": "/api/<*>",
    "target": "https://YOUR-API-ID.execute-api.us-east-2.amazonaws.com/<*>",
    "status": "200",
    "condition": null
  },
  {
    "source": "/<*>",
    "target": "/index.html",
    "status": "200",
    "condition": null
  }
]
```

**Replace `YOUR-API-ID` with the actual API ID from Step 6!**

### Step 10: Deploy Frontend
```bash
git add public/redirects.json
git commit -m "Update API redirect to use API Gateway"
git push
```

Amplify will automatically redeploy with the new configuration.

## ✅ Verification Checklist

- [ ] API Gateway created in us-east-2
- [ ] HTTP integration points to EB URL
- [ ] Route configured as `ANY /{proxy+}`
- [ ] Stage deployed (prod)
- [ ] CORS configured for Amplify domain
- [ ] API URL tested with curl
- [ ] Frontend redirects.json updated with HTTPS API Gateway URL
- [ ] Changes committed and pushed
- [ ] Amplify redeployed
- [ ] Frontend can fetch data from backend

## 💰 Cost

**HTTP API Gateway:** ~$1.00 per million requests
- First million requests per month: $1.00
- Much cheaper than Application Load Balancer (~$20-30/month)

## 🆘 Troubleshooting

**404 Errors:**
- Check route is `/{proxy+}` not `/api/{proxy+}`
- Verify integration URL doesn't have trailing slash

**CORS Errors:**
- Add your Amplify domain to CORS origins
- Check browser console for specific CORS error

**Connection Refused:**
- Verify EB environment is healthy: `eb status`
- Check EB security group allows inbound on port 80

**Empty Response:**
- Check API Gateway logs in CloudWatch
- Verify integration timeout (29 seconds max)

