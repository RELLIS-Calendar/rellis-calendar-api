🔧 API GATEWAY 404 FIX - STEP BY STEP
==========================================

## Problem
Your API Gateway returns `{"message":"Not Found"}` when calling:
https://p4o6wzh11c.execute-api.us-east-2.amazonaws.com/api/events

## Root Cause
The integration URI or route configuration is incorrect.

## ✅ SOLUTION: Fix API Gateway Configuration

### Method 1: AWS Console (EASIEST - DO THIS)

1. **Go to API Gateway Console:**
   https://console.aws.amazon.com/apigateway/home?region=us-east-2

2. **Select your API:** `rellis-calendar-api-gateway` (ID: p4o6wzh11c)

3. **Check Routes:**
   - Click "Routes" in the left menu
   - You should see: `ANY /{proxy+}`
   - If not, click "Create" and add:
     - Method: `ANY`
     - Path: `/{proxy+}`

4. **Fix Integration:**
   - Click "Integrations" in the left menu
   - Click on your integration
   - **Check Integration URI - it should be ONE of these:**
   
   **Option A (Recommended):**
   ```
   http://rellis-calendar-api-env.eba-b5gm3tfj.us-east-2.elasticbeanstalk.com/{proxy}
   ```
   
   **Option B (Also works):**
   ```
   http://rellis-calendar-api-env.eba-b5gm3tfj.us-east-2.elasticbeanstalk.com
   ```
   With "Append path to URL" enabled

5. **Deploy Changes:**
   - Click "Deployments" in left menu
   - Click "Deploy" button
   - Stage: `prod` (or `$default`)
   - Click "Deploy"

6. **Test:**
   ```bash
   curl https://p4o6wzh11c.execute-api.us-east-2.amazonaws.com/api/events
   ```

### Method 2: AWS CLI (If you prefer command line)

```bash
# Step 1: Get integration ID
INTEGRATION_ID=$(aws apigatewayv2 get-integrations \
  --api-id p4o6wzh11c \
  --region us-east-2 \
  --query 'Items[0].IntegrationId' \
  --output text)

echo "Integration ID: $INTEGRATION_ID"

# Step 2: Update integration URI to include {proxy}
aws apigatewayv2 update-integration \
  --api-id p4o6wzh11c \
  --integration-id "$INTEGRATION_ID" \
  --integration-uri 'http://rellis-calendar-api-env.eba-b5gm3tfj.us-east-2.elasticbeanstalk.com/{proxy}' \
  --region us-east-2

# Step 3: Verify route exists
aws apigatewayv2 get-routes \
  --api-id p4o6wzh11c \
  --region us-east-2 \
  --query 'Items[].RouteKey'

# Step 4: Deploy (if auto-deploy is not enabled)
aws apigatewayv2 create-deployment \
  --api-id p4o6wzh11c \
  --region us-east-2 \
  --stage-name prod

# Step 5: Test
curl https://p4o6wzh11c.execute-api.us-east-2.amazonaws.com/api/events
```

## 🧪 Testing Steps

After making changes, test in this order:

### 1. Test Backend Directly (should work)
```bash
curl http://rellis-calendar-api-env.eba-b5gm3tfj.us-east-2.elasticbeanstalk.com/api/events
```
Expected: JSON with events data

### 2. Test API Gateway (should work after fix)
```bash
curl https://p4o6wzh11c.execute-api.us-east-2.amazonaws.com/api/events
```
Expected: Same JSON with events data

### 3. Test via Amplify redirect (after pushing code)
```bash
curl https://main.d2nd1e6tb57dgk.amplifyapp.com/api/events
```
Expected: Same JSON with events data

## 🔍 Common Configuration Issues

### Issue 1: Integration URI missing {proxy}
❌ Wrong: `http://backend.com`
✅ Correct: `http://backend.com/{proxy}`

### Issue 2: No catch-all route
❌ Wrong: Route is `/api/{proxy+}`
✅ Correct: Route is `/{proxy+}` (catches all paths)

### Issue 3: Route not connected to integration
- In Routes, click your route
- Make sure "Integration" is selected (not "Mock")
- Integration should point to your EB environment

### Issue 4: Stage not deployed
- After making changes, you MUST deploy
- Go to Deployments → Deploy → Select stage → Deploy

## 📋 Verification Checklist

After fixing, verify:
- [ ] Route exists: `ANY /{proxy+}`
- [ ] Integration URI includes `{proxy}` or has "append path" enabled
- [ ] Integration points to: `http://rellis-calendar-api-env.eba-b5gm3tfj.us-east-2.elasticbeanstalk.com`
- [ ] Stage deployed (check "Last Deployment" timestamp)
- [ ] curl test returns data (not 404)
- [ ] Frontend redirects.json has correct API Gateway URL
- [ ] Frontend deployed to Amplify

## 🎯 Expected Result

Once fixed:
```bash
$ curl https://p4o6wzh11c.execute-api.us-east-2.amazonaws.com/api/events
[
  {
    "id": 1,
    "title": "Event Name",
    ...
  }
]
```

## 🆘 Still Not Working?

If you still see 404 after trying Method 1:

1. **Delete and recreate the integration:**
   - In API Gateway console
   - Integrations → Delete existing integration
   - Create new integration with correct URI
   - Attach to route `/{proxy+}`
   - Deploy

2. **Check CloudWatch Logs:**
   - API Gateway → Logging
   - Enable CloudWatch logs
   - Check for error messages

3. **Verify EB environment is healthy:**
   ```bash
   eb status
   curl http://rellis-calendar-api-env.eba-b5gm3tfj.us-east-2.elasticbeanstalk.com/api/events
   ```

## 📞 Next Steps After Fix

Once API Gateway works:

1. ✅ redirects.json is already updated
2. Deploy frontend:
   ```bash
   cd rellis-calendar-web
   git add public/redirects.json
   git commit -m "Update API Gateway endpoint"
   git push
   ```
3. Wait for Amplify to redeploy (~3 min)
4. Test your app!

═══════════════════════════════════════════════════════════
💡 TIP: Use Method 1 (AWS Console) - it's visual and easier
         to verify the configuration is correct.
═══════════════════════════════════════════════════════════

