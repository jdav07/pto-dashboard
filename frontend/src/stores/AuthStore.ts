import { makeAutoObservable } from 'mobx';
import { RootStore } from './RootStore';
import { api } from '@/lib/api';

export class AuthStore {
  token: string | null = localStorage.getItem('token');
  userEmail: string | null = localStorage.getItem('userEmail');
  loading = false;
  error: string | null = null;
 
  constructor(private rootStore: RootStore) {
    makeAutoObservable(this);
  }
 
  setToken(token: string | null) {
    this.token = token;
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
      localStorage.removeItem('userEmail');
      this.userEmail = null;
    }
  }
 
  setUserEmail(email: string | null) {
    this.userEmail = email;
    if (email) {
      localStorage.setItem('userEmail', email);
    } else {
      localStorage.removeItem('userEmail');
    }
  }
 
  logout() {
    this.setToken(null);
    this.setUserEmail(null);
    this.rootStore.ptoStore.reset();
  }

  get isAuthenticated() {
    return !!this.token;
  }

  async login(email: string, password: string) {
    this.loading = true;
    this.error = null;
    
    try {
      const response = await api.post('/auth/login', { email, password });
      this.setToken(response.data.token);
      this.setUserEmail(email);
      return true;
    } catch (err: any) {
      this.error = err.response?.data?.error || 'Login failed';
      return false;
    } finally {
      this.loading = false;
    }
  }
 }