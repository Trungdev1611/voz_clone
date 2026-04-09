import { ThreadEntity } from 'src/thread/entities/thread.entity';
import { UserProfileEntity } from 'src/user_profile/user_profile.entity';
import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, OneToOne, JoinColumn, OneToMany } from 'typeorm';

export enum Role {
  ADMIN = 'admin',
  MOD = 'mod',
  MEMBER = 'member',
  BANNED ='banned',
}

@Entity({ name: 'users' })
export class UserEntity  extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    username: string;

    @Column({ unique: true })
    email: string;

    @Column()
    password_hash: string;

    @Column({ type: 'enum', enum: Role, default: Role.MEMBER })
    role: Role;

    // Thiết lập quan hệ OneToOne với Profile
  @OneToOne(() => UserProfileEntity, (profile) => profile.user, { 
    cascade: true, // Tự động lưu profile khi lưu user
    onDelete: 'CASCADE' // Xóa user thì xóa luôn profile
  })
  @JoinColumn() // Bắt buộc phải có ở bên sở hữu quan hệ (Owner side)
  profile: UserProfileEntity;


  @OneToMany(() => ThreadEntity, thread => thread.author)
  threads: ThreadEntity[];

}