import { MulterModule } from '@nestjs/platform-express';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Global, Module } from '@nestjs/common';
import { diskStorage } from 'multer';
import { v4 as uuid } from 'uuid';
import { extname } from 'path';

@Global()
@Module({
  imports: [
    MulterModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        storage: diskStorage({
          destination: configService.get('UPLOADS_DIR'),
          filename: (req: any, file: any, cb: any) => {
            const generatedName = uuid() + extname(file.originalname);
            cb(null, generatedName);
          },
        }),
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [],

  providers: [],
  exports: [MulterModule],
})
export class FilesModule {}
