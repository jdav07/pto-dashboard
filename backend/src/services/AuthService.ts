import { User } from '@/models/User';
import { db } from '@/db/index';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export class AuthService {
  constructor(private secretKey: string) {}

  async login(email: string, password: string): Promise<{ token: string }> {
    // 1) find user by email
    const user = await db.findUserByEmail(email);
    if (!user) {
      throw new Error('Invalid credentials');
    }

    // 2) compare password
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      throw new Error('Invalid credentials');
    }

    // 3) generate token
    const token = jwt.sign({ userId: user.id }, this.secretKey, {
      expiresIn: '1m'
    });

    return { token };
  }
}