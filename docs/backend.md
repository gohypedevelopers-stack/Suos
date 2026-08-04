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
