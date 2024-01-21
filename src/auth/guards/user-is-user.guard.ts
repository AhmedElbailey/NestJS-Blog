import {
  CanActivate,
  ExecutionContext,
  forwardRef,
  Inject,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
// import { UserService } from 'src/user/services/user.service';

export class UserIsUserGuard implements CanActivate {
  //   constructor(
  //     @Inject(forwardRef(() => UserService))
  //     private userService: UserService,
  //   ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const params = request.params;
    const userData = request.user;

    //   User must be authenticated
    if (!userData) throw new UnauthorizedException();

    return userData.id === Number(params.id);
  }
}
