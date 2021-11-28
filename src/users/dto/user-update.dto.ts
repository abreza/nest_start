import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';

export class UserUpdateDto {
  @IsNotEmpty()
  @IsString()
  @Matches(/^[a-zA-Z0-9]+$/, { message: 'Bad username' })
  @ApiProperty()
  public readonly username: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ required: false })
  public readonly firstName?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ required: false })
  public readonly lastName?: string;

  @IsOptional()
  @IsEmail()
  @ApiProperty({ required: false })
  public readonly email?: string;
}
