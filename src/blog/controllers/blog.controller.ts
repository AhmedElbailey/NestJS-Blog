import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Request,
  Res,
  UseGuards,
  DefaultValuePipe,
  ParseIntPipe,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { BlogService } from '../services/blog.service';
import { BlogEntryEntity } from '../models/blog-entry.entity';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CreateBlogDto } from '../dtos/create-blog.dto';
import { UserIsAuthorGuard } from '../../auth/guards/user-is-author.guard';
import { Serialize } from '../../Interceptors/serialize.interceptor';
import { BlogEntryDto } from '../dtos/blog-entry.dto';
import { Pagination } from 'nestjs-typeorm-paginate';
import { FileInterceptor } from '@nestjs/platform-express';
import { blogEntryImageStorageOptions } from '../../multer.config';
import { ImageDto } from '../dtos/image.dto';
import { join } from 'path';

@Serialize(BlogEntryDto)
@Controller('blog-entries')
export class BlogController {
  constructor(private blogService: BlogService) {}

  @Post('create')
  @UseGuards(JwtAuthGuard)
  create(@Body() blogEntryData: CreateBlogDto, @Request() req) {
    const userId = req.user.id;
    return this.blogService.create(blogEntryData, userId);
  }

  // Paggination Route, ex: /users?page=1&limit=10
  @Get('')
  async index(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10,
    @Query('username') username: string = '',
  ): Promise<Pagination<BlogEntryEntity>> {
    limit = limit > 100 ? 100 : limit;
    let res: any;
    if (username) {
      res = await this.blogService.paginateFilterByUsername(
        { page, limit, route: '/blog-entries' },
        username,
      );
    } else {
      res = await this.blogService.paginateAll({
        page,
        limit,
        route: '/blog-entries',
      });
    }
    res.items.map((blogEntry: BlogEntryEntity) => {
      delete blogEntry.author.password;
      return blogEntry;
    });

    return res;
  }

  @Get('/:id')
  findOne(@Param('id') id: string) {
    return this.blogService.findOneById(parseInt(id));
  }

  @Patch('/:id')
  @UseGuards(JwtAuthGuard, UserIsAuthorGuard)
  updateOne(@Param('id') id: string, @Body() body: Partial<BlogEntryEntity>) {
    return this.blogService.updateOne(parseInt(id), body);
  }

  @Delete('/:id')
  @UseGuards(JwtAuthGuard, UserIsAuthorGuard)
  deleteOne(@Param('id') id: string) {
    return this.blogService.deleteOne(parseInt(id));
  }

  @Post('/image/upload/:blogEntryId')
  @Serialize(ImageDto)
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file', blogEntryImageStorageOptions))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Param('blogEntryId') blogEntryId: string,
  ) {
    await this.blogService.updateOne(Number(blogEntryId), {
      headerImage: file.filename,
    });
    return file;
  }

  @Get('/image/:imagename')
  getProfileImage(@Param('imagename') imagename, @Res() res) {
    return res.sendFile(
      join(process.cwd(), 'uploads/blog-entry-images/' + imagename),
    );
  }
}
