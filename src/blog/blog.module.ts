import { Module } from '@nestjs/common';
import { BlogController } from './controllers/blog.controller';
import { BlogService } from './services/blog.service';
import { BlogEntry } from './models/blog-entry.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([BlogEntry])],
  controllers: [BlogController],
  providers: [BlogService],
})
export class BlogModule {}
