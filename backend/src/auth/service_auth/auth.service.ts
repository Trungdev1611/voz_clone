import { FindManyOptions } from 'typeorm';
import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto, LoginDto } from '../api_auth/dto/user.dto';
import * as bcrypt from 'bcrypt';
import { UserEntity } from '../user.entity';
import { UserEntityRepository } from '../auth.repository';
import { AuthProducer } from '../queue_auth/auth.producer';

@Injectable()
export class AuthService {
constructor(
  private readonly userRepo: UserEntityRepository,
  private readonly jwtService: JwtService,
  private readonly authProducer: AuthProducer,
) {}

  private async enqueueVerificationEmail(user: UserEntity) {
    const token = await this.jwtService.signAsync(
      { sub: user.id },
      { expiresIn: '15m' },
    );
    const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;
    await this.authProducer.sendEmail(user.email, 'email-verify.hbs', {
      url: verificationUrl,
    }, `verify-email:user:#${user.id}` ); //jobId là unique để track job // nếu trùng jobId sẽ bỏ qua cái mới nhất và thực hiện job cũ
  
  }

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
    const userEntity: Partial<UserEntity> = {
      username: createDto.username,
      email: createDto.email,
      password_hash: hashedPassword,
      isVerified: false, //chưa verify khi tạo user => wait for verify email => change to true
    };

    const created = await this.userRepo.create(userEntity);

    await this.enqueueVerificationEmail(created);

    
    return {
      message: 'Vui lòng xác thực email để hoàn tất đăng ký. Hiệu lực 15 phút',
      user: this.toPublicUser(created),
    };
  }

  async login(loginDto: LoginDto) {
    const identifier = loginDto.usernameOrEmail.trim();
    const user = await this.userRepo.findOneDependOnProperty({
      where: [{ email: identifier }, { username: identifier }],
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        password_hash: true,
      },
    });

    if (!user) throw new UnauthorizedException('Sai tài khoản hoặc mật khẩu');

    const isMatch = await bcrypt.compare(loginDto.password, user.password_hash);
    if (!isMatch)
      throw new UnauthorizedException('Sai tài khoản hoặc mật khẩu');

    if(!user.isVerified) {
      throw new UnauthorizedException('Tài khoản chưa được xác thực');
    }

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

  async resendVerificationEmail(email: string) {
    const user = await this.userRepo.findOneDependOnProperty({
      where: { email: email.trim().toLowerCase() },
    });

    if (!user) {
      return {
        message:
          'Nếu email tồn tại trong hệ thống, chúng tôi đã gửi lại email xác thực.',
      };
    }

    if (user.isVerified) {
      return {
        message: 'Tài khoản này đã được xác thực email.',
      };
    }

    await this.enqueueVerificationEmail(user);
    return {
      message: 'Đã gửi lại email xác thực. Link có hiệu lực 15 phút.',
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
