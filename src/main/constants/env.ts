export const PORT = process.env.PORT ?? 800;
export const PRIVATE_KEY_JWT = process.env.PRIVATE_KEY_JWT ?? 's0MeRaNd0mK3y';
export const SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS ?? '14', 10);
export const DATABASE_FORCE_UPDATE =
  process.env.DATABASE_FORCE_UPDATE === 'true';
export const DATABASE_URL = process.env.DATABASE_URL ?? 'localhost';
export const DATABASE_PORT = parseInt(process.env.DATABASE_PORT ?? '3306', 10);
export const DATABASE_NAME = process.env.DATABASE_NAME ?? 'checker';
export const DATABASE_USERNAME = process.env.DATABASE_USERNAME ?? 'root';
export const DATABASE_PASSWORD = process.env.DATABASE_PASSWORD ?? '12345678';
export const SESSION_SECRET_KEY =
  process.env.SESSION_SECRET_KEY ?? 's0MeRaNd0mK3y';
