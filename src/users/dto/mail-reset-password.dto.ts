import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsUrl } from 'class-validator';

export class MailResetPasswordDto {
  @IsEmail()
  @ApiProperty()
  public readonly email: string;

  @IsUrl()
  @ApiProperty()
  public readonly callbackUrl: string;
}
