import { IsString } from 'class-validator';

export class SingInDto {
  @IsString({
    message: 'The username must be a string',
  })
  id: string;

  @IsString({
    message: 'The password must be a string',
  })
  password: string;
}
