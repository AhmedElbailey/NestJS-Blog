import { Module, forwardRef } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { UserModule } from '../user/user.module';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { UserIsUserGuard } from './guards/user-is-user.guard';
import { BlogModule } from '../blog/blog.module';

@Module({
  imports: [forwardRef(() => UserModule), forwardRef(() => BlogModule)],
  providers: [AuthService, JwtAuthGuard, RolesGuard, UserIsUserGuard],
  exports: [AuthService],
})
export class AuthModule {}
