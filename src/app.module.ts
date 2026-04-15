import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),   
    
    TypeOrmModule.forRoot({
      type: 'postgres', // Đã đổi từ mysql sang postgres
      url: process.env.DATABASE_URL, // Dùng thẳng link kết nối của Neon
      autoLoadEntities: true, 
      synchronize: true,      
      ssl: true, // Thêm dòng này vì các DB cloud yêu cầu bảo mật SSL
      extra: {
        ssl: {
          rejectUnauthorized: false, // Bỏ qua lỗi SSL certificate tự cấp
        },
      },
    }), UsersModule, AuthModule,
  ],
})
export class AppModule {}