import { MigrationInterface, QueryRunner } from "typeorm";

export class AddTableCategoryforum1775533314353 implements MigrationInterface {
    name = 'AddTableCategoryforum1775533314353'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "category_forum" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "description" character varying, "slug" character varying NOT NULL, "post_count" integer NOT NULL, "message_count" integer NOT NULL, "last_post_id" integer NOT NULL, "category_id" integer NOT NULL, CONSTRAINT "PK_ef387dd63be7b60cef070340c39" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "category_forum" ADD CONSTRAINT "FK_ccfa951a6532787ede154579f3c" FOREIGN KEY ("category_id") REFERENCES "category_forum"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "category_forum" DROP CONSTRAINT "FK_ccfa951a6532787ede154579f3c"`);
        await queryRunner.query(`DROP TABLE "category_forum"`);
    }

}
