import { Expose } from 'class-transformer';
import { IsOptional } from 'class-validator';

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
  @IsOptional()
  access_token: string;
}
