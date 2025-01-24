// backend/src/db.ts
import sqlite3 from "sqlite3"
import { open } from "sqlite"
import bcrypt from "bcrypt"

export async function initDB() {
  const db = await open({
    filename: "./pto.db",
    driver: sqlite3.Database,
  })

  // Create Users table
  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE,
      password TEXT,
      maxPtoHours INTEGER,
      usedPtoHours INTEGER
    )
  `)

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
  `)

  // Seed only if no users exist
  const existingUsers = await db.all(`SELECT * FROM users`)
  if (existingUsers.length === 0) {
    const saltRounds = 10

    const hashedJohn = await bcrypt.hash("password123", saltRounds)
    const hashedJane = await bcrypt.hash("mypassword", saltRounds)

    await db.run(`
      INSERT INTO users (email, password, maxPtoHours, usedPtoHours)
      VALUES ('john@example.com', '${hashedJohn}', 120, 40)
    `)

    await db.run(`
      INSERT INTO users (email, password, maxPtoHours, usedPtoHours)
      VALUES ('jane@example.com', '${hashedJane}', 80, 10)
    `)
  }

  return db
}