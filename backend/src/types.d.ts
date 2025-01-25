export interface User {
  id: number;
  email: string;
  password: string;
  maxPtoHours: number;
  usedPtoHours: number;
}

export interface PtoRequest {
  id?: number;
  userId: number;
  requestDate: string;
  hours: number;
  reason: string;
}
