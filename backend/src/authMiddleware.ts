// src/authMiddleware.ts

import { Context, Next } from "koa"
import jwt from "jsonwebtoken"

const possibleSecret = process.env.JWT_SECRET_KEY
if (!possibleSecret) {
  throw new Error("No JWT_SECRET_KEY provided! Please set it in your environment.")
}

const SECRET_KEY: string = possibleSecret

interface UserIdJwtPayload {
  userId: number
}

export async function authMiddleware(ctx: Context, next: Next) {
  // 1. Check for Authorization header
  const authHeader = ctx.headers["authorization"]
  if (!authHeader) {
    ctx.status = 401
    ctx.body = { error: "Missing Authorization header" }
    return
  }

  // 2. Extract token
  const token = authHeader.replace("Bearer ", "")

  try {
    // 3. Verify token. The return type can be `string | object`.
    const rawResult = jwt.verify(token, SECRET_KEY)

    // 4. If the result is a string, we consider it invalid for our use case:
    if (typeof rawResult === "string") {
      ctx.status = 401
      ctx.body = { error: "Invalid token: got string instead of object" }
      return
    }

    // 5. Check if userId exists in the payload
    if (!("userId" in rawResult)) {
      ctx.status = 401
      ctx.body = { error: "Invalid token payload: no userId found" }
      return
    }

    // 6. Now TS is satisfied that `rawResult` has a userId field
    const decoded = rawResult as UserIdJwtPayload

    // 7. Attach the userId to ctx.state for downstream
    ctx.state.userId = decoded.userId

    await next()
  } catch (error) {
    ctx.status = 401
    ctx.body = { error: "Invalid token" }
  }
}
