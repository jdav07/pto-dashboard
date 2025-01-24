// backend/src/authMiddleware.ts

import { Context, Next } from 'koa';
import jwt from 'jsonwebtoken';

const SECRET_KEY = 'SUPER_SECRET_DEV_KEY';

export async function authMiddleware(ctx: Context, next: Next) {
  const authHeader = ctx.headers['authorization'];
  if (!authHeader) {
    ctx.status = 401;
    ctx.body = { error: 'Missing Authorization header' };
    return;
  }

  const token = authHeader.replace('Bearer ', '');
  try {
    const decoded = jwt.verify(token, SECRET_KEY) as { userId: number };
    ctx.state.userId = decoded.userId;
    await next();
  } catch (error) {
    ctx.status = 401;
    ctx.body = { error: 'Invalid token' };
  }
}
