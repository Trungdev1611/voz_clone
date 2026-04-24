import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUserUpdatedAt1776920400000 implements MigrationInterface {
    name = 'AddUserUpdatedAt1776920400000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "updated_at"`);
    }
}
