import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert } from 'typeorm';
export enum UserRoles {
  ADMIN = 'admin',
  USER = 'user',
  EDITOR = 'editor',
  CHIEFEDITOR = 'chiefeditor',
}

@Entity()
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

  // @Column({ type: 'enum', enum: UserRole, default: UserRole.USER })
  // role: UserRole;
  @Column({ default: UserRoles.USER })
  role: string;

  @BeforeInsert()
  emailToLowerCase() {
    this.email = this.email.toLowerCase();
  }
}
