import { MigrationInterface, QueryRunner } from "typeorm";

export class AddVerifyUser1776912921661 implements MigrationInterface {
    name = 'AddVerifyUser1776912921661'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "isVerified" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "isVerified"`);
    }

}
