import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  FileTypeValidator,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseFilePipe,
  ParseIntPipe,
  Patch,
  Post,
  SerializeOptions,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { TracksService } from './tracks.service';
import { ApiBearerAuth, ApiBody, ApiConsumes } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthUser } from '../auth/auth-user.decorator';
import { User } from '@prisma/client';
import { GROUP_OWNER, TrackResponse } from './dto/track-response.dto';
import { AccessTokenGuard } from '../auth/guards/access-token.guard';
import { UpdateTrackDto } from './dto/update-track.dto';
import { TrackForbiddenException } from './exception/trackForbiddenException';

@UseInterceptors(ClassSerializerInterceptor)
@Controller('track-user')
export class TracksPrivateController {
  constructor(private readonly tracksService: TracksService) {}

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
    return this.tracksService.create(user, file);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth()
  @SerializeOptions({
    groups: [GROUP_OWNER],
  })
  async getUserTrack(
    @AuthUser() user: User,
    @Param('id', ParseIntPipe) id: number,
  ) {
    const track = await this.tracksService.getTrackById(id);

    if (track.id != user.id) {
      throw new TrackForbiddenException();
    }

    return new TrackResponse(track);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth()
  @SerializeOptions({
    groups: [GROUP_OWNER],
  })
  async getUserTracks(@AuthUser() user: User) {
    return this.tracksService.getUserTracks(user.id, true);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth()
  update(
    @AuthUser() user: User,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTrackDto: UpdateTrackDto,
  ): Promise<TrackResponse> {
    return this.tracksService.update(id, user.id, updateTrackDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  async remove(@AuthUser() user: User, @Param('id', ParseIntPipe) id: number) {
    const removedTrack = await this.tracksService.remove(id, user.id);
    return `Track id ${removedTrack.id} deleted`;
  }
}
