# Sweet Shop - Deployment Guide

Complete step-by-step guide to deploy your Sweet Shop application to production.

## 📋 Prerequisites

- [x] MongoDB Atlas account (you already have this configured)
- [ ] [Render](https://render.com) account (for backend)
- [ ] [Vercel](https://vercel.com) account (for frontend)
- [ ] GitHub repository with your code

## 🎯 Deployment Strategy

We'll deploy:
- **Backend** (Node.js/Express API) → Render (free tier)
- **Frontend** (React/Vite) → Vercel (free tier)
- **Database** → MongoDB Atlas (your existing cluster)

---

## Part 1: Backend Deployment (Render)

### Step 1: Push Code to GitHub
```powershell
# If not already done
cd "d:\Ripak\Main\Projects\Sweet Shop"
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/sweet-shop.git
git push -u origin main
```

### Step 2: Create Render Account & Service
1. Go to [render.com](https://render.com) and sign up/sign in
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub account and select your repository
4. Configure the service:
   - **Name:** `sweet-shop-backend` (or your preferred name)
   - **Region:** Choose closest to you
   - **Branch:** `main`
   - **Root Directory:** `backend`
   - **Runtime:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Instance Type:** Free

### Step 3: Set Environment Variables on Render
Click **"Environment"** and add these variables:

| Key | Value |
|-----|-------|
| `NODE_ENV` | `production` |
| `PORT` | `5000` |
| `MONGODB_URI` | `mongodb+srv://solutdeck_db_user:6tcCc1fi3NFVphmB@cluster0.azqkibd.mongodb.net/?appName=Cluster0` |
| `JWT_SECRET` | `sweet_shop_super_secret_key_change_in_production_2024` |
| `JWT_EXPIRE` | `7d` |
| `FRONTEND_ORIGIN` | Leave blank for now, we'll update after frontend deployment |

> ⚠️ **Security Note:** Generate a stronger JWT_SECRET for production:
> ```powershell
> node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
> ```

### Step 4: Deploy Backend
1. Click **"Create Web Service"**
2. Wait for deployment (3-5 minutes)
3. Once deployed, copy your backend URL (e.g., `https://sweet-shop-backend.onrender.com`)
4. Test the health endpoint:
   ```powershell
   curl https://sweet-shop-backend.onrender.com/health
   ```
   Should return: `{"status":"success","message":"Sweet Shop API is running",...}`

---

## Part 2: Frontend Deployment (Vercel)

### Step 5: Update Frontend Environment Variable
Before deploying, create a `.env.production.local` file for local testing:

```powershell
cd "d:\Ripak\Main\Projects\Sweet Shop\frontend"
echo "VITE_API_BASE_URL=https://sweet-shop-backend.onrender.com" > .env.production.local
```

Replace `https://sweet-shop-backend.onrender.com` with your actual Render backend URL.

### Step 6: Test Build Locally
```powershell
cd "d:\Ripak\Main\Projects\Sweet Shop\frontend"
npm install
npm run build
npm run preview
```

Open `http://localhost:4173` and verify the app loads. You may see CORS errors until we update the backend.

### Step 7: Deploy to Vercel
1. Go to [vercel.com](https://vercel.com) and sign up/sign in
2. Click **"Add New..."** → **"Project"**
3. Import your GitHub repository
4. Configure the project:
   - **Framework Preset:** Vite
   - **Root Directory:** `frontend`
   - **Build Command:** `npm run build` (auto-detected)
   - **Output Directory:** `dist` (auto-detected)
   - **Install Command:** `npm install` (auto-detected)

### Step 8: Set Environment Variable on Vercel
1. Go to **"Settings"** → **"Environment Variables"**
2. Add:
   - **Name:** `VITE_API_BASE_URL`
   - **Value:** `https://sweet-shop-backend.onrender.com` (your backend URL, NO `/api` suffix)
   - **Environment:** Production, Preview, Development (select all)
3. Click **"Save"**

### Step 9: Deploy Frontend
1. Click **"Deploy"**
2. Wait for build (1-2 minutes)
3. Once deployed, copy your frontend URL (e.g., `https://sweet-shop.vercel.app`)

---

## Part 3: Final Configuration

### Step 10: Update CORS on Backend
1. Go back to Render dashboard → Your backend service
2. Go to **"Environment"** tab
3. Update the `FRONTEND_ORIGIN` variable:
   - **Value:** `https://sweet-shop.vercel.app` (your Vercel frontend URL)
4. Save changes
5. Render will automatically redeploy (or click **"Manual Deploy"** → **"Deploy latest commit"**)

### Step 11: Redeploy Frontend (to clear cache)
1. In Vercel dashboard → Your project
2. Go to **"Deployments"** tab
3. Click the three dots on the latest deployment → **"Redeploy"**

---

## 🧪 Testing Your Deployment

### Backend Health Check
```powershell
curl https://sweet-shop-backend.onrender.com/health
```
Expected: `{"status":"success","message":"Sweet Shop API is running",...}`

### Test API Endpoints
```powershell
# Get all sweets (should return empty array or existing sweets)
curl https://sweet-shop-backend.onrender.com/api/sweets

# Register a user
$body = @{
  name = "Test User"
  email = "test@example.com"
  password = "Test123!"
} | ConvertTo-Json

Invoke-WebRequest -Uri "https://sweet-shop-backend.onrender.com/api/auth/register" `
  -Method POST `
  -Body $body `
  -ContentType "application/json"
```

### Test Frontend
1. Open your Vercel URL: `https://sweet-shop.vercel.app`
2. Try registering a new account
3. Login with the account
4. Add a sweet (if admin)
5. Browse sweets
6. Test purchase functionality

---

## 🔧 Troubleshooting

### Issue: "Route not found" on login/register
**Cause:** `VITE_API_BASE_URL` includes `/api`  
**Fix:** Remove `/api` from the env var. Use only the base URL (e.g., `https://backend.onrender.com`)

### Issue: CORS errors in browser console
**Cause:** `FRONTEND_ORIGIN` not set or incorrect on backend  
**Fix:** Update `FRONTEND_ORIGIN` on Render to match your exact Vercel URL (including `https://`)

### Issue: Backend sleeping/slow first request
**Cause:** Render free tier sleeps after 15 minutes of inactivity  
**Fix:** Normal behavior on free tier. First request may take 30-60 seconds. Consider upgrading to paid tier for always-on service.

### Issue: "Cannot connect to database"
**Cause:** MongoDB Atlas firewall or connection string issue  
**Fix:**
1. In Atlas → Network Access → Add IP: `0.0.0.0/0` (allow all)
2. Verify `MONGODB_URI` is correct on Render
3. Check Atlas cluster is running

### Issue: JWT errors
**Cause:** `JWT_SECRET` mismatch or not set  
**Fix:** Ensure `JWT_SECRET` is the same value on Render and matches what you're using

---

## 🚀 Next Steps

### Optional Enhancements
1. **Custom Domain:** Add your own domain on Vercel and Render
2. **CI/CD:** Auto-deploy on git push (already configured)
3. **Monitoring:** Set up Render health checks and Vercel analytics
4. **Database Backups:** Configure Atlas automated backups
5. **Rate Limiting:** Add rate limiting middleware to protect API

### Production Best Practices
- [ ] Use a strong `JWT_SECRET` (64+ characters)
- [ ] Set up database backups on Atlas
- [ ] Enable HTTPS only (both platforms do this by default)
- [ ] Add API rate limiting
- [ ] Set up error monitoring (e.g., Sentry)
- [ ] Add logging service
- [ ] Set up staging environment

---

## 📚 Useful Commands

### View Backend Logs
Go to Render dashboard → Your service → **"Logs"** tab

### Trigger Manual Deployment
**Render:** Dashboard → Service → **"Manual Deploy"** button  
**Vercel:** Dashboard → Project → **"Deployments"** → Redeploy

### Rollback Deployment
**Render:** Dashboard → Service → **"Events"** → Select previous deployment → Redeploy  
**Vercel:** Dashboard → Project → **"Deployments"** → Select previous → **"Promote to Production"**

---

## 🎉 Deployment Complete!

Your Sweet Shop is now live:
- 🌐 **Frontend:** https://sweet-shop.vercel.app
- 🔌 **Backend API:** https://sweet-shop-backend.onrender.com
- 📊 **Database:** MongoDB Atlas

**Share your app and enjoy!** 🍬
