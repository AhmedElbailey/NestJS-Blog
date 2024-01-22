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

  async signup(userData: Partial<User>, isAdmin = false) {
    // Check existing email
    const exist = await this.userService.findByEmail(userData.email);
    if (exist) throw new BadRequestException('Email already exists');

    // Hash the user password
    const hashedPassword = await bcrypt.hash(userData.password, 12);

    // Create a new user and save him
    if (isAdmin) {
      return this.userService.insertOneAsAdmin({
        ...userData,
        password: hashedPassword,
      });
    } else {
      return this.userService.insertOneAsUser({
        ...userData,
        password: hashedPassword,
      });
    }
  }

  async login(email: string, password: string) {
    // Check existing email
    const user = await this.userService.findByEmail(email);
    if (!user) throw new NotFoundException('Email Not Found!');

    // Validate password
    const doMatch = await bcrypt.compare(password, user.password);
    if (!doMatch) throw new UnauthorizedException('Wrong Password!');

    // Generate a JWT with payload of user id and role
    delete user.password;
    let token = await this.jwtService.signAsync({
      id: user.id,
      role: user.role,
    });
    return { access_token: token };
  }
}
