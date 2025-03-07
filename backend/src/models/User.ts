// src/models/User.ts
export interface User {
    id: number;
    email: string;
    password: string;
    maxPtoHours: number;
    usedPtoHours: number;
}