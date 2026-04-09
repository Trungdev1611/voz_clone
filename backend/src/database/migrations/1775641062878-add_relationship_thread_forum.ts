import { MigrationInterface, QueryRunner } from "typeorm";

export class AddRelationshipThreadForum1775641062878 implements MigrationInterface {
    name = 'AddRelationshipThreadForum1775641062878'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "thread" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "content" character varying NOT NULL, "slug" character varying NOT NULL, "author_id" integer NOT NULL, "category_id" integer NOT NULL, "views" integer NOT NULL DEFAULT '0', "replies_count" integer NOT NULL DEFAULT '0', "last_post_at" TIMESTAMP NOT NULL, "last_user_id" integer NOT NULL, CONSTRAINT "PK_cabc0f3f27d7b1c70cf64623e02" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "category_forum" ADD CONSTRAINT "UQ_3a3a9b17931961a15caa366460a" UNIQUE ("slug")`);
        await queryRunner.query(`ALTER TABLE "thread" ADD CONSTRAINT "FK_6c7b99295a0a8a53cb38f2a553d" FOREIGN KEY ("author_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "thread" ADD CONSTRAINT "FK_81c03ef6d4a356eb94e115a6ce0" FOREIGN KEY ("category_id") REFERENCES "category_forum"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "thread" DROP CONSTRAINT "FK_81c03ef6d4a356eb94e115a6ce0"`);
        await queryRunner.query(`ALTER TABLE "thread" DROP CONSTRAINT "FK_6c7b99295a0a8a53cb38f2a553d"`);
        await queryRunner.query(`ALTER TABLE "category_forum" DROP CONSTRAINT "UQ_3a3a9b17931961a15caa366460a"`);
        await queryRunner.query(`DROP TABLE "thread"`);
    }

}
