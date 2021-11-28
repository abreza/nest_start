import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class RoleIdDto {
  @IsOptional()
  @IsString()
  @ApiProperty({ required: false })
  public readonly id?: string;
}
