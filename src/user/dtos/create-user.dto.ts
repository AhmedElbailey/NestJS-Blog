import { IsEmail, IsEnum, IsString } from 'class-validator';
import { BeforeInsert, Unique } from 'typeorm';
import { UserRoles } from '../models/user.entity';
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

  @IsString()
  @IsEnum(UserRoles)
  role: UserRoles;
}
