import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../models/user.entity';
import { NotFoundException } from '@nestjs/common';
@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  create(user: Partial<User>) {
    return this.repo.save(user);
  }

  findAll() {
    return this.repo.find({});
  }

  async findById(id: number) {
    return this.repo.findOne({ where: { id } });
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
