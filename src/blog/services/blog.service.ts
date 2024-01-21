import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BlogEntryEntity } from '../models/blog-entry.entity';
import { UserService } from '../../user/services/user.service';
import { CreateBlogDto } from '../dtos/create-blog.dto';
import {
  IPaginationOptions,
  Pagination,
  paginate,
} from 'nestjs-typeorm-paginate';

const slugify = require('slugify');

@Injectable()
export class BlogService {
  constructor(
    @InjectRepository(BlogEntryEntity)
    private blogRepo: Repository<BlogEntryEntity>,

    private userService: UserService,
  ) {}

  async create(blogEntryData: CreateBlogDto, userId: number) {
    const user = await this.userService.findById(userId);
    const slug = await this.generateSlug(blogEntryData.title);
    const blog = this.blogRepo.create({ ...blogEntryData, slug, author: user });
    return this.blogRepo.save(blog);
  }

  generateSlug(title: string) {
    return slugify(title);
  }

  async paginateAll(
    options: IPaginationOptions,
  ): Promise<Pagination<BlogEntryEntity>> {
    return paginate<BlogEntryEntity>(this.blogRepo, options, {
      relations: ['author'],
    });
  }

  async paginateFilterByUsername(
    options: IPaginationOptions,
    username: string,
  ) {
    return paginate(this.blogRepo, options, {
      where: { author: { username: username } },
      relations: ['author'],
    });
  }

  findOneById(id: number) {
    return this.blogRepo.findOne({ where: { id }, relations: ['author'] });
  }

  async updateOne(id: number, data: Partial<BlogEntryEntity>) {
    const blog = await this.blogRepo.findOne({ where: { id } });
    if (!blog) throw new NotFoundException('Blog not found');
    Object.assign(blog, data);
    return this.blogRepo.save(blog);
  }

  deleteOne(id: number) {
    return this.blogRepo.delete({ id });
  }
}
