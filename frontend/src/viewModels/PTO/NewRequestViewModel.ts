import { makeAutoObservable } from 'mobx';
import { PTOStore } from '@/stores/PTOStore';
import { parse, isValid, isBefore, endOfYesterday } from 'date-fns';

export class NewRequestViewModel {
  private ptoStore: PTOStore;

  constructor(ptoStore: PTOStore) {
    this.ptoStore = ptoStore;
    makeAutoObservable(this);
  }

  public async submitPtoRequest(requestDate: string, hours: number, reason: string) {
    return this.ptoStore.submitRequest(requestDate, hours, reason);
  }

  public validateForm(requestDate: string, hours: number, reason: string) {
    const errors: Record<string, string> = {};

    if (!requestDate) {
      errors.requestDate = 'Please select a date';
    }
    if (hours < 1) {
      errors.hours = 'Hours must be at least 1';
    }
    if (!reason.trim()) {
      errors.reason = 'Reason is required';
    }

    return {
      valid: Object.keys(errors).length === 0,
      errors,
    };
  }

  public parseDateString(dateStr: string): Date | undefined {
    if (!dateStr) return undefined;
    const parsed = parse(dateStr, 'MM/dd/yyyy', new Date());
    return isValid(parsed) ? parsed : undefined;
  }

  public isDateDisabled(date: Date): boolean {
    return isBefore(date, endOfYesterday());
  }
}