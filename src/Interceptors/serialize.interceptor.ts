import {
  CallHandler,
  ExecutionContext,
  NestInterceptor,
  UseInterceptors,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

interface ClassConstructor {
  new (...args: any[]): {};
}
export function Serialize(dto: ClassConstructor) {
  return UseInterceptors(new SerializeInterceptor(dto));
}
class SerializeInterceptor implements NestInterceptor {
  constructor(private dto: ClassConstructor) {}

  intercept(
    context: ExecutionContext,
    handler: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    // Check excluded routes
    const request = context.switchToHttp().getRequest();
    const path = request.route.path;
    const excludeSerialization =
      path === '/users' ||
      path === '/blog-entries' ||
      path === '/blog-entries/image/upload/:blogEntryId';

    return handler.handle().pipe(
      map((data: any) => {
        // Clause guard for skipping the serialization
        if (excludeSerialization) return data;

        // Serialize the data
        return plainToInstance(this.dto, data, {
          excludeExtraneousValues: true,
        });
      }),
    );
  }
}
