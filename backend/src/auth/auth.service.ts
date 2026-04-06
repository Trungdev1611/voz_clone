import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './user.dto';
import * as bcrypt from 'bcrypt';
import { UserEntity } from './user.entity';
import { plainToInstance } from 'class-transformer';
import { UserEntityRepository } from './auth.repository';

@Injectable()
export class AuthService {
constructor(private readonly userRepo: UserEntityRepository) {}

  async register(createDto: CreateUserDto) {
    const existingUser = await this.userRepo.findOneDependOnProperty({ where: { email: createDto.email } });
    if (existingUser) {
      throw new Error('Email is already in use');
    }
    const hashedPassword = await bcrypt.hash(createDto.password, 10);

    const userEntity = plainToInstance(UserEntity, {
      ...createDto,
      password: hashedPassword,
    });

    return this.userRepo.create(userEntity);
  }

//   findAll() {
//     return `This action returns all s`;
//   }

//   findOne(id: number) {
//     return `This action returns a #id `;
//   }

//   update(id: number, updateDto: UpdateDto) {
//     return `This action updates a #id `;
//   }

//   remove(id: number) {
//     return `This action removes a #id `;
//   }
}
