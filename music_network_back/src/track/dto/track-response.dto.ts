import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { TrackFileResponse } from './track-file-response.dto';

export const GROUP_OWNER = 'group_owner';

export class TrackResponse {
  @ApiProperty({ required: true })
  @Expose()
  id: number;

  @ApiProperty({ required: true })
  @Expose()
  userId: number;

  @ApiProperty({ required: true })
  @Expose()
  title: string;

  @Expose()
  description: string;

  @ApiProperty()
  @Expose()
  keywords: string[];

  @ApiProperty()
  @Expose()
  createdAt: Date;

  @ApiProperty()
  @Expose()
  updatedAt: Date;

  @ApiProperty()
  @Expose({ groups: [GROUP_OWNER] })
  private: boolean;

  @Expose({ groups: [GROUP_OWNER] })
  hiddenDescription: string;

  @Exclude()
  isDeleted: boolean;

  @Expose({ name: 'trackFile' })
  file?: TrackFileResponse;

  constructor(partial?: Partial<TrackResponse>) {
    Object.assign(this, partial);
  }
}
