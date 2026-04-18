import { Test, TestingModule } from '@nestjs/testing';
import { IsolateTestController } from './isolate-test.controller';

describe('IsolateTestController', () => {
  let controller: IsolateTestController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [IsolateTestController],
    }).compile();

    controller = module.get<IsolateTestController>(IsolateTestController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
