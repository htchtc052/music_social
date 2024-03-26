import { Module } from '@nestjs/common';
import { TracksService } from './tracks.service';
import { TracksPrivateController } from './tracks-private.controller';
import { TracksPublicController } from './track-public.controller';

@Module({
  controllers: [TracksPrivateController, TracksPublicController],
  providers: [TracksService],
})
export class TracksModule {}
