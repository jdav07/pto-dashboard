// src/viewModels/PTO/DashboardViewModel.ts
import { makeAutoObservable } from 'mobx';
import { PTOStore, PtoRequest } from '@/stores/PTOStore';

interface BalanceCard {
  title: string;
  description: string;
  value: number;
}

export class DashboardViewModel {
  constructor(private ptoStore: PTOStore) {
    makeAutoObservable(this);
  }

  get balanceCards(): BalanceCard[] {
    if (!this.ptoStore.balance) return [];
    return [
      {
        title: 'Max Hours',
        description: 'Allotted PTO Hours',
        value: this.ptoStore.balance.maxHours
      },
      {
        title: 'Used Hours',
        description: 'How many used so far',
        value: this.ptoStore.balance.usedHours
      },
      {
        title: 'Remaining',
        description: 'Remaining PTO Hours',
        value: this.ptoStore.balance.remainingHours
      }
    ];
  }

  // Sort requests by date desc
  get sortedRequests(): PtoRequest[] {
    return [...this.ptoStore.requests].sort(
      (a, b) => new Date(b.requestDate).getTime() - new Date(a.requestDate).getTime()
    );
  }

  get isLoading(): boolean {
    return this.ptoStore.loading;
  }

  get error(): string | null {
    return this.ptoStore.error;
  }

  clearError() {
    this.ptoStore.clearError();
  }

  getBadgeVariant(status?: string): 'secondary' | 'default' | 'destructive' | 'outline' {
    switch (status) {
      case 'pending':
        return 'secondary';
      case 'approved':
        return 'default';
      case 'denied':
        return 'destructive';
      default:
        return 'outline';
    }
  }

  async loadData() {
    try {
      await Promise.all([
        this.ptoStore.fetchBalance(),
        this.ptoStore.fetchRequests()
      ]);
    } catch (error) {
      console.error('Failed to load dashboard data', error);
    }
  }
}
