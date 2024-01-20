import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { BlogService } from '../services/blog.service';
import { BlogEntryEntity } from '../models/blog-entry.entity';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CreateBlogDto } from '../dtos/create-blog.dto';

@Controller('blogs')
export class BlogController {
  constructor(private blogService: BlogService) {}

  @Post('create')
  @UseGuards(JwtAuthGuard)
  create(@Body() blogEntryData: CreateBlogDto, @Request() req) {
    const userId = req.user.id;
    return this.blogService.create(blogEntryData, userId);
  }

  @Get()
  findBlogEntries(@Query('userId') userId: number) {
    if (userId == null) {
      return this.blogService.findAll();
    } else {
      return this.blogService.findByUserId(userId);
    }
  }

  @Get('/:id')
  findOne(@Param('id') id: string) {
    return this.blogService.findOneById(parseInt(id));
  }
}
