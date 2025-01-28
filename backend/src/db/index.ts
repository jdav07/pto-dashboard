import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';
import bcrypt from 'bcrypt';
import { User } from '@/models/User';
import { PtoRequest } from '@/models/PtoRequest';

let dbInstance: Database<sqlite3.Database, sqlite3.Statement>;

async function initDB() {
  if (!dbInstance) {
    // If in production, store in RAILWAY_VOLUME_MOUNT_PATH + "/pto.db"
    // else store in local "./data/pto.db".
    const dbPath = process.env.NODE_ENV === 'production'
      ? process.env.RAILWAY_VOLUME_MOUNT_PATH + '/pto.db'
      : './data/pto.db';

    dbInstance = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });

    // Create tables if they don’t exist
    await dbInstance.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE,
        password TEXT,
        maxPtoHours INTEGER,
        usedPtoHours INTEGER
      )
    `);

    await dbInstance.exec(`
      CREATE TABLE IF NOT EXISTS pto_requests (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        userId INTEGER,
        requestDate TEXT,
        hours INTEGER,
        reason TEXT,
        status TEXT DEFAULT 'pending'
      )
    `);

    // Check if any users exist; if none, seed data
    const existingUsers = await dbInstance.all(`SELECT * FROM users`);
    if (existingUsers.length === 0) {
      const saltRounds = 10;

      // Create two user accounts: John and Jane
      const hashedJohn = await bcrypt.hash('password', saltRounds);
      const hashedJane = await bcrypt.hash('mypassword', saltRounds);

      // Insert John
      const johnId = (await dbInstance.run(`
        INSERT INTO users (email, password, maxPtoHours, usedPtoHours)
        VALUES ('john@example.com', '${hashedJohn}', 120, 0)
      `)).lastID;

      // Insert Jane
      const janeId = (await dbInstance.run(`
        INSERT INTO users (email, password, maxPtoHours, usedPtoHours)
        VALUES ('jane@example.com', '${hashedJane}', 120, 0)
      `)).lastID;

      // --- PTO requests for John
      await dbInstance.run(`
        INSERT INTO pto_requests (userId, requestDate, hours, reason, status)
        VALUES (${johnId}, '01/10/2025', 16, 'Vacation', 'approved')
      `);
      await dbInstance.run(`
        INSERT INTO pto_requests (userId, requestDate, hours, reason, status)
        VALUES (${johnId}, '01/15/2025', 24, 'Family Event', 'approved')
      `);
      await dbInstance.run(`
        INSERT INTO pto_requests (userId, requestDate, hours, reason, status)
        VALUES (${johnId}, '01/20/2025', 8, 'Doctor Appointment', 'pending')
      `);

      // Update John’s used hours
      await dbInstance.run(`
        UPDATE users SET usedPtoHours = 48 WHERE id = ${johnId}
      `);

      // --- PTO requests for Jane
      await dbInstance.run(`
        INSERT INTO pto_requests (userId, requestDate, hours, reason, status)
        VALUES (${janeId}, '01/05/2025', 8, 'Vacation', 'approved')
      `);
      await dbInstance.run(`
        INSERT INTO pto_requests (userId, requestDate, hours, reason, status)
        VALUES (${janeId}, '01/08/2025', 16, 'Personal Time', 'approved')
      `);
      await dbInstance.run(`
        INSERT INTO pto_requests (userId, requestDate, hours, reason, status)
        VALUES (${janeId}, '01/12/2025', 8, 'Doctor Appointment', 'approved')
      `);
      await dbInstance.run(`
        INSERT INTO pto_requests (userId, requestDate, hours, reason, status)
        VALUES (${janeId}, '01/18/2025', 8, 'Errands', 'pending')
      `);

      // Update Jane’s used hours
      await dbInstance.run(`
        UPDATE users SET usedPtoHours = 40 WHERE id = ${janeId}
      `);
    }
  }
  return dbInstance;
}

export const db = {
  // Called in server.ts to ensure DB is ready before listening
  async connect() {
    return initDB();
  },

  async findUserById(id: number): Promise<User | null> {
    const db = await initDB();
    const row = await db.get(`SELECT * FROM users WHERE id = ?`, [id]);
    if (!row) return null;
    return { ...row };
  },

  async findUserByEmail(email: string): Promise<User | null> {
    const db = await initDB();
    const row = await db.get(`SELECT * FROM users WHERE email = ?`, [email]);
    if (!row) return null;
    return { ...row };
  },

  async updateUser(user: User): Promise<void> {
    const db = await initDB();
    await db.run(`
      UPDATE users
      SET email = ?, password = ?, maxPtoHours = ?, usedPtoHours = ?
      WHERE id = ?
    `, [user.email, user.password, user.maxPtoHours, user.usedPtoHours, user.id]);
  },

  async getRequestsByUserId(userId: number): Promise<PtoRequest[]> {
    const db = await initDB();
    const rows = await db.all(`SELECT * FROM pto_requests WHERE userId = ?`, [userId]);
    return rows.map((r: any) => ({ ...r }));
  },

  async createPtoRequest(request: PtoRequest): Promise<void> {
    const db = await initDB();
    await db.run(`
      INSERT INTO pto_requests (userId, requestDate, hours, reason, status)
      VALUES (?, ?, ?, ?, ?)
    `, [request.userId, request.requestDate, request.hours, request.reason, request.status || 'pending']);
  }
};