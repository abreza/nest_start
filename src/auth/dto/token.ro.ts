import { ApiProperty } from '@nestjs/swagger';

export class TokenRo {
  @ApiProperty()
  public username: string;
}
