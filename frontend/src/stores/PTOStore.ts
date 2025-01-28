// stores/PTOStore.ts
import { makeAutoObservable } from 'mobx';
import { RootStore } from './RootStore';
import { api } from '@/lib/api';

export interface PtoBalance {
  maxHours: number;
  usedHours: number;
  remainingHours: number;
}

export interface PtoRequest {
  id: number;
  userId: number;
  requestDate: string;
  hours: number;
  reason: string;
  status?: string;
}

export class PTOStore {
  balance: PtoBalance | null = null;
  requests: PtoRequest[] = [];
  loading = false;

  constructor(private rootStore: RootStore) {
    makeAutoObservable(this);
  }

  reset() {
    this.balance = null;
    this.requests = [];
  }

  async fetchBalance() {
    if (!this.rootStore.authStore.token) return;
    this.loading = true;
    try {
      const headers = { Authorization: `Bearer ${this.rootStore.authStore.token}` };
      const response = await api.get('/pto/balance', { headers });
      this.balance = response.data;
    } catch (err) {
      throw err;
    } finally {
      this.loading = false;
    }
  }

  async fetchRequests() {
    if (!this.rootStore.authStore.token) return;
    this.loading = true;
    try {
      const headers = { Authorization: `Bearer ${this.rootStore.authStore.token}` };
      const response = await api.get('/pto/requests', { headers });
      this.requests = response.data;
    } catch (err) {
      throw err;
    } finally {
      this.loading = false;
    }
  }

  async submitRequest(requestDate: string, hours: number, reason: string) {
    if (!this.rootStore.authStore.token) return;
    this.loading = true;
    try {
      const headers = { Authorization: `Bearer ${this.rootStore.authStore.token}` };
      await api.post('/pto/request', { requestDate, hours, reason }, { headers });
      
      // After success, refresh data
      await Promise.all([
        this.fetchBalance(),
        this.fetchRequests()
      ]);
      return true;
    } catch (err) {
      throw err;
    } finally {
      this.loading = false;
    }
  }
}
