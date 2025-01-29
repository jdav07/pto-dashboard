// src/viewModels/PTO/NewRequestViewModel.ts
import { makeAutoObservable } from 'mobx';
import { PTOStore } from '@/stores/PTOStore';
import { parse, isValid, isBefore, endOfYesterday } from 'date-fns';

export class NewRequestViewModel {
  private ptoStore: PTOStore;

  public loading: boolean = false;

  constructor(ptoStore: PTOStore) {
    this.ptoStore = ptoStore;
    makeAutoObservable(this);
  }

  public parseDateString(dateStr: string): Date | undefined {
    if (!dateStr) return undefined;
    const parsed = parse(dateStr, 'MM/dd/yyyy', new Date());
    return isValid(parsed) ? parsed : undefined;
  }

  public isDateDisabled(date: Date): boolean {
    return isBefore(date, endOfYesterday());
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

  public async submitPtoRequest(
    requestDate: string,
    hours: number,
    reason: string
  ): Promise<void> {
    this.loading = true;
    try {
      await this.ptoStore.submitRequest(requestDate, hours, reason);
    } finally {
      this.loading = false;
    }
  }
}