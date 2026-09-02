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
3. **Environment variable** (type **Config**, not Secret):
   - `NEXT_PUBLIC_SITE_URL` = `https://maleklarif.com` (see [Custom domain](#custom-domain-maleklarifcom) below)
4. Click **Deploy**. Every push to `main` will redeploy automatically.

## Custom domain (maleklarif.com)

### DNS at Hostinger

| Type | Name | Value |
|------|------|--------|
| **A** | `@` | `216.198.79.1` (from Vercel Domains tab) |
| **CNAME** | `www` | `cname.vercel-dns.com` |

Do **not** point `www` → `maleklarif.com` (CNAME to apex). Use Vercel’s CNAME so SSL provisions for both hosts.

Keep email records (MX, SPF, DMARC, autodiscover) unchanged.

### Vercel

1. **Project → Settings → Domains** — add `maleklarif.com` and `www.maleklarif.com`; both should show **Valid Configuration**.
2. Redirect apex → `www` or `www` → apex (either is fine once both have SSL).
3. **Environment variable** (type **Config**, not Secret):
   - `NEXT_PUBLIC_SITE_URL` = `https://maleklarif.com` (or `https://www.maleklarif.com` after `www` SSL is valid)
4. **Redeploy** after changing the env var (values are baked in at build time).

**If `https://www.maleklarif.com` shows a certificate warning** after fixing the `www` CNAME: open **Domains → `www.maleklarif.com` → Refresh** (or remove and re-add the domain). Let's Encrypt re-issues once DNS points at `cname.vercel-dns.com`; allow a few minutes.

### Social previews (Facebook, iMessage, Slack)

- `http://maleklarif.com` redirects to HTTPS automatically.
- Open Graph images are served from `https://maleklarif.com/opengraph-image` (1200×630 PNG).
- After deploy, use [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/) → enter `https://maleklarif.com/` → **Scrape Again** (twice if cache is stale).

## Before go-live

- Set the real contact email in [`content/site.ts`](content/site.ts) (`CONTACT.mailto`).
