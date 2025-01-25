import Koa from 'koa';
import Router from 'koa-router';
import bodyParser from 'koa-bodyparser';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { initDB } from './db';
import { authMiddleware } from './authMiddleware';
import { User, PtoRequest } from './types';

import cors = require('@koa/cors');

const SECRET_KEY = process.env.JWT_SECRET_KEY;
if (!SECRET_KEY) throw new Error('JWT_SECRET_KEY required');

(async () => {
  const db = await initDB();
  const app = new Koa();
  const router = new Router();

  app.use(bodyParser());

  app.use(
    cors({
      origin:
        process.env.NODE_ENV === 'development'
          ? 'http://localhost:8080'
          : process.env.ALLOWED_URLS
    })
  );

  // POST /auth/login
  router.post('/auth/login', async (ctx) => {
    const { email, password } = ctx.request.body as {
      email: string;
      password: string;
    };
    if (!email || !password) {
      ctx.status = 400;
      ctx.body = { error: 'Email and password are required' };
      return;
    }

    try {
      const user = await db.get<User>('SELECT * FROM users WHERE email = ?', [
        email,
      ]);
      if (!user) {
        ctx.status = 401;
        ctx.body = { error: 'Invalid credentials' };
        return;
      }

      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        ctx.status = 401;
        ctx.body = { error: 'Invalid credentials' };
        return;
      }

      const token = jwt.sign({ userId: user.id }, SECRET_KEY, {
        expiresIn: '1h',
      });
      ctx.body = { token };
    } catch (error) {
      console.error(error);
      ctx.status = 500;
      ctx.body = { error: 'Internal Server Error' };
    }
  });

  // GET /pto/balance
  router.get('/pto/balance', authMiddleware, async (ctx) => {
    const userId = ctx.state.userId;
    try {
      const user = await db.get<User>(
        'SELECT * FROM users WHERE id = ?',
        [userId]
      );
      if (!user) {
        ctx.status = 404;
        ctx.body = { error: 'User not found' };
        return;
      }
      const remaining = user.maxPtoHours - user.usedPtoHours;
      ctx.body = {
        maxHours: user.maxPtoHours,
        usedHours: user.usedPtoHours,
        remainingHours: remaining,
      };
    } catch (error) {
      ctx.status = 500;
      ctx.body = { error: 'Failed to get PTO balance' };
    }
  });

  // GET /pto/requests
  router.get('/pto/requests', authMiddleware, async (ctx) => {
    const userId = ctx.state.userId;
    try {
      // fetch 'status' column as well
      const requests = await db.all<PtoRequest[]>(
        'SELECT id, userId, requestDate, hours, reason, status FROM pto_requests WHERE userId = ?',
        [userId]
      );
      ctx.body = requests;
    } catch (error) {
      ctx.status = 500;
      ctx.body = { error: 'Failed to get PTO requests' };
    }
  });

  // POST /pto/request
  router.post('/pto/request', authMiddleware, async (ctx) => {
    const userId = ctx.state.userId;
    const { requestDate, hours, reason } = ctx.request.body as {
      requestDate: string;
      hours: number;
      reason: string;
    };

    if (!requestDate || !hours || !reason) {
      ctx.status = 400;
      ctx.body = { error: 'requestDate, hours, and reason are required' };
      return;
    }

    try {
      const user = await db.get<User>(
        'SELECT * FROM users WHERE id = ?',
        [userId]
      );
      if (!user) {
        ctx.status = 404;
        ctx.body = { error: 'User not found' };
        return;
      }

      const remaining = user.maxPtoHours - user.usedPtoHours;
      if (hours > remaining) {
        ctx.status = 400;
        ctx.body = { error: 'Insufficient PTO balance' };
        return;
      }

      // Insert new request with status = 'pending'
      await db.run(
        `INSERT INTO pto_requests (userId, requestDate, hours, reason, status)
         VALUES (?, ?, ?, ?, 'pending')`,
        [userId, requestDate, hours, reason]
      );

      // update used hours
      const newUsed = user.usedPtoHours + hours;
      await db.run(
        'UPDATE users SET usedPtoHours = ? WHERE id = ?',
        [newUsed, userId]
      );

      ctx.body = { message: 'PTO request submitted successfully' };
    } catch (error) {
      console.error(error);
      ctx.status = 500;
      ctx.body = { error: 'Failed to submit PTO request' };
    }
  });

  app.use(router.routes()).use(router.allowedMethods());

  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => {
    console.log(`Koa server running on http://localhost:${PORT}`);
  });
})();