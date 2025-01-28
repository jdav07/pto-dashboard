import { db } from '../db/index';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export class AuthService {
  constructor(private secretKey: string) {}

  async login(email: string, password: string): Promise<{ token: string }> {
    const user = await db.findUserByEmail(email);
    if (!user) {
      throw new Error('Invalid credentials');
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      throw new Error('Invalid credentials');
    }

    const token = jwt.sign({ userId: user.id }, this.secretKey, {
      expiresIn: '1h',
    });

    return { token };
  }
}