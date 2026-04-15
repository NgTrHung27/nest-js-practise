import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';

@Module({
  // Khai báo User Entity ở đây
  imports: [TypeOrmModule.forFeature([User])],
  exports: [TypeOrmModule], // Export ra để lát nữa AuthModule có thể xài ké
})
export class UsersModule {}