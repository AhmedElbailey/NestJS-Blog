import { Expose } from 'class-transformer';
import { IsOptional } from 'class-validator';
import { UserRoles } from '../models/user.entity';

export class UserDto {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  username: string;

  @Expose()
  email: string;

  @Expose()
  role: UserRoles;

  @Expose()
  profileImage: string;

  @Expose()
  @IsOptional()
  access_token: string;
}
