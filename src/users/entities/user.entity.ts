import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('users') // Tên bảng trong Database sẽ là 'users'
export class User {
  @PrimaryGeneratedColumn() // Tự động tăng ID (1, 2, 3...)
  id: number;

  @Column({ unique: true }) // Không cho phép 2 user trùng email
  email: string;

  @Column({ unique: true, nullable: true })
  username: string;

  @Column({ nullable: true }) 
  name: string;

  // Cực kỳ quan trọng: select: false giúp bảo mật, 
  // khi truy vấn DB bình thường nó sẽ KHÔNG trả về password
  @Column({ select: false })  
  password: string;

  // Lưu refresh token đã được băm (hash)
@Column({ type: 'varchar', name: 'refresh_token', nullable: true, select: false })
  refreshToken: string | null;

  @CreateDateColumn({ name: 'created_at' }) // Tự động lưu thời gian tạo
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' }) // Tự động cập nhật thời gian sửa
  updatedAt: Date;
}