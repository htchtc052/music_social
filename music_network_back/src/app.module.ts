import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { join } from 'path';
import { PrismaModule } from 'nestjs-prisma';
import { ServeStaticModule } from '@nestjs/serve-static';
import { TracksModule } from './track/tracks.module';
import { FilesModule } from './files.module';
import { ConfigModule } from '../config.module';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    JwtModule.register({ global: true }),
    FilesModule,
    UsersModule,
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
    TracksModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
