import 'reflect-metadata';
import { config } from 'dotenv';
import { join } from 'path';
import { DataSource } from 'typeorm';
import {
  buildTypeOrmOptions,
  migrationsGlobSource,
  readDbCredentials,
} from './typeorm.shared';

config({ path: join(process.cwd(), '.env') });

export default new DataSource(
  buildTypeOrmOptions(
    readDbCredentials(),
    migrationsGlobSource(__dirname),
  ),
);
