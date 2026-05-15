import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCommentEntity1777026075849 implements MigrationInterface {
    name = 'AddCommentEntity1777026075849'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "comment" ("created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "id" SERIAL NOT NULL, "content" character varying NOT NULL, "threadId" integer NOT NULL, "userId" integer NOT NULL, "thread_id" integer, "user_id" integer, CONSTRAINT "PK_0b0e4bbc8415ec426f87f3a88e2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "comment" ADD CONSTRAINT "FK_be68531edd9305c665090a8a389" FOREIGN KEY ("thread_id") REFERENCES "thread"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "comment" ADD CONSTRAINT "FK_bbfe153fa60aa06483ed35ff4a7" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "comment" DROP CONSTRAINT "FK_bbfe153fa60aa06483ed35ff4a7"`);
        await queryRunner.query(`ALTER TABLE "comment" DROP CONSTRAINT "FK_be68531edd9305c665090a8a389"`);
        await queryRunner.query(`DROP TABLE "comment"`);
    }

}
