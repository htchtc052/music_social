import { BadRequestException, Injectable } from '@nestjs/common';
import { UpdateTrackDto } from './dto/update-track.dto';
import { PrismaService } from 'nestjs-prisma';
import { Prisma, Track, TrackFile, User } from '@prisma/client';
import { TrackResponse } from './dto/track-response.dto';
import { TrackNotFoundException } from './exception/trackNotFoundException';
import { PrismaErrors } from '../../prisma/prismaErrors';

@Injectable()
export class TrackService {
  constructor(private prisma: PrismaService) {}
  async create(user: User, uploadedFile: Express.Multer.File) {
    const track: Track = await this.prisma.track.create({
      data: {
        title: uploadedFile.originalname,
        userId: user.id,
      },
    });

    const trackFile: TrackFile = await this.prisma.trackFile.create({
      data: {
        filePath: uploadedFile.path,
        fileSize: uploadedFile.size,
        mimetype: uploadedFile.mimetype,
        duration: 444,
        trackId: track.id,
      },
    });
    return new TrackResponse({ ...track, file: trackFile });
  }

  async getTrackById(id: number) {
    const track = await this.prisma.track.findUnique({
      where: { id, isDeleted: false },
      include: { file: true },
    });

    return track;
  }

  async getUserTracks(user: User, includePrivate: boolean = false) {
    const where: Prisma.TrackWhereInput = {
      userId: user.id,
      isDeleted: false,
    };

    if (!includePrivate) {
      where.private = false;
    }

    const tracks = await this.prisma.track.findMany({
      where,
      include: {
        file: true,
      },
    });

    return tracks.map((track) => new TrackResponse(track));
  }

  async update(track: Track, updateTrackDto: UpdateTrackDto) {
    try {
      const updatedTrack = await this.prisma.track.update({
        where: { id: track.id },
        data: updateTrackDto,
      });

      return new TrackResponse(updatedTrack);
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === PrismaErrors.RecordDoesNotExist
      ) {
        throw new TrackNotFoundException(track.id);
      }
      throw new BadRequestException();
    }
  }

  async remove(track: Track) {
    try {
      const removedTrack: Track = await this.prisma.track.update({
        where: {
          id: track.id,
        },
        data: { isDeleted: true },
      });
      return removedTrack;
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === PrismaErrors.RecordDoesNotExist
      ) {
        throw new TrackNotFoundException(track.id);
      }
      throw new BadRequestException();
    }
  }
}
