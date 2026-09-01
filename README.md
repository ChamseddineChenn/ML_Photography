# ML Photography

Next.js site for Malek Larif — cinematic hero, gallery, prints shop, and journal.

## Local development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Production build

```bash
npm run build
npm start
```

## Deploy to GitHub

Repository: **https://github.com/ChamseddineChenn/ML_Photography** (private)

To push future changes from this folder:

```bash
git add .
git commit -m "Your message"
git push
```

Or run [`scripts/push-github.ps1`](scripts/push-github.ps1) on a fresh machine.

## Deploy to Vercel (manual)

1. Sign in at [vercel.com/new](https://vercel.com/new) and **Import** `ChamseddineChenn/ML_Photography` from GitHub (grant Vercel access to the repo if prompted).
2. Framework: **Next.js** (auto-detected). **Root Directory:** leave as `.` (repo root is the app).
3. **Environment variable** (add before or after first deploy):
   - `NEXT_PUBLIC_SITE_URL` = your canonical URL once you have one (e.g. `https://www.yourdomain.com`). Until then, use the `*.vercel.app` URL Vercel assigns.
4. Click **Deploy**. Every push to `main` will redeploy automatically.

## Custom domain

1. In Vercel: **Project → Settings → Domains** → add your domain (apex and/or `www`).
2. At your DNS registrar, add the records Vercel shows (usually **A** for apex, **CNAME** for `www`).
3. Wait for SSL (usually a few minutes).
4. Set `NEXT_PUBLIC_SITE_URL` to the canonical URL and **Redeploy**.

## Before go-live

- Set the real contact email in [`content/site.ts`](content/site.ts) (`CONTACT.mailto`).
