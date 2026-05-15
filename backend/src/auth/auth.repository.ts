// import { Injectable } from '@nestjs/common';
// import { Repository, DataSource } from 'typeorm';
// import {UserEntity} from './user.entity';

// @Injectable()
// export class UserEntityRepository extends Repository<UserEntity> {
//     constructor(private dataSource: DataSource) {
//         super(UserEntity, dataSource.createEntityManager());
//     }

//     // Custom methods here
//     async findByEmail(email: string): Promise<UserEntity | null> {
//         return this.findOne({ where: { email } });
//     }

//     async createUser(userDTO: createUserDTO ): Promise<UserEntity> {
//         const user = this.create({
//             email: userDTO.email,
//             password_hash: userDTO.password_hash,
//             role: userDTO.role
//         });
//         return this.save(user);
//     }

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Repository,
  FindOneOptions,
  FindManyOptions,
} from 'typeorm';
import {UserEntity} from './user.entity';

@Injectable()
export class UserEntityRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly repository: Repository<UserEntity>,
  ) {}

 
  async findOneDependOnProperty(options: FindOneOptions<UserEntity>): Promise<UserEntity | null> {
    return this.repository.findOne(options);
  }

  async findManyOptions(options: FindManyOptions<UserEntity>): Promise<UserEntity[]> {
    return this.repository.find(options);
  }

  async delete(ids: number[]): Promise<void> {
    await this.repository.delete(ids);
  }

  async findDeletableUnverifiedUserIds(
    cutoff: Date,
    take: number,
  ): Promise<number[]> {
    const rows = await this.repository
      .createQueryBuilder('u')
      .leftJoin('u.threads', 't')
      .leftJoin('u.comments', 'c')
      .where('u.isVerified = :isVerified', { isVerified: false })
      .andWhere('u.createdAt <= :cutoff', { cutoff })
      .andWhere('t.id IS NULL')
      .andWhere('c.id IS NULL')
      .select('u.id', 'id')
      .orderBy('u.id', 'ASC')
      .limit(take)
      .getRawMany<{ id: number }>();

    return rows.map((row) => Number(row.id));
  }

//   // 2. Hàm tìm theo ID với Error Handling tích hợp
//   async findById(id: any): Promise<EntityName> {
//     const record = await this.repository.findOne({ where: { id } as any });
//     if (!record) throw new NotFoundException(`EntityName not found`);
//     return record;
//   }

  async create(data: Partial<UserEntity>): Promise<UserEntity> {
    const entity = this.repository.create(data);
    return this.repository.save(entity);
  }

//   // 4. Hàm Update (Chỉ cho phép update những gì định nghĩa sẵn)
//   async update(id: any, data: Partial<EntityName>): Promise<EntityName> {
//     await this.repository.update(id, data as any);
//     return this.findById(id);
//   }

//   // 5. Custom Query (Nơi sức mạnh của Repo phát huy)
//   async findActiveUsers(): Promise<EntityName[]> {
//     return this.repository.find({ where: { isActive: true } as any });
//   }
}