import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsArray,
  ArrayUnique,
  Matches,
} from 'class-validator';

export class UserRoleDto {
  @IsNotEmpty()
  @IsString()
  @Matches(/^[a-zA-Z0-9]+$/, { message: 'Bad username' })
  @ApiProperty()
  public username: string;

  @IsNotEmpty()
  @IsArray()
  @ArrayUnique()
  @ApiProperty()
  public roleIds: string[];
}
