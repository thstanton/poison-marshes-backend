import { Test, TestingModule } from '@nestjs/testing';
import { QrcodesService } from './qrcodes.service';

describe('QrcodesService', () => {
  let service: QrcodesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [QrcodesService],
    }).compile();

    service = module.get<QrcodesService>(QrcodesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
