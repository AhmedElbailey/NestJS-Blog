import { Module, forwardRef } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { UserModule } from '../user/user.module';
import { AuthGuard } from './guards/auth.guard';
import { RolesGuard } from './guards/roles.guard';

@Module({
  imports: [forwardRef(() => UserModule)],
  providers: [AuthService, AuthGuard, RolesGuard],
  exports: [AuthService],
})
export class AuthModule {}
