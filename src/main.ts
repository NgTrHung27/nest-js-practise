import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // Tự động loại bỏ các trường không có trong DTO
    forbidNonWhitelisted: true, // Báo lỗi nếu có trường lạ
    transform: true, // Tự động ép kiểu dữ liệu (ví dụ: string -> number)
  })); //Bật tự động validate DTO cho toàn bộ API
  
  //Ép toàn bộ API phải chui qua cái khuôn này
  app.useGlobalInterceptors(new TransformInterceptor());
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
