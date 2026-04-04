function buildDatabaseUrl() {
  if (process.env.DATABASE_URL) {
    return process.env.DATABASE_URL;
  }

  const user = process.env.POSTGRES_USER ?? process.env.USER ?? "postgres";
  const password = process.env.POSTGRES_PASSWORD ?? "";
  const host = process.env.POSTGRES_HOST ?? "localhost";
  const port = process.env.POSTGRES_PORT ?? "5432";
  const database = process.env.POSTGRES_DB ?? "construction_app";

  const auth = password
    ? `${encodeURIComponent(user)}:${encodeURIComponent(password)}@`
    : `${encodeURIComponent(user)}@`;

  return `postgresql://${auth}${host}:${port}/${database}`;
}

export function getDatabaseUrls() {
  const databaseUrl = buildDatabaseUrl();
  const parsedUrl = new URL(databaseUrl);
  const databaseName = parsedUrl.pathname.replace(/^\//, "");

  const adminUrl = new URL(databaseUrl);
  adminUrl.pathname = "/postgres";

  return {
    adminDatabaseUrl: adminUrl.toString(),
    databaseName,
    databaseUrl
  };
}
