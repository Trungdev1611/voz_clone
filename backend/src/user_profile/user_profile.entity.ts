import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from 'typeorm';

export enum UserGender {
  MALE = 'male',
  FEMALE = 'female',
  OTHER = 'other',
}

@Entity({ name: 'user_profile' })
export class UserProfileEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({ unique: false })
    avatar?: string;

    @Column({ nullable: true }) //dòng chữ dưới tên nếu có 
    custom_title?: string;

    @Column({type:'date', nullable: true}) //ngày sinh
    birthday?: string;

    @Column({type:'enum', enum: UserGender, default: UserGender.OTHER}) 
    gender?: UserGender;

    @Column({ unique: false, nullable: true }) //nơi ở
    location?: string;

    @Column({ unique: true, nullable: true }) //CMND/CCCD
    citizen_id ?: string;

}