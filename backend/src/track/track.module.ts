import { Module } from '@nestjs/common';
import { TrackService } from './track.service';
import { TrackPrivateController } from './track-private.controller';
import { TrackPublicController } from './track-public.controller';

@Module({
  controllers: [TrackPrivateController, TrackPublicController],
  providers: [TrackService],
})
export class TrackModule {}
