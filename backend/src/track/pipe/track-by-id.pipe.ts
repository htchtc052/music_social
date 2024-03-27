import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { TrackService } from '../track.service';
import { Track } from '@prisma/client';
import { TrackNotFoundException } from '../exception/trackNotFoundException';

@Injectable()
export class TrackByIdPipe implements PipeTransform<string> {
  constructor(private readonly trackService: TrackService) {}

  async transform(value: string): Promise<Track> {
    const id = parseInt(value, 10); // Using parseIntPipe functionality
    if (isNaN(id)) {
      throw new BadRequestException('Invalid track ID');
    }

    const track = await this.trackService.getTrackById(id);

    if (!track) {
      throw new TrackNotFoundException(id);
    }
    return track;
  }
}
