import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from 'typeorm';

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
    email: string;

    @Column()
    password_hash: string;

    @Column({ type: 'enum', enum: Role, default: Role.MEMBER })
    role: Role;

}