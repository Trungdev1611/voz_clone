import { join } from 'path';
import type { DataSourceOptions } from 'typeorm';
import { UserEntity } from '../auth/user.entity';
import { UserProfileEntity } from '../user_profile/user_profile.entity';

//config to direct to .env file in root, not in backend
import { config } from 'dotenv';
config({ path: join(__dirname, '../../../.env') }); //env ở thư mục backend
/** Entity dùng cho migration CLI và TypeOrmModule (thêm entity mới thì khai báo ở đây). */
export const typeOrmEntityList = [UserEntity, UserProfileEntity];

export type DbCredentials = {
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
};

/**
 * Đọc DB_* từ `process.env`.
 * - CLI: gọi `dotenv.config()` trước (xem `data-source.ts`).
 * - Nest: `ConfigModule.forRoot()` đứng trước `TypeOrmModule` trong `imports` nên .env đã được nạp vào `process.env` khi `useFactory` chạy.
 */
export function readDbCredentials(): DbCredentials {
  return {
    host: process.env.DB_HOST ?? 'localhost',
    port: parseInt(process.env.DB_PORT ?? '5432', 10),
    username: process.env.DB_USER ?? 'voz',
    password: process.env.DB_PASSWORD ?? 'voz',
    database: process.env.DB_NAME ?? 'voz_clone',
  };
}

export function buildTypeOrmOptions(
  cred: DbCredentials,
  migrationsGlob: string,
): DataSourceOptions {
  return {
    type: 'postgres',
    host: cred.host,
    port: cred.port,
    username: cred.username,
    password: cred.password,
    database: cred.database,
    entities: typeOrmEntityList,
    migrations: [migrationsGlob],
    synchronize: false,
    logging: process.env.TYPEORM_LOGGING === 'true',
  };
}

/** Đường dẫn glob migration khi chạy từ mã đã biên dịch (`dist/`). */
export function migrationsGlobCompiled(dirname: string): string {
  return join(dirname, 'database/migrations', '*.js');
}

/** Đường dẫn glob migration khi chạy CLI với ts-node (`src/`). */
export function migrationsGlobSource(dirname: string): string {
  return join(dirname, 'migrations', '*{.ts,.js}');
}
