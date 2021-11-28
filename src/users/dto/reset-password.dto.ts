import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEmail, IsNumber } from 'class-validator';

export class ResetPasswordDto {
  @IsNumber()
  @Type(() => Number)
  @ApiProperty()
  public readonly resetCode: number;

  @IsEmail()
  @ApiProperty()
  public readonly email: string;
}
