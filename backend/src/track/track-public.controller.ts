import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  UseInterceptors,
} from '@nestjs/common';
import { TrackService } from './track.service';
import { ApiParam } from '@nestjs/swagger';
import { TrackByIdPipe } from './pipe/track-by-id.pipe';
import { Track, User } from '@prisma/client';
import { TrackResponse } from './dto/track-response.dto';
import { UserByIdPipe } from '../user/pipe/user-by-id.pipe';

@UseInterceptors(ClassSerializerInterceptor)
@Controller('track-public')
export class TrackPublicController {
  constructor(private readonly trackService: TrackService) {}
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiParam({ name: 'id', required: true })
  getTrackById(@Param('id', TrackByIdPipe) track: Track) {
    return new TrackResponse(track);
  }

  @Get('/user/:userId')
  @HttpCode(HttpStatus.OK)
  async getUserTracks(@Param('userId', UserByIdPipe) user: User) {
    return this.trackService.getUserTracks(user);
  }
}
