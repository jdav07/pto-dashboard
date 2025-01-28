// viewModels/Auth/LoginViewModel.ts
import { makeAutoObservable } from 'mobx';
import { AuthStore } from '@/stores/AuthStore';

export class LoginViewModel {
  username: string = '';
  password: string = '';
  loading: boolean = false;
  error: string | null = null;

  constructor(private authStore: AuthStore) {
    makeAutoObservable(this);
  }

  setUsername(username: string) {
    this.username = username;
  }

  setPassword(password: string) {
    this.password = password;
  }

  async login(email: string, password: string): Promise<boolean> {
    this.loading = true;
    this.error = null;

    try {
      return await this.authStore.login(email, password);
    } catch (err: any) {
      this.error = err.message;
      return false;
    } finally {
      this.loading = false;
    }
  }

  validateForm(): { valid: boolean; errors: Record<string, string> } {
    const errors: Record<string, string> = {};

    if (!this.username.trim()) {
      errors.username = 'Username is required';
    }

    if (!this.password) {
      errors.password = 'Password is required';
    }

    return {
      valid: Object.keys(errors).length === 0,
      errors
    };
  }
}