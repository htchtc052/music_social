import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  UseInterceptors,
} from '@nestjs/common';
import { AuthUser } from '../auth/auth-user.decorator';
import { User } from '@prisma/client';
import { TracksService } from './tracks.service';

@UseInterceptors(ClassSerializerInterceptor)
@Controller('track-public')
export class TracksPublicController {
  constructor(private readonly tracksService: TracksService) {}
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  getUserTrackById(
    @AuthUser() user: User,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.tracksService.getTrack(id);
  }

  @Get('/user/:userId')
  @HttpCode(HttpStatus.OK)
  async getUserTracks(@Param('userId', ParseIntPipe) userId: number) {
    return this.tracksService.getUserTracks(userId);
  }
}
