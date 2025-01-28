// src/viewModels/Auth/LoginViewModel.ts
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
      const success = await this.authStore.login(email, password);
      if (success) {
        this.authStore.clearError();
      } else {
        this.error = this.authStore.error;
      }
      return success;
    } catch (err: any) {
      // Fallback if something throws unexpectedly
      this.error = err.message || 'Login error';
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
