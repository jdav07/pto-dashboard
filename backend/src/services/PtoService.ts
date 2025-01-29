// src/services/PtoService.ts
import { db } from '../db/index';
import { PtoRequest } from '../models/PtoRequest';

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
      remainingHours: remaining,
    };
  }

  async getRequests(userId: number): Promise<PtoRequest[]> {
    return db.getRequestsByUserId(userId);
  }

  async submitRequest(
    userId: number,
    requestDate: string,
    hours: number,
    reason: string
  ) {
    
    const user = await db.findUserById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const remaining = user.maxPtoHours - user.usedPtoHours;
    if (hours > remaining) {
      throw new Error('Insufficient PTO balance');
    }

    await db.createPtoRequest({
      id: 0,
      userId,
      requestDate,
      hours,
      reason,
      status: 'pending',
    });

    const newUsed = Number(user.usedPtoHours) + Number(hours);
    await db.updateUser({
      ...user,
      usedPtoHours: newUsed,
    });
  }
}
