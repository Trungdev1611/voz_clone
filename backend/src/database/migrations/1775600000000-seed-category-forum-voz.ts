import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * 1) Cho phép category gốc: `category_id` NULL (khớp query `IsNull()` trong repository).
 * 2) Seed cấu trúc box kiểu Voz (tên/slug mang tính tham chiếu layout diễn đàn Voz).
 *
 * Slug prefix `voz-seed-` để down() xóa đúng dòng seed.
 */
export class SeedCategoryForumVoz1775600000000 implements MigrationInterface {
  name = 'SeedCategoryForumVoz1775600000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "category_forum" ALTER COLUMN "category_id" DROP NOT NULL`,
    );

    const roots: Array<{
      slug: string;
      name: string;
      description: string | null;
      forums: Array<{
        slug: string;
        name: string;
        description: string;
        post_count: number;
        message_count: number;
      }>;
    }> = [
      {
        slug: 'voz-seed-root-thong-bao',
        name: 'Thông báo — Nội quy',
        description: 'Nội quy, hướng dẫn và thông báo từ ban quản trị.',
        forums: [
          {
            slug: 'voz-seed-forum-noi-quy',
            name: 'Nội quy — Hướng dẫn sử dụng',
            description:
              'Quy định chung khi tham gia diễn đàn. Đọc kỹ trước khi post.',
            post_count: 412,
            message_count: 28900,
          },
          {
            slug: 'voz-seed-forum-thong-bao-bqt',
            name: 'Thông báo từ BQT',
            description: 'Cập nhật, bảo trì, thay đổi chính sách.',
            post_count: 156,
            message_count: 12400,
          },
        ],
      },
      {
        slug: 'voz-seed-root-chuyen-tro',
        name: 'Chuyện trò linh tinh™',
        description:
          'Khu chém gió, thời sự, xả stress — linh tinh có hệ thống.',
        forums: [
          {
            slug: 'voz-seed-forum-thoi-su',
            name: 'Thời sự — Thế giới',
            description:
              'Tin nóng, biến động quốc tế, kinh tế — xã luận có trách nhiệm.',
            post_count: 28400,
            message_count: 1820000,
          },
          {
            slug: 'voz-seed-forum-xa-stress',
            name: 'Xả stress',
            description: 'Giải tỏa căng thẳng — không đụng chính trị cực đoan.',
            post_count: 19200,
            message_count: 956000,
          },
          {
            slug: 'voz-seed-forum-chuyen-phiem',
            name: 'Chuyện phiếm — OT',
            description: 'Tán gẫu không đề tài — vui là chính.',
            post_count: 22100,
            message_count: 1105000,
          },
          {
            slug: 'voz-seed-forum-tam-su',
            name: 'Tâm sự — Tình cảm',
            description:
              'Chia sẻ cá nhân — tôn trọng quyền riêng tư người khác.',
            post_count: 9800,
            message_count: 512000,
          },
        ],
      },
      {
        slug: 'voz-seed-root-may-tinh',
        name: 'Máy tính — Internet',
        description: 'PC, laptop, mạng, phần mềm và game.',
        forums: [
          {
            slug: 'voz-seed-forum-phan-cung',
            name: 'Phần cứng — Overclock',
            description: 'CPU, VGA, RAM, tản nhiệt, build máy.',
            post_count: 15400,
            message_count: 890000,
          },
          {
            slug: 'voz-seed-forum-phan-mem',
            name: 'Phần mềm — Hệ điều hành',
            description: 'Windows, Linux, macOS, công cụ dev.',
            post_count: 11200,
            message_count: 678000,
          },
          {
            slug: 'voz-seed-forum-game',
            name: 'Game — PC & Console',
            description: 'Tựa game, hardware gaming, esports.',
            post_count: 18600,
            message_count: 1204000,
          },
        ],
      },
      {
        slug: 'voz-seed-root-dien-tu',
        name: 'Sản phẩm số — Điện tử',
        description: 'Điện thoại, máy ảnh, âm thanh, đồ chơi công nghệ.',
        forums: [
          {
            slug: 'voz-seed-forum-dien-thoai',
            name: 'Điện thoại di động',
            description: 'iOS, Android, phụ kiện, mạng di động.',
            post_count: 16800,
            message_count: 980000,
          },
          {
            slug: 'voz-seed-forum-may-anh',
            name: 'Máy ảnh — Flycam',
            description: 'Chụp ảnh, quay phim, drone.',
            post_count: 6200,
            message_count: 312000,
          },
          {
            slug: 'voz-seed-forum-am-thanh',
            name: 'Âm thanh — Nghe nhìn',
            description: 'Tai nghe, loa, DAC, setup nghe nhạc.',
            post_count: 4800,
            message_count: 245000,
          },
        ],
      },
      {
        slug: 'voz-seed-root-giai-tri',
        name: 'Giải trí',
        description: 'Phim, nhạc, thể thao, truyện.',
        forums: [
          {
            slug: 'voz-seed-forum-phim',
            name: 'Phim — Truyện',
            description: 'Review, tranh luận — spoiler cần tag rõ ràng.',
            post_count: 13200,
            message_count: 756000,
          },
          {
            slug: 'voz-seed-forum-am-nhac-the-thao',
            name: 'Âm nhạc — Thể thao',
            description: 'Bóng đá, tennis, concert, idol.',
            post_count: 9100,
            message_count: 498000,
          },
        ],
      },
      {
        slug: 'voz-seed-root-hoi-truong',
        name: 'Voz — Hội trường',
        description: 'Góp ý diễn đàn và phản hồi từ thành viên.',
        forums: [
          {
            slug: 'voz-seed-forum-gop-y',
            name: 'Góp ý — Phản hồi BQT',
            description: 'Ý kiến xây dựng về box, tính năng, UI.',
            post_count: 2300,
            message_count: 89000,
          },
          {
            slug: 'voz-seed-forum-thac-mac',
            name: 'Thắc mắc — Hỗ trợ',
            description: 'Hỏi cách dùng diễn đàn, lỗi tài khoản.',
            post_count: 1800,
            message_count: 62000,
          },
        ],
      },
      {
        slug: 'voz-seed-root-rao-vat',
        name: 'Khu thương mại — Rao vặt',
        description: 'Mua bán — tuân thủ quy định về quảng cáo.',
        forums: [
          {
            slug: 'voz-seed-forum-rao-vat',
            name: 'Rao vặt — Mua bán chung',
            description: 'Đồ cũ, linh kiện, dịch vụ — cảnh giác lừa đảo.',
            post_count: 5600,
            message_count: 198000,
          },
        ],
      },
    ];

    for (const root of roots) {
      await queryRunner.query(
        `INSERT INTO "category_forum" ("name", "description", "slug", "post_count", "message_count", "last_post_id", "category_id")
         VALUES ($1, $2, $3, 0, 0, 0, NULL)`,
        [root.name, root.description, root.slug],
      );

      const parentRows = (await queryRunner.query(
        `SELECT "id" FROM "category_forum" WHERE "slug" = $1`,
        [root.slug],
      )) as Array<{ id: number }>;
      const parentId = parentRows[0]?.id;
      if (parentId == null) {
        throw new Error(`Seed: missing parent row for slug ${root.slug}`);
      }

      for (const f of root.forums) {
        await queryRunner.query(
          `INSERT INTO "category_forum" ("name", "description", "slug", "post_count", "message_count", "last_post_id", "category_id")
           VALUES ($1, $2, $3, $4, $5, 0, $6)`,
          [
            f.name,
            f.description,
            f.slug,
            f.post_count,
            f.message_count,
            parentId,
          ],
        );
      }
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DELETE FROM "category_forum" WHERE "slug" LIKE 'voz-seed-forum-%'`,
    );
    await queryRunner.query(
      `DELETE FROM "category_forum" WHERE "slug" LIKE 'voz-seed-root-%'`,
    );

    const nullRoots = (await queryRunner.query(
      `SELECT COUNT(*)::int AS c FROM "category_forum" WHERE "category_id" IS NULL`,
    )) as Array<{ c: number }>;
    if ((nullRoots[0]?.c ?? 0) === 0) {
      await queryRunner.query(
        `ALTER TABLE "category_forum" ALTER COLUMN "category_id" SET NOT NULL`,
      );
    }
  }
}
