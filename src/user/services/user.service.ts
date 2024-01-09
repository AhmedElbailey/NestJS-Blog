import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../models/user.entity';
import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  insertOne(userData: Object) {
    const user = this.repo.create(userData);
    return this.repo.save(user);
  }

  findAll() {
    return this.repo.find({});
  }

  async findById(id: number) {
    if (!id) return null;
    return this.repo.findOne({ where: { id } });
  }
  async findByEmail(email: string) {
    if (!email) return null;
    return this.repo.findOne({ where: { email } });
  }

  async updateOne(id: number, attrs: Partial<User>) {
    const user = await this.repo.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('user not found');
    }
    Object.assign(user, attrs);
    return this.repo.save(user);
  }

  deleteOne(id: number) {
    return this.repo.delete({ id });
  }
}
