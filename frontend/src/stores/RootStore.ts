// src/stores/RootStore.ts
import { PTOStore } from './PTOStore';
import { AuthStore } from './AuthStore';

export class RootStore {
  ptoStore: PTOStore;
  authStore: AuthStore;

  constructor() {
    // Initialize stores and inject dependencies
    this.authStore = new AuthStore(this);
    this.ptoStore = new PTOStore(this);
  }
}


// Create a single instance of the root store
export const rootStore = new RootStore();