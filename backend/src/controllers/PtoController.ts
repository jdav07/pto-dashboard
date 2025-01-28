import { Context } from 'koa';
import { PtoService } from '@/services/PtoService';

interface PtoRequestBody {
  requestDate: string;
  hours: number;
  reason: string;
}

export class PtoController {
  constructor(private ptoService: PtoService) {}

  async getBalance(ctx: Context) {
    const userId = ctx.state.userId;
    try {
      const data = await this.ptoService.getBalance(userId);
      ctx.body = data;
    } catch (err: any) {
      if (err.message === 'User not found') {
        ctx.status = 404;
        ctx.body = { error: 'User not found' };
      } else {
        ctx.status = 500;
        ctx.body = { error: 'Server error' };
      }
    }
  }

  async getRequests(ctx: Context) {
    const userId = ctx.state.userId;
    try {
      const requests = await this.ptoService.getRequests(userId);
      ctx.body = requests;
    } catch (err) {
      ctx.status = 500;
      ctx.body = { error: 'Server error' };
    }
  }

  async submitRequest(ctx: Context) {
    const userId = ctx.state.userId;

    const { requestDate, hours, reason } = ctx.request.body as PtoRequestBody;

    if (!requestDate || !hours || !reason) {
      ctx.status = 400;
      ctx.body = { error: 'requestDate, hours, and reason are required' };
      return;
    }

    try {
      await this.ptoService.submitRequest(userId, requestDate, hours, reason);
      ctx.body = { message: 'PTO request submitted successfully' };
    } catch (err: any) {
      if (err.message === 'User not found') {
        ctx.status = 404;
        ctx.body = { error: 'User not found' };
      } else if (err.message === 'Insufficient PTO balance') {
        ctx.status = 400;
        ctx.body = { error: err.message };
      } else {
        ctx.status = 500;
        ctx.body = { error: 'Server error' };
      }
    }
  }
}