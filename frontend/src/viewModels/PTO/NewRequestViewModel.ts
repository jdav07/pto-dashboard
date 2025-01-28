import { makeAutoObservable } from 'mobx';
import { PTOStore } from '@/stores/PTOStore';
import { parse, isValid, isBefore, endOfYesterday } from 'date-fns';

export class NewRequestViewModel {
  requestDate: string = '';
  hours: number = 0;
  reason: string = '';
  loading: boolean = false;
  error: string | null = null;

  constructor(private ptoStore: PTOStore) {
    makeAutoObservable(this);
  }

  // Form field setters
  setRequestDate(date: string) {
    this.requestDate = date;
  }

  setHours(hours: number) {
    this.hours = hours;
  }

  setReason(reason: string) {
    this.reason = reason;
  }

  // Helper method to parse date strings
  parseDateString(dateStr: string): Date | undefined {
    if (!dateStr) return undefined;
    const parsed = parse(dateStr, 'MM/dd/yyyy', new Date());
    return isValid(parsed) ? parsed : undefined;
  }

  // Date validation helper
  isDateDisabled(date: Date): boolean {
    return isBefore(date, endOfYesterday());
  }

  // Form submission handler
  async submitRequest(): Promise<boolean> {
    this.loading = true;
    this.error = null;

    try {
      await this.ptoStore.submitRequest(
        this.requestDate,
        this.hours,
        this.reason
      );
      return true;
    } catch (err: any) {
      this.error = err.message;
      return false;
    } finally {
      this.loading = false;
    }
  }

  // Form validation
  validateForm(): { valid: boolean; errors: Record<string, string> } {
    const errors: Record<string, string> = {};

    if (!this.requestDate) {
      errors.requestDate = 'Please select a date';
    }

    if (this.hours < 1) {
      errors.hours = 'Hours must be at least 1';
    }

    if (!this.reason.trim()) {
      errors.reason = 'Reason is required';
    }

    return {
      valid: Object.keys(errors).length === 0,
      errors
    };
  }
}