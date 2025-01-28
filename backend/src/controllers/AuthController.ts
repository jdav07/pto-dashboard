import { Context } from 'koa';
import { AuthService } from '@/services/AuthService';

interface LoginBody {
  email: string;
  password: string;
}

export class AuthController {
  constructor(private authService: AuthService) {}

  async login(ctx: Context) {
    
    const { email, password } = ctx.request.body as LoginBody;

    if (!email || !password) {
      ctx.status = 400;
      ctx.body = { error: 'Email and password are required' };
      return;
    }

    try {
      const { token } = await this.authService.login(email, password);
      ctx.body = { token };
    } catch (err: any) {
      if (err.message === 'Invalid credentials') {
        ctx.status = 401;
        ctx.body = { error: 'Invalid credentials' };
      } else {
        ctx.status = 500;
        ctx.body = { error: 'Server error' };
      }
    }
  }
}