export interface User {
  id: number;
  email: string;
  password: string; // hashed
  maxPtoHours: number;
  usedPtoHours: number;
}

export interface PtoRequest {
  id?: number;
  userId: number;
  requestDate: string; // or Date
  hours: number;
  reason: string;
}
