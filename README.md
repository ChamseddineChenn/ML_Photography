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

From this folder (`web/`):

```bash
gh auth login -h github.com -p https -w
gh repo create ML_Photography --private --source=. --remote=origin --push
```

If `ML_Photography` is taken, use `ml-photography` instead.

## Deploy to Vercel

1. Import the **ML_Photography** GitHub repo at [vercel.com/new](https://vercel.com/new).
2. Framework: **Next.js** (auto-detected). Root directory: `.`
3. Add environment variable:
   - `NEXT_PUBLIC_SITE_URL` = your canonical URL (e.g. `https://www.yourdomain.com`)
4. Deploy, then add your custom domain under **Project → Settings → Domains** and point DNS at Vercel.

## Before go-live

- Set the real contact email in [`content/site.ts`](content/site.ts) (`CONTACT.mailto`).
