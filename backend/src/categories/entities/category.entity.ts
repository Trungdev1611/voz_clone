import { ThreadEntity } from 'src/thread/entities/thread.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
@Entity({ name: 'category_forum' })
export class CategoryForumEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string; //tên category + tên forum

  @Column({ nullable: true })
  description?: string; //description của forum

  @Column({ unique: true, nullable: false })
  slug: string; //slug của forum

  @Column()
  post_count: number; //số lượng thread trong forum

  @Column()
  message_count: number; //tổng số lượng message trong forum

  @Column({ nullable: false })
  last_post_id: number; //id của bài viết mới nhất trong forum

  /** NULL = hàng category gốc (có danh sách forums con). */
  @Column({ nullable: true })
  category_id: number | null;

  @ManyToOne(() => CategoryForumEntity, (category) => category.forums, {
    nullable: true,
  })
  @JoinColumn({ name: 'category_id' })
  category: CategoryForumEntity | null;

  @OneToMany(() => CategoryForumEntity, (forum) => forum.category)
  forums: CategoryForumEntity[];

  @OneToMany(() => ThreadEntity, (thread) => thread.category)
  threads: ThreadEntity[];
}
