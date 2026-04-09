import { UserEntity } from 'src/auth/user.entity';
import { CategoryForumEntity } from 'src/categories/entities/category.entity';
import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToOne, JoinColumn } from 'typeorm';

@Entity({ name: 'thread' })
export class ThreadEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column()
    content: string;
    
    @Column()
    slug: string;

    @Column({name: 'author_id'})
    authorId: number;

    @Column({ name: 'category_id' })
    categoryId: number;

    @Column({default: 0})
    views: number;

    @Column({name: 'replies_count', default: 0})
    repliesCount: number;

    //lastPostAt để lưu thời gian của bài viết mới nhất trong thread, dùng để sắp xếp thread theo thời gian cập nhật mới nhất
    @Column({name: 'last_post_at'})
    lastPostAt: Date;

    @Column({name: 'last_user_id'}) //id của người comment cuối trong thread
    lastUserId: number;


    @ManyToOne(() => UserEntity, user => user.threads)
    @JoinColumn({ name: 'author_id' })
    author: UserEntity;

    @ManyToOne(() => CategoryForumEntity, category => category.threads)
    @JoinColumn({ name: 'category_id' })
    category: CategoryForumEntity;

  
}