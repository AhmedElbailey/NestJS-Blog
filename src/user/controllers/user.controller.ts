import {
  Controller,
  Body,
  Param,
  Query,
  Get,
  Post,
  Patch,
  Delete,
  UseGuards,
  Request,
  ForbiddenException,
  DefaultValuePipe,
  ParseIntPipe,
  Put,
  BadRequestException,
} from '@nestjs/common';
import { Pagination } from 'nestjs-typeorm-paginate';
import { UserService } from '../services/user.service';
import { CreateUserDto } from '../dtos/create-user.dto';
import { LoginUserDto } from '../dtos/login-user.dto';
import { Serialize } from '../../Interceptors/serialize.interceptor';
import { UserDto } from '../dtos/user.dto';
import { AuthGuard } from '../../auth/guards/auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { AuthService } from '../../auth/services/auth.service';
import { User } from '../models/user.entity';
import { hasRoles } from '../decorators/roles.decorator';
import { UserRoles } from '../models/user.entity';

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

  // Paggination Route
  // ex: /users?page=1&limit=10
  @Get('')
  async index(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10,
  ): Promise<Pagination<User>> {
    limit = limit > 100 ? 100 : limit;
    const res = await this.userService.paginate({
      page,
      limit,
      route: '/users',
    });
    res.items.map((user) => {
      delete user.password;
      return user;
    });
    console.log(res);
    return res;
  }

  @Get('/:id')
  @UseGuards(AuthGuard)
  async findOne(@Param('id') id: string, @Request() req) {
    // Authorization
    if (req.user.id !== parseInt(id)) throw new ForbiddenException();

    return req.user;
  }

  @UseGuards(AuthGuard)
  @Patch('/:id')
  updateOne(
    @Param('id') id: string,
    @Body() body: Partial<User>,
    @Request() req,
  ) {
    // Authorization
    if (req.user.id !== parseInt(id)) throw new ForbiddenException();

    return this.userService.updateOne(parseInt(id), body);
  }

  @hasRoles(UserRoles.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  @Put('/:id/role')
  updateUserRole(@Param('id') id: string, @Body() body: Partial<User>) {
    if (!body.role) throw new BadRequestException('New role is required');
    return this.userService.updateUserRole(parseInt(id), body);
  }

  @UseGuards(AuthGuard)
  @Delete('/:id')
  deleteOne(@Param('id') id: string, @Request() req) {
    // Authorization
    if (req.user.id !== parseInt(id)) throw new ForbiddenException();

    return this.userService.deleteOne(parseInt(id));
  }
}
