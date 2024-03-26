import { PickType } from '@nestjs/mapped-types';
import { RegisterDto } from '../../auth/dto/register.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Genders } from '@prisma/client';

export class UpdateUserDto extends PickType(RegisterDto, [
  'username',
] as const) {
  @ApiProperty({ example: 'John', required: false })
  firstName: string;

  @ApiProperty({ example: 'Doe', required: false })
  lastName: string;

  @ApiProperty({ example: Genders.MALE, required: false })
  gender: Genders;
}
