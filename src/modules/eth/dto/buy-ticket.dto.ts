import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class BuyTicketDto {
  @ApiProperty()
  @IsString()
  productId: string;

  @ApiProperty()
  @IsString()
  seat: string;

  @ApiProperty()
  @IsString()
  time: Date;
}
