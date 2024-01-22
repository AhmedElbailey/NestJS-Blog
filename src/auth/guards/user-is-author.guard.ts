import {
  CanActivate,
  ExecutionContext,
  NotFoundException,
  UnauthorizedException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { BlogService } from '../../blog/services/blog.service';

export class UserIsAuthorGuard implements CanActivate {
  constructor(
    @Inject(forwardRef(() => BlogService))
    private blogService: BlogService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const userData = request.user;

    //   User must be authenticated
    if (!userData) throw new UnauthorizedException();

    const userId = userData.id;
    const blogId = Number(request.params.id);
    const blog = await this.blogService.findOneById(blogId);

    if (!blog) throw new NotFoundException('Blog Not Found!');

    return userId === blog.author.id;
  }
}
