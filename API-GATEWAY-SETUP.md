# API Gateway Setup for HTTPS Access

## Why API Gateway?

- ✅ **Free HTTPS** - Built-in SSL/TLS support
- ✅ **Low Cost** - Pay per request (~$1/million requests)
- ✅ **No Load Balancer** - Saves ~$20-30/month
- ✅ **AWS Managed** - No certificate management needed

## Setup Steps

### Step 1: Create HTTP API in API Gateway

1. **Go to AWS Console → API Gateway**
2. **Click "Create API"**
3. **Choose "HTTP API"** (cheaper than REST API)
4. **Click "Build"**

### Step 2: Configure Integration

1. **Add integration:**
   - Integration type: `HTTP`
   - Integration target: `http://rellis-calendar-api-env.eba-b5gm3tfj.us-east-2.elasticbeanstalk.com`
   - Method: `ANY`

2. **Configure routes:**
   - Route: `ANY /{proxy+}`
   - Integration: Select the integration you just created
   - This catches all API requests and forwards them

3. **Configure CORS (if needed):**
   - Add CORS configuration
   - Allow origins: `https://main.d2nd1e6tb57dgk.amplifyapp.com`
   - Allow methods: `GET, POST, PUT, DELETE, OPTIONS`
   - Allow headers: `Content-Type, Authorization`

### Step 3: Deploy API

1. **Click "Deploy"**
2. **Stage name:** `prod` (or `api`)
3. **Note your API URL:** It will look like:
   ```
   https://abcd1234.execute-api.us-east-2.amazonaws.com
   ```

### Step 4: Update Frontend Redirect

Update your Amplify redirect to use the API Gateway URL:

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

### Step 5: Test

```bash
# Test the API Gateway endpoint
curl https://YOUR-API-ID.execute-api.us-east-2.amazonaws.com/api/events

# Test via Amplify redirect
curl https://main.d2nd1e6tb57dgk.amplifyapp.com/api/events
```

## Alternative: Use AWS CLI

If you prefer automation, you can use the AWS CLI:

```bash
# Create HTTP API
aws apigatewayv2 create-api \
  --name rellis-calendar-api-gateway \
  --protocol-type HTTP \
  --target http://rellis-calendar-api-env.eba-b5gm3tfj.us-east-2.elasticbeanstalk.com \
  --region us-east-2

# Note the ApiId from the output, then create a stage
aws apigatewayv2 create-stage \
  --api-id YOUR-API-ID \
  --stage-name prod \
  --auto-deploy \
  --region us-east-2
```

## Cost Comparison

**Load Balancer (ALB):**
- $16.20/month (730 hours × $0.0225/hour)
- $0.008 per LCU-hour
- **Total: ~$20-30/month minimum**

**API Gateway (HTTP API):**
- First 1M requests/month: $1.00
- Next 9M requests: $0.90
- **Total: ~$2-5/month for typical usage**

**Savings: ~$15-25/month**

## Security Notes

1. **Update CORS in your backend** to allow requests from API Gateway
2. **Consider API throttling** in API Gateway to prevent abuse
3. **Enable CloudWatch logging** for monitoring
4. **Optional:** Add API key or AWS IAM authorization for additional security

## Troubleshooting

**404 Errors:**
- Make sure your route is `ANY /{proxy+}` to catch all paths
- Verify integration target has correct EB URL

**CORS Errors:**
- Configure CORS in API Gateway console
- Ensure your backend returns proper CORS headers

**Timeout Errors:**
- API Gateway has 29 second timeout
- Ensure your API responds within this time

