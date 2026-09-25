# The shop

How a sale works, and the one-time setup to switch it on. Two products, both
in Setups and both defined once in `lib/shop/products.ts`:

- **The 98¢ Trade**, €5, at `/projects/construct/material/setups/the-98c-trade`
  (short link for posts: **tobiadonadon.com/98c**).
- **Launchr**, €12, at `/projects/construct/material/setups/launchr`, on
  Stripe product `prod_VKL1qwlByvTm4z`. Its page is the 3D device stage
  (`launchr-stage.tsx`, `device-stage.tsx`), playing the four example films in
  `public/shop/launchr/`.

(Motion Director, in Skills, is free: a plain download like the other skills,
not part of the shop.)

## How a sale works

1. **Buy.** The button posts to `/api/checkout`, which opens Stripe's hosted
   checkout for €5 (cards, Apple Pay, Google Pay — whatever is on in Stripe).
2. **Paid.** Stripe sends the buyer to `…/the-98c-trade/thanks?session_id=…`.
   The page asks Stripe whether that session is paid and shows the download.
3. **Email.** Stripe calls `/api/stripe/webhook`; the site emails the buyer
   **from tobia10donadon@gmail.com** through Gmail. The 98¢ Trade's zip is
   attached, with a download link as backup. Launchr's email carries the link
   only (`attach: false`): Gmail blocks any zip holding script files, and its
   engine is `.mjs`. If Gmail ever refuses an attachment anyway, the same
   email goes again with the link only. Replies go to that
   inbox, and every delivery is in its Sent folder. The webhook is the only sender, so it can't go twice;
   if it fails, Stripe retries for three days.
4. **Download.** `/api/download?session_id=…` checks with Stripe again, then
   serves the zip. The link in the email keeps working.
5. **You** get Stripe's own payment notification, and the buyer appears under
   Stripe → Customers.

**There is no database.** Stripe is the record of every purchase: who, when,
what, and whether the email went (the payment is stamped `delivered_at`).

**The zips are encrypted in the repo** (`private/*.zip.enc`), because the
repo is public. Keep each under about 4 MB: Vercel's function responses stop
at 4.5 MB and the download is served by one. The key lives only in `.env.local` and in Vercel.

## One-time setup

### 1. Stripe (done on 2026-09-23)

- Live secret key is in `.env.local` as `STRIPE_SECRET_KEY`.
- Product `prod_VJUGojh9orpbsI`, renamed to "The 98¢ Trade" so checkout
  shows the same name as the page. Sales are charged **€5** from
  `lib/shop/products.ts` (which the page reads too) and attached to this
  product.
- Webhook `we_1UIrMzB7HQhkKmiFoyNiR8Ey` → `https://www.tobiadonadon.com/api/stripe/webhook`
  for `checkout.session.completed` and `checkout.session.async_payment_succeeded`.
  Its signing secret is in `.env.local` as `STRIPE_WEBHOOK_SECRET`.
- Still worth doing in the dashboard: Settings → Customer emails → turn on
  **Successful payments** (Stripe's own receipt).

### 2. Email through Gmail

- Create an **App Password** for tobia10donadon@gmail.com at
  myaccount.google.com/apppasswords (needs 2-Step Verification on). Put it in
  `.env.local` and Vercel as `GMAIL_APP_PASSWORD`.
- Gmail allows about 500 recipients a day from a personal account. If a post
  sells more than that in a day, the rest go out as Stripe retries the next
  day; buyers still have the download on screen straight away.
- Resend is wired as a fallback (used only when `GMAIL_APP_PASSWORD` is
  empty). `donadon.com` was added there on 2026-09-23 but never verified,
  because the Register.it login isn't available; it can be deleted.

### 3. Vercel

Project → Settings → Environment Variables (Production), add:

| Name | Value |
|---|---|
| `STRIPE_SECRET_KEY` | in `.env.local` |
| `STRIPE_WEBHOOK_SECRET` | in `.env.local` |
| `SHOP_FILE_KEY` | in `.env.local` |
| `GMAIL_APP_PASSWORD` | in `.env.local` |

Vercel's environment variable screen accepts a pasted `.env` file, so you can
paste the whole of `.env.local` at once.

Then redeploy.

### 4. Check it

- Open **tobiadonadon.com/api/shop/health**. Every line should be `true`,
  and `"ok": true`. `stripeMode` says `test` or `live`.
- Buy it once yourself for real, with your own email. You should land on
  "It's yours.", download the zip, and get the email (zip attached) from
  your Gmail within a minute. Then
  refund yourself in Stripe → Payments.

## Shipping a new version

Launchr ships WITHOUT the four example MP4s (34 MB, far over the 4 MB limit);
they are on the product page instead. Rebuild its zip from the folder with
`examples/` removed.

```
npm run seal -- ~/Desktop/JevTrader/dist/the-98c-trade.zip
npm run seal -- ~/Desktop/launchr-shipped.zip   # rename to launchr.zip first
git add private && git commit -m "New version of …" && git push
```

Use the same `SHOP_FILE_KEY` (the script reads it from `.env.local`). Every
buyer's link serves the new version.

## If something goes wrong

- **A buyer says the email never came.** Stripe → Payments → the payment →
  metadata shows `delivered_at` if it went, and it will be in your Gmail's
  Sent folder. Either way, the link is
  `https://www.tobiadonadon.com/api/download?session_id=<the cs_… id>` from
  Stripe's checkout session.
- **Checkout says "didn't open".** Check `/api/shop/health`, then Vercel →
  Logs for `[shop]`.
- **Webhook failures** show in Stripe → Webhooks → your endpoint, with each
  attempt and its response.

## Analytics

Vercel Web Analytics is on for the project (`<Analytics />` in
`app/layout.tsx`). Visitors, pages, referrers and countries are in Vercel →
the project → Analytics. No cookies, so no consent banner. Sales are in Stripe.

## Tests

`npm test` runs the whole purchase path against an in-memory Stripe and a
stand-in Gmail: signed and forged webhooks, duplicates, slow payments,
email outages, paid and unpaid downloads, and checkout with Stripe up and down.
