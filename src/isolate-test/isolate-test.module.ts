import { Module } from '@nestjs/common';
import { IsolateTestController } from './isolate-test.controller';

@Module({
  controllers: [IsolateTestController]
})
export class IsolateTestModule {}
