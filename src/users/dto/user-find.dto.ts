import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, Matches } from 'class-validator';

export class UserFindDto {
  @IsOptional()
  @IsString()
  @Matches(/^[a-zA-Z0-9]+$/, { message: 'Bad username' })
  @ApiProperty({ required: false })
  public readonly username?: string;

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
