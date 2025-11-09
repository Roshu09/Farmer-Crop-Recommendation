# Quick Deployment Guide

Follow these steps to deploy your Crop Recommendation System:

## Prerequisites
- GitHub account
- Your code pushed to a GitHub repository

---

## Step 1: Deploy Backend (5 minutes)

### Option A: Render (Recommended - Free)

1. Go to https://render.com and sign in with GitHub
2. Click **New +** → **Web Service**
3. Connect your repository
4. Fill in:
   - **Name**: `crop-backend`
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
5. Add these environment variables:
   \`\`\`
   MONGODB_URI=mongodb+srv://guptaroshan8084_db_user:4JsjGi9Oz1C5TKZq@cluster0.fuxnlys.mongodb.net/Cropfarmer?retryWrites=true&w=majority
   JWT_SECRET=your-super-secret-jwt-key-here-12345
   WEATHERAPI_KEY=2e6df5dd3f894fc2807142237251008
   DATA_GOV_API_KEY=579b464db66ec23bdd000001cf79eb7aaf544e166ae657cc8fdcf7b2
   NODE_ENV=production
   FRONTEND_URL=https://your-app.vercel.app
   \`\`\`
6. Click **Deploy**
7. Wait 5-10 minutes, then copy your backend URL (e.g., `https://crop-backend.onrender.com`)

### Option B: Railway

1. Go to https://railway.app and sign in with GitHub
2. Click **New Project** → **Deploy from GitHub repo**
3. Select your repository
4. Railway will auto-detect the backend
5. Add the same environment variables as above
6. Deploy and copy your backend URL

---

## Step 2: Deploy Frontend (3 minutes)

1. Go to https://vercel.com and sign in with GitHub
2. Click **Add New** → **Project**
3. Import your repository
4. Vercel auto-detects Next.js settings
5. Add environment variable:
   \`\`\`
   NEXT_PUBLIC_API_URL=https://crop-backend.onrender.com
   \`\`\`
   (Use the URL from Step 1)
6. Click **Deploy**
7. Wait 2-3 minutes

---

## Step 3: Update CORS (1 minute)

1. After Vercel gives you a URL (e.g., `https://crop-system.vercel.app`)
2. Go back to Render dashboard
3. Find your backend service → **Environment** tab
4. Update `FRONTEND_URL` to your Vercel URL
5. Click **Save** (auto-redeploys)

---

## Step 4: Whitelist Render IP in MongoDB

1. Go to MongoDB Atlas: https://cloud.mongodb.com
2. Click **Network Access**
3. Click **Add IP Address**
4. Choose **Allow Access from Anywhere** (0.0.0.0/0)
5. Click **Confirm**

---

## Step 5: Test Your App

Visit your Vercel URL and test:
- User signup/login
- Dashboard weather
- Crop recommendations
- Market prices

---

## Troubleshooting

**Backend not responding:**
- Check Render logs for errors
- Verify MongoDB connection (check IP whitelist)
- Free Render plan sleeps after 15 min - first request takes 30s

**Frontend can't connect to backend:**
- Verify `NEXT_PUBLIC_API_URL` in Vercel
- Check CORS settings (FRONTEND_URL in Render)
- Check backend health: `https://your-backend.onrender.com/api/health`

**Database connection failed:**
- Verify MongoDB Atlas IP whitelist includes 0.0.0.0/0
- Check MONGODB_URI is correct in Render

---

## Your Live URLs

After deployment, you'll have:
- **Frontend**: `https://your-project.vercel.app`
- **Backend**: `https://crop-backend.onrender.com`
- **Database**: MongoDB Atlas (already set up)

Total time: **10-15 minutes**
Total cost: **$0/month**

---

## Next Steps

- Add custom domain in Vercel settings
- Monitor usage in Vercel and Render dashboards
- Upgrade to paid plans if needed (for always-on backend)
