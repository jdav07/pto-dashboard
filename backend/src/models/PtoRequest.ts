// src/models/PtoRequest.ts
export interface PtoRequest {
    id: number;
    userId: number;
    requestDate: string;
    hours: number;
    reason: string;
    status?: string;
}