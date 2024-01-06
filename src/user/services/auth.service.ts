import { Injectable } from '@nestjs/common';
import { User } from '../models/user.entity';
import { UserService } from './user.service';

@Injectable()
export class AuthService {
  constructor(private userService: UserService) {}

  signup(email: string, password: string) {}
}
