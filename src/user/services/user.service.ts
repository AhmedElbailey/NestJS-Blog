import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User, UserRoles } from '../models/user.entity';
import { Injectable, NotFoundException } from '@nestjs/common';
import {
  paginate,
  Pagination,
  IPaginationOptions,
  paginateRaw,
} from 'nestjs-typeorm-paginate';

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  insertOne(userData: Object) {
    const user = this.repo.create({ ...userData, role: UserRoles.USER });
    return this.repo.save(user);
  }

  async paginate(options: IPaginationOptions): Promise<Pagination<User>> {
    return paginate<User>(this.repo, options);
  }

  async paginateFilterByUsername(
    options: IPaginationOptions,
    username: string,
  ) {
    const queryBuilder = this.repo
      .createQueryBuilder()
      .select('*')
      .where('username = :username', { username: username })
      .orderBy('id', 'ASC');

    return paginateRaw(queryBuilder, options);
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
    attrs.role ? delete attrs.role : null;
    Object.assign(user, attrs);
    return this.repo.save(user);
  }

  async updateUserRole(id: number, data: Partial<User>) {
    const user = await this.repo.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('user not found');
    }
    user.role = data.role;
    return this.repo.save(user);
  }

  deleteOne(id: number) {
    return this.repo.delete({ id });
  }
}
