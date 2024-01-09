import { IsEmail, IsString, isStrongPassword } from 'class-validator';
import { BeforeInsert, Unique } from 'typeorm';

export class CreateUserDto {
  @IsString()
  name: string;

  @IsString()
  @Unique(['username'])
  username: string;

  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}
