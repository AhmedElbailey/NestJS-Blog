import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BeforeInsert,
  OneToMany,
} from 'typeorm';
import { BlogEntryEntity } from '../../blog/models/blog-entry.entity';
import { Exclude } from 'class-transformer';
export enum UserRoles {
  ADMIN = 'admin',
  USER = 'user',
  EDITOR = 'editor',
  CHIEFEDITOR = 'chiefeditor',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  username: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ type: 'enum', enum: UserRoles, default: UserRoles.USER })
  role: UserRoles;

  @Column({ default: null })
  profileImage: string;

  @OneToMany(() => BlogEntryEntity, (blogEntry) => blogEntry.author)
  blogEntries: BlogEntryEntity[];

  //////////////////////////////////////
  // Hooks /////////////////////////////
  @BeforeInsert()
  emailToLowerCase() {
    this.email = this.email.toLowerCase();
  }
}
