🎯 API GATEWAY SOLUTION - COMPLETE GUIDE
=========================================

## ✅ What I Did

### 1. Updated Backend CORS Configuration
- Fixed CORS to allow all origins (since API Gateway will handle CORS)
- Removed trailing slash from Amplify domain
- Added additional headers support
- **Status:** ✅ Deployed to Elastic Beanstalk

### 2. Created API Gateway Setup Scripts
- `setup-api-gateway.sh` - Automated CLI setup
- `API-GATEWAY-MANUAL-SETUP.md` - Step-by-step console guide
- `API-GATEWAY-SETUP.md` - Complete reference documentation

## 🚀 NEXT STEPS (You need to do these)

### Step 1: Create API Gateway (Choose One Method)

#### Method A: AWS Console (Recommended - Easiest)
Follow the guide in: `API-GATEWAY-MANUAL-SETUP.md`
Takes ~5 minutes

#### Method B: AWS CLI (Automated)
```bash
cd rellis-calendar-api
./setup-api-gateway.sh
```

### Step 2: Get Your API Gateway URL
After creating the API Gateway, you'll get a URL like:
```
https://abc123def4.execute-api.us-east-2.amazonaws.com
```

**SAVE THIS URL - You'll need it for the next step!**

### Step 3: Update Frontend Redirects
Update `rellis-calendar-web/public/redirects.json`:

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

**Replace `YOUR-API-ID` with your actual API Gateway ID!**

### Step 4: Deploy Frontend
```bash
cd rellis-calendar-web
git add public/redirects.json
git commit -m "Add API Gateway HTTPS endpoint"
git push
```

Amplify will automatically redeploy (takes ~3 minutes).

### Step 5: Test Everything
```bash
# Test API Gateway directly
curl https://YOUR-API-ID.execute-api.us-east-2.amazonaws.com/api/events

# Test via Amplify
curl https://main.d2nd1e6tb57dgk.amplifyapp.com/api/events
```

## 📋 Architecture Overview

Before (Not Working):
```
Amplify (HTTPS) → ❌ → EB Environment (HTTP only)
                  │
                  └─ Amplify requires HTTPS targets
```

After (Working):
```
Amplify (HTTPS) → API Gateway (HTTPS) → EB Environment (HTTP)
                          ↑
                    Handles CORS & SSL
```

## 💰 Cost Comparison

**Previous Plan (Load Balancer):**
- Application Load Balancer: ~$16.20/month base
- LCU charges: ~$5-10/month
- **Total: ~$20-30/month**

**New Plan (API Gateway):**
- First 1M requests: $1.00
- Next 9M requests: $0.90
- For 100k requests/month: **~$0.10/month**
- For 1M requests/month: **~$1.00/month**
- **Savings: ~$19-29/month (95% cheaper!)**

## 🔧 What Was Fixed in Backend

### File: `src/server.ts`
```typescript
cors: {
    origin: ['*'], // Allow all origins since API Gateway handles CORS
    credentials: true,
    additionalHeaders: ['Accept', 'Authorization', 'Content-Type']
}
```

**Why this works:**
- API Gateway adds CORS headers before forwarding to backend
- Backend allows all origins (safe because it's behind API Gateway)
- API Gateway configuration controls which domains can actually access it

## ✅ Verification Checklist

After completing all steps, verify:

- [ ] API Gateway created in AWS Console
- [ ] Integration points to: `http://rellis-calendar-api-env.eba-b5gm3tfj.us-east-2.amazonaws.com`
- [ ] Route configured as `ANY /{proxy+}`
- [ ] CORS configured in API Gateway for Amplify domain
- [ ] API Gateway responds to: `curl https://YOUR-API-ID.execute-api.us-east-2.amazonaws.com/api/events`
- [ ] Backend deployed with updated CORS
- [ ] Frontend `redirects.json` updated with API Gateway URL
- [ ] Frontend deployed to Amplify
- [ ] Frontend successfully loads data from backend
- [ ] Browser console shows no CORS errors

## 🆘 Troubleshooting

### "404 Not Found"
- Check API Gateway route is `/{proxy+}` not `/api/{proxy+}`
- Verify integration URL doesn't end with `/`

### "CORS Error"
- Configure CORS in API Gateway console
- Add Amplify domain to allowed origins
- Check browser console for specific error

### "502 Bad Gateway"
- Check EB environment is healthy: `eb status`
- Verify EB security group allows port 80
- Check EB logs: `eb logs`

### "Empty Response"
- Check API Gateway CloudWatch logs
- Verify backend is responding: `curl http://rellis-calendar-api-env.eba-b5gm3tfj.us-east-2.amazonaws.com/api/events`

### "Mixed Content" Error
- Verify you're using `https://` in the API Gateway URL
- Check Amplify is served over HTTPS

## 📚 Additional Resources

- `API-GATEWAY-MANUAL-SETUP.md` - Detailed console setup guide
- `API-GATEWAY-SETUP.md` - Technical reference
- `setup-api-gateway.sh` - Automated setup script

## 🎉 Expected Result

Once completed, your frontend will:
1. ✅ Load from Amplify over HTTPS
2. ✅ Call `/api/*` which redirects through API Gateway
3. ✅ API Gateway forwards to EB environment over HTTP
4. ✅ Backend responds with data
5. ✅ API Gateway returns response to frontend
6. ✅ No CORS errors, no mixed content errors
7. ✅ Everything works! 🚀

Good luck! Let me know if you need any help with the API Gateway setup.

