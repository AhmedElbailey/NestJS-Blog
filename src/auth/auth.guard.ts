import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    // Extract the Authorization header
    const authHeader = request.get('Authorization');
    if (!authHeader) throw new UnauthorizedException();

    // Extract the token and Bearer from the header
    const [type, token] = authHeader.split(' ');
    if (!token || type !== 'Bearer') throw new UnauthorizedException();

    // Validate the token
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
      });
      // Assigning the payload to the request object here
      // so that we can access it in our route handlers
      request.user = payload;
    } catch (err) {
      throw new UnauthorizedException();
    }
    return true;
  }
}
