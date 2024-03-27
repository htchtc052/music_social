import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './users/user.module';
import { JwtModule } from '@nestjs/jwt';
import { join } from 'path';
import { PrismaModule } from 'nestjs-prisma';
import { ServeStaticModule } from '@nestjs/serve-static';
import { TrackModule } from './track/track.module';
import { FilesModule } from './files.module';
import { ConfigModule } from '../config.module';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    JwtModule.register({ global: true }),
    FilesModule,
    UserModule,
    AuthModule,
    ConfigModule,
    PrismaModule.forRoot({
      isGlobal: true,
    }),
    ServeStaticModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const rootPath = join(
          __dirname,
          '..',
          configService.get('UPLOADS_DIR'),
        );
        return [{ rootPath }];
      },
      inject: [ConfigService],
    }),
    TrackModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
