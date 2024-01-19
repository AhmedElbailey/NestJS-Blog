import { User } from 'src/user/models/user.entity';
import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  BeforeUpdate,
} from 'typeorm';

@Entity('blog_entries')
export class BlogEntry {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  slug: string;

  @Column({ default: '' })
  description: string;

  @Column({ default: '' })
  body: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;

  @Column()
  likes: number;

  @Column()
  headerImage: string;

  @Column()
  publishedDate: Date;

  @Column()
  isPublished: Boolean;

  @ManyToOne(() => User, (user) => user.blogEntries)
  author: User;

  @BeforeUpdate()
  updateTimeStamp() {
    this.updated_at = new Date();
  }
}
