import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString, Matches } from 'class-validator';
import { PermissionTag } from 'src/roles/enum/permission-tag.enum';

export class CheckPermissionDto {
  @IsNotEmpty()
  @IsString()
  @Matches(/^[a-zA-Z0-9]+$/, { message: 'Bad username' })
  @ApiProperty()
  public readonly username: string;

  @IsNotEmpty()
  @IsEnum(PermissionTag, { each: true })
  @ApiProperty({
    type: 'array',
    items: {
      enum: Object.keys(PermissionTag),
    },
  })
  public permissions: PermissionTag[];
}
