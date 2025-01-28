import { User } from '@/models/User';
import { PtoRequest } from '@/models/PtoRequest';
import { db } from '@/db/index';

export class PtoService {
  async getBalance(userId: number) {
    const user = await db.findUserById(userId);
    if (!user) {
      throw new Error('User not found');
    }
    const remaining = user.maxPtoHours - user.usedPtoHours;
    return {
      maxHours: user.maxPtoHours,
      usedHours: user.usedPtoHours,
      remainingHours: remaining
    };
  }

  async getRequests(userId: number): Promise<PtoRequest[]> {
    // fetch from DB
    const requests = await db.getRequestsByUserId(userId);
    return requests;
  }

  async submitRequest(userId: number, requestDate: string, hours: number, reason: string) {
    // 1) find user
    const user = await db.findUserById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // 2) check hours
    const remaining = user.maxPtoHours - user.usedPtoHours;
    if (hours > remaining) {
      throw new Error('Insufficient PTO balance');
    }

    // 3) insert request
    await db.createPtoRequest({
      id: 0,
      userId,
      requestDate,
      hours,
      reason,
      status: 'pending',
    });

    // 4) update user used hours
    const newUsed = user.usedPtoHours + hours;
    await db.updateUser({ ...user, usedPtoHours: newUsed });
  }
}