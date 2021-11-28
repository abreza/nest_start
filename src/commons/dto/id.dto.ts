import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class IdDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  public readonly id: string;
}
