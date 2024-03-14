import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class RegisterUserDto {
  @ApiProperty({ example: 'john_doe', description: 'User name' })
  @IsNotEmpty()
  username: string;

  @ApiProperty({ example: 'user@mail.com', description: 'User email' })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'Strong_password', description: 'User password' })
  @IsNotEmpty()
  password: string;
}
