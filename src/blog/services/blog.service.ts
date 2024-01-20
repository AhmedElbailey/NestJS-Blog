import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BlogEntryEntity } from '../models/blog-entry.entity';
import { UserService } from '../../user/services/user.service';
import { CreateBlogDto } from '../dtos/create-blog.dto';
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

  findAll() {
    return this.blogRepo.find({ relations: ['author'] });
  }

  findByUserId(userId: number) {
    return this.blogRepo.find({
      where: { author: { id: userId } },
      relations: ['author'],
    });
  }

  findOneById(id: number) {
    return this.blogRepo.findOne({ where: { id }, relations: ['author'] });
  }
}
