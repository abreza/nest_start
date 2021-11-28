import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import {
  ArrayUnique,
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsString,
} from 'class-validator';
import { PermissionTag } from '../enum/permission-tag.enum';

export class UpdateRoleDto {
  @IsNotEmpty()
  @IsString()
  @Expose({ name: '_id' })
  @Type(() => String)
  @ApiProperty()
  public readonly id: string;

  @IsString()
  @ApiProperty()
  public readonly name: string;

  @ArrayUnique()
  @IsArray()
  @IsEnum(PermissionTag, { each: true })
  @ApiProperty({
    type: 'array',
    items: {
      enum: Object.keys(PermissionTag),
    },
  })
  public readonly permissions: PermissionTag[];
}
