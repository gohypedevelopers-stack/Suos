# SUOS backend

The application uses a modular Next.js backend:

- PostgreSQL with Prisma ORM
- Better Auth with database-backed sessions
- `CUSTOMER` and `ADMIN` roles
- Zod at all untrusted-input boundaries
- A server-only data access and service layer
- Direct-to-R2 product image uploads through short-lived presigned URLs

## Local setup

1. Copy `.env.example` to `.env`.
2. Replace every placeholder secret.
3. Set `DATABASE_URL` to the PostgreSQL connection string.
4. Run `npm run db:deploy`.
5. Run `npm run dev`.

On Windows, keep an encrypted backup of the local environment file outside the
repository:

```powershell
npm run env:backup
```

If a Git cleanup or package workflow deletes `.env`, restore it with:

```powershell
npm run env:restore
```

The backup is encrypted for the current Windows account and stored under the
user's local application-data directory. Run the backup command again whenever
credentials change.

Every signup is assigned the `CUSTOMER` role. To promote an existing account:

```bash
ADMIN_EMAIL=owner@example.com npm run admin:promote
```

On the Docker Compose deployment:

```bash
docker compose run --rm -e ADMIN_EMAIL=owner@example.com migrate npm run admin:promote
```

## Production deployment

The checked-in `compose.yaml` runs PostgreSQL, applies migrations, and starts the
standalone Next.js container. Nginx remains on the host and proxies to
`127.0.0.1:3000`.

Before starting:

1. Use `postgres` as the database hostname in the production `DATABASE_URL`.
2. Point `BETTER_AUTH_URL` to the final HTTPS application origin.
3. Connect the R2 bucket to the `R2_PUBLIC_URL` custom domain.
4. Configure R2 CORS to allow `PUT` from the application origin with the
   supported image content types.
5. Verify `deploy/nginx/suos.conf` uses the deployment hostname and its
   matching Let's Encrypt certificate paths.

Deploy with:

```bash
docker compose build
docker compose up -d
docker compose ps
```

PostgreSQL is not published to the host. The Next.js port is bound to localhost,
so only Nginx can reach it.

## Backend boundaries

- `lib/server/dal`: authorized reads returning minimal DTOs.
- `lib/server/services`: authenticated business mutations.
- `app/actions`: thin Server Action adapters.
- `app/api`: public HTTP boundaries such as auth, health, and R2 signing.
- `lib/validations`: Zod schemas safe to share with forms.

Server Components should call the DAL directly, never fetch the application's
own Route Handlers.

## Storefront checkout

`app/actions/checkout.ts` → `lib/server/services/checkout.ts` turns the bag into
a real order inside one transaction:

- Cart lines carry a product id and size label; `lib/server/services/cart.ts`
  maps them to variants.
- Prices, GST (origin vs. destination state), the automatic launch discount and
  any order-wide discount code are recomputed from the database. Client totals
  are ignored.
- Stock is reserved at checkout (`orders.source = STOREFRONT`); fulfilment skips
  the decrement for those orders and cancellation releases it.
- Signed-in shoppers' carts are mirrored to `carts`/`cart_items` by
  `syncCartAction`, which feeds the abandoned-checkout view.

## Notifications

`lib/server/notifications/` sends email and WhatsApp messages and records every
attempt in `notifications` (`SENT`, `FAILED` or `SKIPPED` with the reason).

- Email: Resend (`RESEND_API_KEY`) or any SMTP account (`SMTP_*`). `EMAIL_FROM`
  is required. Nothing is sent until one provider is configured.
- WhatsApp: Meta Cloud API. Business-initiated messages need approved templates,
  one per event (`WHATSAPP_TEMPLATE_*`). Body parameters are `{{1}}` customer
  name, `{{2}}` order number, `{{3}}` total, `{{4}}` link.
- Events: order placed / confirmed / fulfilled / cancelled, draft order sent,
  contact form (team alert + acknowledgement), password reset, email
  verification, and new-order alerts to `ADMIN_NOTIFICATION_EMAIL` and
  `WHATSAPP_ADMIN_NUMBER`.
- Sending runs after the response via `after()`, so a slow provider never
  slows the dashboard or checkout.

## Staff roles and permissions

- `ADMIN`: everything, including **Dashboard → Staff & permissions**
  (`/dashboard/settings/staff`), where administrators add sub-admins and tick
  exactly which modules each one may use.
- `SUB_ADMIN`: only the permissions stored on `users.permissions`. The catalogue
  lives in `lib/permissions.ts` (`<module>.view|manage|delete` for orders,
  products, inventory, categories, collections, banners, customers, discounts,
  analytics and taxes). Holding any key for a module grants that module's
  `view`.
- Enforcement: DAL reads call `requirePermission()` (redirects to
  `/dashboard?denied=<key>`), services and upload routes call
  `assertPermission()` (throws `PermissionDenied:<key>`, which the action layer
  turns into a readable message). The sidebar hides modules the viewer cannot
  open, but the server checks are authoritative.
- Adding staff creates the account through Better Auth. Without a temporary
  password the new member receives a set-your-password email (when email is
  configured). Removing staff demotes the account to `CUSTOMER` and ends its
  sessions.
- CLI alternative: `ADMIN_EMAIL=... ADMIN_ROLE=SUB_ADMIN
  ADMIN_PERMISSIONS=orders.view,orders.manage npm run admin:promote`.

## Traffic attribution

Every visitor session is classified once, at its first page view, by
`lib/analytics/channels.ts`: UTM tags win, then `gclid`/`fbclid`, then the
referring site or Android app, otherwise "direct". Channels include Instagram,
Facebook, Meta Ads, WhatsApp, Google, Google Ads, YouTube, X, Pinterest,
TikTok, Snapchat, LinkedIn, Telegram, Threads, email, SMS, other search and
other websites. Orders carry the session id, so sales are attributed to the
channel that brought the shopper.

WhatsApp and Instagram DMs strip referrers, so links shared there should carry
`?utm_source=whatsapp` / `?utm_source=instagram` (and `utm_campaign=...`) to be
counted. The dashboard shows this hint next to the channel panel.

## Session recordings and heatmaps

- `components/analytics/SessionRecorder.tsx` + `lib/recording-client.ts` run
  rrweb on storefront pages (never the dashboard, never inside the heatmap
  preview iframe, never when Do-Not-Track is on). All inputs are masked.
  Batches post to `POST /api/recordings`, which gzips them into
  `session_recording_chunks`; `session_recordings` holds the metadata.
- `NEXT_PUBLIC_RECORDING_SAMPLE_RATE` (0–100, default 100) limits how many
  visits are recorded. Recordings stop after 30 minutes or 8 MB.
- Dashboard → Analytics → Recordings lists replays filtered by date, device,
  page and "ended in an order"; the player streams events from
  `GET /api/recordings/[id]` (analytics permission required).
- Heatmaps come from `CLICK`, `SCROLL` and `MOVE` events written by
  `lib/analytics-client.ts` and aggregated in `lib/server/dal/heatmaps.ts`.
  The viewer draws them over the live page in an iframe at a chosen width.
- Retention: `POST /api/maintenance/cleanup` with the `x-maintenance-secret`
  header deletes recordings older than `RECORDING_RETENTION_DAYS` (30) and raw
  behaviour events older than `ANALYTICS_RETENTION_DAYS` (180). Run it daily
  from cron.

## Website content

`site_content` stores overrides per section (announcement bar, launch offer,
lookbook, edits carousel, contact page and FAQs, footer contact, returns page,
size guide, privacy, terms, shipping policy). `lib/site-content.ts` holds the
types and the code defaults, which are exactly the previous hardcoded copy, so
an empty table renders the storefront unchanged. `getSiteContent()` merges
overrides over defaults once per request; the root layout passes the result to
client components through `SiteContentProvider`. Dashboard → Website content
edits and publishes each section (permission `content.manage`).

## Behavioural analytics

- `components/analytics/AnalyticsBeacon.tsx` + `lib/analytics-client.ts` batch
  page views, product views, add-to-cart, begin-checkout and purchase events to
  `POST /api/track`, which writes `analytics_sessions` / `analytics_events`.
  Sessions rotate after 30 minutes idle; the dashboard is excluded.
- Catalog searches are logged to `search_logs`.
- `lib/server/dal/analytics.ts` exposes `getStoreAnalytics()` (sessions by day,
  device, landing page, referrer, funnel, top and zero-result searches) for the
  analytics pages. The overview's "sessions" metric now uses these visitor
  sessions instead of login sessions.

## Public endpoints

- `/sitemap.xml` and `/robots.txt` are generated from the catalogue.
- `/track-order` resolves an order by number + checkout email (and optionally
  PIN code) without authentication.
- `/contact` stores messages in `contact_messages`.
