import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto, LoginDto } from './user.dto';
import * as bcrypt from 'bcrypt';
import { UserEntity } from './user.entity';
import { plainToInstance } from 'class-transformer';
import { UserEntityRepository } from './auth.repository';

@Injectable()
export class AuthService {
constructor(
  private readonly userRepo: UserEntityRepository,
  private readonly jwtService: JwtService,
) {}

  private toPublicUser(user: UserEntity) {
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
    };
  }

  async register(createDto: CreateUserDto) {
    const existingByEmail = await this.userRepo.findOneDependOnProperty({
      where: { email: createDto.email },
    });
    if (existingByEmail) throw new ConflictException('Email is already in use');

    const existingByUsername = await this.userRepo.findOneDependOnProperty({
      where: { username: createDto.username },
    });
    if (existingByUsername)
      throw new ConflictException('Username is already in use');

    const hashedPassword = await bcrypt.hash(createDto.password, 10);

    const userEntity = plainToInstance(UserEntity, {
      ...createDto,
      password_hash: hashedPassword,
    });

    const created = await this.userRepo.create(userEntity);
    return {
      message: 'Đăng ký thành công',
      user: this.toPublicUser(created),
    };
  }

  async login(loginDto: LoginDto) {
    const identifier = loginDto.usernameOrEmail.trim();
    const user = await this.userRepo.findOneDependOnProperty({
      where: [{ email: identifier }, { username: identifier }],
    });

    if (!user) throw new UnauthorizedException('Sai tài khoản hoặc mật khẩu');

    const isMatch = await bcrypt.compare(loginDto.password, user.password_hash);
    if (!isMatch)
      throw new UnauthorizedException('Sai tài khoản hoặc mật khẩu');

    const accessToken = await this.jwtService.signAsync({
      sub: user.id,
      username: user.username,
      role: user.role,
    });

    return {
      message: 'Đăng nhập thành công',
      accessToken,
      user: this.toPublicUser(user),
    };
  }

  async getMeFromAccessToken(accessToken: string, isProfile?: boolean) {
    let payload: { sub?: number };
    try {
      payload = await this.jwtService.verifyAsync(accessToken);
    } catch {
      throw new UnauthorizedException('Phiên đăng nhập không hợp lệ');
    }

    if (!payload?.sub) {
      throw new UnauthorizedException('Phiên đăng nhập không hợp lệ');
    }
    let user
    if (isProfile) {
        user = await this.userRepo.findOneDependOnProperty({
      where: { id: payload.sub },
      select: { id: true,
        username: true,
        email: true,
        role: true,
        profile: { avatar: true, custom_title: true, birthday: true } },
    
    });
    } else {
            user = await this.userRepo.findOneDependOnProperty({
      where: { id: payload.sub },
    });
    }

    if (!user) throw new NotFoundException('Không tìm thấy người dùng');

    return {
      message: 'Lấy thông tin người dùng thành công',
      user: this.toPublicUser(user),
    };
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
