import sqlite3 from "sqlite3";
import { open } from "sqlite";
import bcrypt from "bcrypt";

export async function initDB() {
  const dbPath =
    process.env.NODE_ENV === "production"
      ? process.env.RAILWAY_VOLUME_MOUNT_PATH + "/pto.db"
      : "./data/pto.db";

  const db = await open({
    filename: dbPath,
    driver: sqlite3.Database,
  });

  // Create Users table
  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE,
      password TEXT,
      maxPtoHours INTEGER,
      usedPtoHours INTEGER
    )
  `);

  // Create PTO Requests table
  await db.exec(`
    CREATE TABLE IF NOT EXISTS pto_requests (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER,
      requestDate TEXT,
      hours INTEGER,
      reason TEXT,
      status TEXT DEFAULT 'pending'
    )
  `);

  // Seed only if no users exist
  const existingUsers = await db.all(`SELECT * FROM users`);
  if (existingUsers.length === 0) {
    const saltRounds = 10;

    const hashedJohn = await bcrypt.hash("password", saltRounds);
    const hashedJane = await bcrypt.hash("mypassword", saltRounds);

    // Insert users
    const johnId = (
      await db.run(
        `
        INSERT INTO users (email, password, maxPtoHours, usedPtoHours)
        VALUES ('john@example.com', '${hashedJohn}', 120, 0)
      `
      )
    ).lastID;

    const janeId = (
      await db.run(
        `
        INSERT INTO users (email, password, maxPtoHours, usedPtoHours)
        VALUES ('jane@example.com', '${hashedJane}', 120, 0)
      `
      )
    ).lastID;

    // Insert PTO requests for John (Total approved: 40 hours)
    await db.run(`
      INSERT INTO pto_requests (userId, requestDate, hours, reason, status)
      VALUES (${johnId}, '01/10/2025', 16, 'Vacation', 'approved')
    `);
    await db.run(`
      INSERT INTO pto_requests (userId, requestDate, hours, reason, status)
      VALUES (${johnId}, '01/15/2025', 24, 'Family Event', 'approved')
    `);
    await db.run(`
      INSERT INTO pto_requests (userId, requestDate, hours, reason, status)
      VALUES (${johnId}, '01/20/2025', 8, 'Doctor Appointment', 'pending')
    `);

    // Update used PTO hours for John
    await db.run(`
      UPDATE users SET usedPtoHours = 48 WHERE id = ${johnId}
    `);

    // Insert PTO requests for Jane (Total approved: 32 hours)
    await db.run(`
      INSERT INTO pto_requests (userId, requestDate, hours, reason, status)
      VALUES (${janeId}, '01/05/2025', 8, 'Vacation', 'approved')
    `);
    await db.run(`
      INSERT INTO pto_requests (userId, requestDate, hours, reason, status)
      VALUES (${janeId}, '01/08/2025', 16, 'Personal Time', 'approved')
    `);
    await db.run(`
      INSERT INTO pto_requests (userId, requestDate, hours, reason, status)
      VALUES (${janeId}, '01/12/2025', 8, 'Doctor Appointment', 'approved')
    `);
    await db.run(`
      INSERT INTO pto_requests (userId, requestDate, hours, reason, status)
      VALUES (${janeId}, '01/18/2025', 8, 'Errands', 'pending')
    `);

    // Update used PTO hours for Jane
    await db.run(`
      UPDATE users SET usedPtoHours = 40 WHERE id = ${janeId}
    `);
    
  }

  return db;
}