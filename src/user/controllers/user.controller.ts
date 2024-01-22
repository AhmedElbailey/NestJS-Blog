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
  DefaultValuePipe,
  ParseIntPipe,
  Put,
  BadRequestException,
  UseInterceptors,
  UploadedFile,
  Res,
} from '@nestjs/common';
import { Pagination } from 'nestjs-typeorm-paginate';
import { UserService } from '../services/user.service';
import { CreateUserDto } from '../dtos/create-user.dto';
import { LoginUserDto } from '../dtos/login-user.dto';
import { Serialize } from '../../Interceptors/serialize.interceptor';
import { UserDto } from '../dtos/user.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { UserIsUserGuard } from '../../auth/guards/user-is-user.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { AuthService } from '../../auth/services/auth.service';
import { User } from '../models/user.entity';
import { hasRoles } from '../decorators/roles.decorator';
import { UserRoles } from '../models/user.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { profileImageStorageOptions } from '../../multer.config';
import { Express } from 'express';
import { join } from 'path';

@Serialize(UserDto)
@Controller('users')
export class UserController {
  constructor(
    private userService: UserService,
    private authService: AuthService,
  ) {}

  @Post('/signup')
  async signupAsUser(@Body() body: CreateUserDto) {
    return this.authService.signup(body);
  }

  @Post('/admin/signup')
  async signupAsAdmin(@Body() body: CreateUserDto) {
    return this.authService.signup(body, true);
  }

  @Post('/login')
  async login(@Body() body: LoginUserDto) {
    return this.authService.login(body.email, body.password);
  }

  // Paggination Route, ex: /users?page=1&limit=10
  @Get('')
  async index(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10,
    @Query('username') username: string = '',
  ): Promise<Pagination<User>> {
    limit = limit > 100 ? 100 : limit;
    let res: any;
    if (username) {
      res = await this.userService.paginateFilterByUsername(
        { page, limit, route: '/users' },
        username,
      );
    } else {
      res = await this.userService.paginate({ page, limit, route: '/users' });
    }
    res.items.map((user: User) => {
      delete user.password;
      return user;
    });

    return res;
  }

  @Get('/:id')
  @UseGuards(JwtAuthGuard, UserIsUserGuard)
  async findOne(@Param('id') id: string) {
    return this.userService.findById(parseInt(id));
  }

  @Patch('/:id')
  @UseGuards(JwtAuthGuard, UserIsUserGuard)
  updateOne(@Param('id') id: string, @Body() body: Partial<User>) {
    return this.userService.updateOne(parseInt(id), body);
  }

  @Put('/:id/role')
  @hasRoles(UserRoles.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  updateUserRole(@Param('id') id: string, @Body() body: Partial<User>) {
    if (!body.role) throw new BadRequestException('New role is required');
    return this.userService.updateUserRole(parseInt(id), body);
  }

  @Delete('/:id')
  @hasRoles(UserRoles.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  deleteOne(@Param('id') id: string) {
    return this.userService.deleteOne(parseInt(id));
  }

  @Post('/upload')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file', profileImageStorageOptions))
  uploadFile(@UploadedFile() file: Express.Multer.File, @Request() req) {
    return this.userService.updateOne(req.user.id, {
      profileImage: file.filename,
    });
  }

  @Get('/profile-image/:imagename')
  getProfileImage(@Param('imagename') imagename, @Res() res) {
    return res.sendFile(
      join(process.cwd(), 'uploads/profileimages/' + imagename),
    );
  }
}

// Another way for serving invoices:
// const file = createReadStream(
//   join(process.cwd(), 'uploads/profileimages/' + imagename),
// );
// file.pipe(res);
