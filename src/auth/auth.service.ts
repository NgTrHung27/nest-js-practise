// src/auth/auth.service.ts
import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../users/entities/user.entity';
import { RegisterDto } from './dto/register.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    // Tiêm (Inject) kho chứa dữ liệu của bảng User vào đây
    @InjectRepository(User)
    private readonly userRepo: Repository<User>, 
    private readonly jwtService: JwtService,   
    private readonly configService: ConfigService,
  ) {}

  // ========== API ĐĂNG KÝ ==========
  async register(dto: RegisterDto) {
    const existsUser = await this.userRepo.findOne({
      where: [{ email: dto.email }, { username: dto.username }],
    });
    if (existsUser) {
      if (existsUser.email === dto.email) {
        throw new ConflictException('Email này đã được sử dụng!');
      }
      if (existsUser.username === dto.username) {
        throw new ConflictException('Username này đã được sử dụng!');
      }
    }

    // 2. Băm (hash) mật khẩu với độ mặn (saltOrRounds) là 10
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    // 3. Tạo một bản ghi user mới với mật khẩu đã được băm
    const newUser = this.userRepo.create({
      name: dto.name,
      username: dto.username,
      email: dto.email,
      password: hashedPassword,
    });

    // 4. Lưu xuống Database
    await this.userRepo.save(newUser);

    // Trả về thông báo thành công (Không trả về password nhé)
    return {
      message: 'Đăng ký tài khoản thành công!',
      user: {
        id: newUser.id,
        name: newUser.name,
        username: newUser.username,
        email: newUser.email,
      }
    };
  }

  // ========== API ĐĂNG NHẬP ==========
  async login(dto: LoginDto) {
    // 1. Tìm user theo email.
    // LƯU Ý: Phải dùng addSelect('user.password') vì ở Entity ta đã set select: false
    const user = await this.userRepo
      .createQueryBuilder('user')
      .where('user.email = :email', { email: dto.email })
      .addSelect('user.password') 
      .getOne();

    if (!user) {
      throw new UnauthorizedException('Email hoặc mật khẩu không đúng');
    }

    // 2. So sánh password gửi lên với password đã băm trong DB
    const isMatch = await bcrypt.compare(dto.password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Email hoặc mật khẩu không đúng');
    }

    // 3. Đúng pass rồi! Tạo cặp token (Access Token & Refresh Token)
    return this.generateTokens(user);
  }

  // ========== HÀM HỖ TRỢ: TẠO TOKEN ==========
  private async generateTokens(user: User) {
    const payload = { sub: user.id, email: user.email };    // Thông tin đóng gói vào token (Payload)

    const [accessToken, refreshToken] = await Promise.all([
      // Tạo Access Token (sống 15 phút)
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
        expiresIn: '15m', 
      }),
      // Tạo Refresh Token (sống 7 ngày)
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
        expiresIn: '7d',   
      }),
    ]);

    return { 
    data: { // Bọc token và user vào cục data
        token: accessToken, // roomrise dùng key 'token' thay vì 'accessToken'
        refreshToken: refreshToken,
        user: { 
          userId: user.id.toString(), // Chuyển id thành string cho giống UserModel Flutter
          username: user.username,
          email: user.email,
          name: user.name
        }
      }
    };
  }
}