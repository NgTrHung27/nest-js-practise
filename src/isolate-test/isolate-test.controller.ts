import { Controller, Get } from '@nestjs/common';

@Controller('api/isolate-test') // Đường dẫn rõ ràng cho việc test Isolate
export class IsolateTestController {
  
  @Get('heavy-payload') // http://localhost:3000/api/isolate-test/heavy-payload 
  getHeavyData() {
    const totalRecords = 10000;
    const items: any[] = [];

    // Sinh dữ liệu mẫu đủ nặng để làm lag Main Thread Flutter
    for (let i = 1; i <= totalRecords; i++) {
      items.push({
        userId: i.toString(), // Chuyển sang string để khớp với UserModel Flutter
        username: `user_tester_${i}`,
        email: `tester_${i}@example.com`,
        name: `Tester Flutter Isolate ${i}`,
        lastLogin: new Date().toISOString(),
        history: [
          { action: 'LOGIN', timestamp: new Date().toISOString() },
          { action: 'FETCH_HEAVY_DATA', timestamp: new Date().toISOString() },
          { action: 'PROCESS_ISOLATE', timestamp: new Date().toISOString() }
        ],
        preferences: {
          theme: i % 2 === 0 ? 'dark' : 'light',
          notificationsEnabled: i % 3 === 0,
          language: i % 5 === 0 ? 'en' : 'vi'
        }
      });
    }

    // Kết quả này sẽ được TransformInterceptor tự động bọc lại
    return {
      totalRecords: totalRecords,
      items: items
    };
  }
}