import { JwtService } from '@nestjs/jwt';
import { UserService } from '../../user/services/user.service';
import { User } from '../../user/models/user.entity';
import {
  BadRequestException,
  NotFoundException,
  Injectable,
  UnauthorizedException,
  Inject,
  forwardRef,
} from '@nestjs/common';
const bcrypt = require('bcrypt');

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,

    @Inject(forwardRef(() => UserService))
    private userService: UserService,
  ) {}

  async signup(userData: Partial<User>) {
    // Check existing email
    const exist = await this.userService.findByEmail(userData.email);
    if (exist) throw new BadRequestException('Email already exists');

    // Hash the user password
    const hashedPassword = await bcrypt.hash(userData.password, 12);

    // Create a new user and save him
    const user = await this.userService.insertOne({
      ...userData,
      password: hashedPassword,
    });

    // return the user
    return user;
  }

  async login(email: string, password: string) {
    // Check existing email
    const user = await this.userService.findByEmail(email);
    if (!user) throw new NotFoundException('Email Not Found!');

    // Validate password
    const doMatch = await bcrypt.compare(password, user.password);
    if (!doMatch) throw new UnauthorizedException('Wrong Password!');

    // Generate a JWT with all user data except password
    delete user.password;
    let token = await this.jwtService.signAsync({ ...user });
    return { access_token: token };
  }
}
