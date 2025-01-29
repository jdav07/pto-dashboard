// src/middleware/authMiddleware.ts
import { Context, Next } from 'koa';
import jwt from 'jsonwebtoken';

export async function authMiddleware(ctx: Context, next: Next) {
  const header = ctx.headers['authorization'];
  if (!header) {
    ctx.status = 401;
    ctx.body = { error: 'Missing Authorization header' };
    return;
  }

  const token = header.replace('Bearer ', '');
  const SECRET_KEY = process.env.JWT_SECRET_KEY;
  if (!SECRET_KEY) {
    throw new Error('JWT_SECRET_KEY environment variable is required');
  }
  
  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    if (typeof decoded === 'string' || !('userId' in decoded)) {
      ctx.status = 401;
      ctx.body = { error: 'Invalid token payload' };
      return;
    }
    ctx.state.userId = (decoded as any).userId;
    await next();
  } catch (err) {
    ctx.status = 401;
    ctx.body = { error: 'Invalid token' };
  }
}