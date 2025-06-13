import { Test, TestingModule } from '@nestjs/testing';
import { OperationsGateway } from './operations.gateway';

describe('OperationsGateway', () => {
  let gateway: OperationsGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OperationsGateway],
    }).compile();

    gateway = module.get<OperationsGateway>(OperationsGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
