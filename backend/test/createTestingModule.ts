import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';

export const createTestingModule = async (): Promise<TestingModule> => {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
    providers: [],
  }).compile();

  return moduleFixture;
};
