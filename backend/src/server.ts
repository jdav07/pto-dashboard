// src/server.ts
import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import cors from '@koa/cors';
import router from './routes';
import { db } from './db/index';

const PORT = process.env.PORT || 4000;

async function main() {
  await db.connect();

  const app = new Koa();
  app.use(bodyParser());
  app.use(cors({
    origin: process.env.NODE_ENV === 'development'
      ? 'http://localhost:8080'
      : process.env.ALLOWED_URLS
  }));

  app.use(router.routes());
  app.use(router.allowedMethods());

  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
}

main().catch((err) => {
  console.error('Failed to start server:', err);
});