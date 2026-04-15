// src/common/interceptors/transform.interceptor.ts
import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
  statusCode: number;
  message: string;
  data: T;
}

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, Response<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<Response<T>> {
    const ctx = context.switchToHttp();
    const response = ctx.getResponse();

    return next.handle().pipe(
      map((resData) => {
        // Nếu trong service bạn đã chủ động trả về field 'message', nó sẽ lấy, nếu không mặc định là 'Success'
        const message = resData?.message || 'Success';
        
        // Trích xuất dữ liệu thật sự cần trả về
        const data = resData?.data !== undefined ? resData.data : resData;

        // Nếu resData là string (thường dùng khi chỉ muốn trả về message), data sẽ là null
        const finalData = typeof resData === 'string' ? null : data;
        
        // Xóa field message dư thừa bên trong data (nếu có) để tránh lặp lại
        if (finalData && finalData.message) {
            delete finalData.message;
        }

        return {
          statusCode: response.statusCode,
          message: message,
          data: finalData,
        };
      }),
    );
  }
}