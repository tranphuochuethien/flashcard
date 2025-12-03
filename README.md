# Firebase Studio

This is a NextJS starter in Firebase Studio.

To get started, take a look at src/app/page.tsx.

## Database Setup

This project uses [Drizzle ORM](https://orm.drizzle.team/) to manage the database schema and queries. By default, it's configured to use a local SQLite database.

The database configuration can be found in `drizzle.config.ts`, and the schema is defined in `src/lib/db/schema.ts`.

### Applying Schema Changes

When you modify the database schema in `src/lib/db/schema.ts`, you need to apply these changes to your database. Run the following command to do so:

```bash
npm run db:push
```

This command pushes the schema changes to the database, creating or updating tables as necessary.
