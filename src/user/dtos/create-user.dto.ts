import { IsString } from 'class-validator';
import { Unique } from 'typeorm';

export class CreateuserDto {
  @IsString()
  name: string;

  @IsString()
  @Unique(['username'])
  username: string;

  @IsString()
  email: string;

  @IsString()
  passowrd: string;
}
