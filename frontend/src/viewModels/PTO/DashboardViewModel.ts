import { makeAutoObservable } from 'mobx';
import { PTOStore, PtoRequest } from '@/stores/PTOStore';

// Interface for our transformed balance card data
interface BalanceCard {
  title: string;
  description: string;
  value: number;
}

export class DashboardViewModel {
  constructor(private ptoStore: PTOStore) {
    // Make this class observable so React components can react to its changes
    makeAutoObservable(this);
  }

  // Transform the raw balance data into a format suitable for our card components
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

  // Sort requests by date in descending order
  get sortedRequests(): PtoRequest[] {
    return [...this.ptoStore.requests].sort(
      (a, b) => new Date(b.requestDate).getTime() - new Date(a.requestDate).getTime()
    );
  }

  // Computed properties for loading and error states
  get isLoading(): boolean {
    return this.ptoStore.loading;
  }

  get error(): string | null {
    return this.ptoStore.error;
  }

  // Method to determine badge variant based on status
  getBadgeVariant(status?: string): "secondary" | "default" | "destructive" | "outline" {
    switch (status) {
      case "pending":
        return "secondary";
      case "approved":
        return "default";
      case "denied":
        return "destructive";
      default:
        return "outline";
    }
  }

  // Method to load initial data
  async loadData() {
    try {
      await Promise.all([
        this.ptoStore.fetchBalance(),
        this.ptoStore.fetchRequests()
      ]);
    } catch (error) {
      // Error handling is already done in the store
      console.error('Failed to load dashboard data');
    }
  }
}