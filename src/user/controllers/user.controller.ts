import {
  Body,
  Param,
  Get,
  Post,
  Patch,
  Delete,
  UseGuards,
  Request,
  ForbiddenException,
} from '@nestjs/common';
import { Controller } from '@nestjs/common';
import { UserService } from '../services/user.service';
import { CreateUserDto } from '../dtos/create-user.dto';
import { LoginUserDto } from '../dtos/login-user.dto';
import { Serialize } from '../../Interceptors/serialize.interceptor';
import { UserDto } from '../dtos/user.dto';
import { AuthGuard } from '../../auth/auth.guard';
import { AuthService } from '../../auth/auth.service';
import { User } from '../models/user.entity';

@Serialize(UserDto)
@Controller('users')
export class UserController {
  constructor(
    private userService: UserService,
    private authService: AuthService,
  ) {}

  @Post('/signup')
  async signup(@Body() body: CreateUserDto) {
    const user = await this.authService.signup(body);
    return user;
  }

  @Post('/login')
  async login(@Body() body: LoginUserDto) {
    return this.authService.login(body.email, body.password);
  }

  @Get()
  async findAll() {
    return this.userService.findAll();
  }

  @Get('/:id')
  @UseGuards(AuthGuard)
  async findOne(@Param('id') id: string, @Request() req) {
    // Authorization
    if (req.user.id !== parseInt(id)) throw new ForbiddenException();

    return req.user;
  }

  @Patch('/:id')
  @UseGuards(AuthGuard)
  updateOne(
    @Param('id') id: string,
    @Body() body: Partial<User>,
    @Request() req,
  ) {
    // Authorization
    if (req.user.id !== parseInt(id)) throw new ForbiddenException();

    return this.userService.updateOne(parseInt(id), body);
  }

  @Delete('/:id')
  deleteOne(@Param('id') id: string, @Request() req) {
    // Authorization
    if (req.user.id !== parseInt(id)) throw new ForbiddenException();

    return this.userService.deleteOne(parseInt(id));
  }
}
