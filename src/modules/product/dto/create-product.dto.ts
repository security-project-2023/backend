import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsEnum, IsString } from 'class-validator';
import { Age } from 'src/shared/entities/product.entity';

export class CreateProductDto {
  @ApiProperty({
    description: '상품 이름',
    example: '상품 이름입니다.',
  })
  @IsString()
  title!: string;

  @ApiProperty({
    description: '상품 설명',
    example: '상품 설명입니다.',
  })
  @IsString()
  description!: string;

  @ApiProperty({
    description: '상품 이미지',
    example:
      'https://img1.kakaocdn.net/thumb/C320x320@2x.fwebp.q82/?fname=https%3A%2F%2Fst.kakaocdn.net%2Fproduct%2Fgift%2Fproduct%2F20230303142142_007aa3611cdf49b39c7e8c903c0aa381.jpg',
  })
  @IsString()
  thumbnail!: string;

  @ApiProperty({
    description: '상품 연령',
    enum: Age,
  })
  @IsEnum(Age)
  age!: Age;

  @ApiProperty({
    description: '상품 장소',
    example: '서울특별시 강남구',
  })
  @IsString()
  place!: string;

  @ApiProperty({
    description: '상품 가격',
    example: ['10000', '20000', '30000'],
  })
  @IsArray()
  @IsString({ each: true })
  prices!: string[];

  @ApiProperty({
    description: '상품 날짜',
    example: '2021-01-01',
  })
  @IsString()
  date!: string;

  @ApiProperty({
    description: '상품 시간',
    example: '2021-01-01 00:00:00',
  })
  @IsString()
  time!: string;
}
