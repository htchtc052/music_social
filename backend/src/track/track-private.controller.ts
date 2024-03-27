import {
  Body,
  Controller,
  Delete,
  FileTypeValidator,
  ForbiddenException,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseFilePipe,
  Patch,
  Post,
  SerializeOptions,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { TrackService } from './track.service';
import { ApiBearerAuth, ApiBody, ApiConsumes } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthUser } from '../auth/auth-user.decorator';
import { Track, User } from '@prisma/client';
import { GROUP_OWNER, TrackResponse } from './dto/track-response.dto';
import { AccessTokenGuard } from '../auth/guards/access-token.guard';
import { UpdateTrackDto } from './dto/update-track.dto';
import { TrackByIdPipe } from './pipe/track-by-id.pipe';

@UseGuards(AccessTokenGuard)
@ApiBearerAuth()
@Controller('track-user')
export class TrackPrivateController {
  constructor(private readonly trackService: TrackService) {}

  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    required: true,
    type: 'multipart/form-data',
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FileInterceptor('file'))
  uploadTrack(
    @AuthUser() user: User,
    @UploadedFile(
      new ParseFilePipe({
        validators: [new FileTypeValidator({ fileType: 'audio/mpeg' })],
      }),
    )
    file: Express.Multer.File,
  ): Promise<TrackResponse> {
    return this.trackService.create(user, file);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @SerializeOptions({
    groups: [GROUP_OWNER],
  })
  async getUserTracks(@AuthUser() user: User) {
    return this.trackService.getUserTracks(user, true);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @SerializeOptions({
    groups: [GROUP_OWNER],
  })
  async getUserTrack(
    @AuthUser() user: User,
    @Param('id', TrackByIdPipe) track: Track,
  ) {
    if (track.userId != user.id) {
      throw new ForbiddenException();
    }

    return new TrackResponse(track);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  update(
    @AuthUser() user: User,
    @Param('id', TrackByIdPipe) track: Track,
    @Body() updateTrackDto: UpdateTrackDto,
  ): Promise<TrackResponse> {
    if (track.userId != user.id) {
      throw new ForbiddenException();
    }
    return this.trackService.update(track, updateTrackDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async remove(
    @AuthUser() user: User,
    @Param('id', TrackByIdPipe) track: Track,
  ) {
    if (track.userId != user.id) {
      throw new ForbiddenException();
    }
    const removedTrack = await this.trackService.remove(track);
    return `Track id ${removedTrack.id} deleted`;
  }
}
