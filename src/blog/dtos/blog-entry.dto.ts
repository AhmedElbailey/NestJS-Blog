import { Expose, Transform } from 'class-transformer';
import { User } from '../../user/models/user.entity';

export class BlogEntryDto {
  @Expose()
  id: number;

  @Expose()
  title: string;

  @Expose()
  slug: string;

  @Expose()
  description: string;

  @Expose()
  body: string;

  @Expose()
  likes: number;

  @Expose()
  headerImage: string;

  @Expose()
  publishedDate: Date;

  @Expose()
  isPublished: Boolean;

  @Expose()
  created_at: Date;

  @Expose()
  updated_at: Date;

  @Expose()
  author: User;
}
