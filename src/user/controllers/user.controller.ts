import {
  Body,
  Param,
  Get,
  Post,
  Patch,
  Delete,
  NotFoundException,
} from '@nestjs/common';
import { Controller } from '@nestjs/common';
import { UserService } from '../services/user.service';
import { CreateuserDto } from '../dtos/create-user.dto';
import { UpdateUserDto } from '../dtos/update-user.dto';
import { Serialize } from '../../Interceptors/serialize.interceptor';
import { UserDto } from '../dtos/user.dto';

@Serialize(UserDto)
@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('')
  create(@Body() body: CreateuserDto) {
    return this.userService.create(body);
  }

  @Get('/:id')
  async findOne(@Param('id') id: string) {
    const user = await this.userService.findById(parseInt(id));
    if (!user) throw new NotFoundException('user not found');
    return user;
  }

  @Get()
  async findAll() {
    return this.userService.findAll();
  }

  @Patch('/:id')
  updateOne(@Param('id') id: string, @Body() body: UpdateUserDto) {
    return this.userService.updateOne(parseInt(id), body);
  }

  @Delete('/:id')
  deleteOne(@Param('id') id: string) {
    return this.userService.deleteOne(parseInt(id));
  }
}
