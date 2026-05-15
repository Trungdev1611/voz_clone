import { UserEntity } from "src/auth/user.entity";
import { BaseEntity } from "src/common/BaseEntity";
import { ThreadEntity } from "src/thread/entities/thread.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'comment' })
export class CommentEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    content: string;

    @Column({ name: 'thread_id' })
    threadId: number;

    @Column({ name: 'user_id' })
    userId: number;

    @ManyToOne(() => ThreadEntity, (thread: ThreadEntity) => thread.comments)
    @JoinColumn({ name: 'thread_id' })
    thread: ThreadEntity;

    @ManyToOne(() => UserEntity, (user: UserEntity) => user.comments)
    @JoinColumn({ name: 'user_id' })
    user: UserEntity;
}
