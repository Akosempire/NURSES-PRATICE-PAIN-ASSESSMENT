# Deploying to Vercel Guide

This application is fully configured and ready for 1-click deployment on **Vercel**.

## Method 1: Deploy via Vercel Web Dashboard & GitHub (Recommended)

1. Push this project repository to **GitHub** (or GitLab / Bitbucket).
2. Go to [vercel.com](https://vercel.com) and log in.
3. Click **"Add New..."** $\rightarrow$ **"Project"**.
4. Import your GitHub repository.
5. Vercel will automatically detect the settings:
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`
6. *(Optional)* Expand **Environment Variables** and add:
   - `VITE_SHEETS_WEBHOOK_URL` = *(Your Google Apps Script Web App URL)*
   *(You can also set this directly inside the app using the "Sheets Sync" console)*.
7. Click **"Deploy"**.
8. In ~30 seconds, your site will be live on a secure HTTPS domain (e.g., `https://your-project.vercel.app`).

---

## Method 2: Deploy via Vercel CLI

If you use the terminal:

```bash
# 1. Install Vercel CLI globally (if not already installed)
npm install -g vercel

# 2. Deploy directly from the project directory
vercel

# 3. For production release
vercel --prod
```

---

## Configuration Files Included

- `vercel.json`: Handles SPA client-side routing rewrites (`/*` $\rightarrow$ `/index.html`), cache headers for static assets, and security headers.
- `.vercelignore`: Prevents unnecessary files from uploading to the build container.
- `.env.example`: Documents the optional `VITE_SHEETS_WEBHOOK_URL` environment variable.
