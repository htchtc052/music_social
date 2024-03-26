import { Test, TestingModule } from '@nestjs/testing';
import { TracksService } from './tracks.service';
import { PrismaService } from 'nestjs-prisma';
import { Track, TrackFile, User } from '@prisma/client';
import { TrackResponse } from './dto/track-response.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { NotFoundException } from '@nestjs/common';
import { TrackNotFoundException } from './exception/trackNotFoundException';

describe('TrackService', () => {
  let tracksService: TracksService;

  const prisma = {
    track: {
      create: jest.fn(),
      update: jest.fn(),
      findUnique: jest.fn(),
      findMany: jest.fn(),
    },
    trackFile: {
      create: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TracksService,
        {
          provide: PrismaService,
          useValue: prisma,
        },
      ],
    }).compile();

    tracksService = module.get<TracksService>(TracksService);
  });

  it('should be defined', () => {
    expect(tracksService).toBeDefined();
  });

  describe('tracks routes', () => {
    const ownerUser: User = {
      username: 'John smith',
      email: 'john@smith.com',
      password: 'pwd',
    } as User;

    const uploadedTrackFile: Express.Multer.File = {
      originalname: 'test_track.mp3',
      size: 1024,
      path: '/pathtofile',
      buffer: undefined,
      filename: 'test_str.mp3',
      destination: '/dest_folder',
      stream: undefined,
      mimetype: 'audio/mpeg',
    } as Express.Multer.File;

    const track: Track = {
      id: 1,
      userId: ownerUser.id,
      title: uploadedTrackFile.originalname,
    } as Track;

    const trackFile: TrackFile = {
      trackId: track.id,
      fileSize: uploadedTrackFile.size,
      filePath: uploadedTrackFile.path,
      mimetype: uploadedTrackFile.mimetype,
    } as TrackFile;

    const uploadedTrackResponse: TrackResponse = new TrackResponse({
      ...track,
      file: trackFile,
    });

    it('when the create track method is called', async () => {
      jest.spyOn(prisma.track, 'create').mockResolvedValue(track);

      jest.spyOn(prisma.trackFile, 'create').mockResolvedValue(trackFile);

      const createdTrack: TrackResponse = await tracksService.create(
        ownerUser,
        uploadedTrackFile,
      );

      expect(createdTrack).toEqual(uploadedTrackResponse);
    });

    describe('Manage track methods', () => {
      const guestUser: User = {
        username: 'Mary smith',
        email: 'mary@smith.com',
        password: 'pwd',
      } as User;

      const track1: TrackResponse = new TrackResponse({
        ...({ title: 'Track 1 title', userId: ownerUser.id } as Track),
        file: {} as TrackFile,
      });
      const track2: TrackResponse = new TrackResponse({
        ...({ title: 'Track 2 title', userId: ownerUser.id } as Track),
        file: {} as TrackFile,
      });

      const tracks = [track1, track2];

      beforeEach(async () => {
        tracksService.getUserTrack = jest
          .fn()
          .mockImplementation(async (id: number, userId: number) => {
            return tracks.find(
              (track) => track.id === id && track.userId === userId,
            );
          });

        tracksService.getUserTracks = jest
          .fn()
          .mockImplementation(async (userId: number) => {
            return tracks.filter((track) => track.userId === userId);
          });

        tracksService.update = jest
          .fn()
          .mockImplementation(
            async (
              id: number,
              userId: number,
              updatedTrackDto: UpdateTrackDto,
            ) => {
              const track = tracks.find(
                (track) => track.id === id && track.userId === userId,
              );

              console.debug(track);

              if (!track) {
                throw new TrackNotFoundException(id);
              }

              return {
                ...track1,
                ...updatedTrackDto,
              };
            },
          );
      });

      describe('and access tracks by owner', () => {
        it('when the get tracks method is called', async () => {
          const tracksResponse: TrackResponse[] =
            await tracksService.getUserTracks(ownerUser.id);

          expect(tracksResponse).toEqual(tracks);
        });

        it('when the get track method is called', async () => {
          const trackResponse: TrackResponse = await tracksService.getUserTrack(
            track1.id,
            ownerUser.id,
          );

          expect(trackResponse).toEqual(track1);
        });

        it('when the update track method is called', async () => {
          const updatedTrackDto: UpdateTrackDto = {
            title: 'Edited title',
          } as UpdateTrackDto;

          const updatedTrackResponse: TrackResponse =
            await tracksService.update(
              track1.id,
              ownerUser.id,
              updatedTrackDto,
            );

          expect(updatedTrackResponse).toEqual({
            ...track1,
            ...updatedTrackDto,
          });
        });
      });

      describe('and access tracks by guest', () => {
        it('when the get tracks method is called', async () => {
          const tracksResponse: TrackResponse[] =
            await tracksService.getUserTracks(guestUser.id);

          expect(tracksResponse).toEqual([]);
        });

        it('when the get track method is called', async () => {
          return expect(async () => {
            await tracksService.getTrackById(track1.id);
          }).rejects.toThrow(NotFoundException);
        });

        it('when the update track method is called', async () => {
          const updateTrackDto: UpdateTrackDto = {
            title: 'Edited title',
          } as UpdateTrackDto;
          return expect(async () => {
            await tracksService.update(track1.id, guestUser.id, updateTrackDto);
          }).rejects.toThrow(NotFoundException);
        });
      });
    });
  });
});
