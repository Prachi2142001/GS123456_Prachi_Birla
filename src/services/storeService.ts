import { v4 as uuidv4 } from 'uuid';
import { Store, StoreType, StoreStatus } from '../types/store';

class StoreService {
  private readonly STORAGE_KEY = 'stores';

  constructor() {
    // Initialize with sample data if empty
    if (!this.getStoresFromStorage().length) {
      const sampleStores: Store[] = [
        {
          id: '1',
          name: 'Main Street Store',
          location: 'Downtown',
          type: 'retail',
          status: 'active',
          manager: 'John Doe',
          contact: '555-0123',
          email: 'john.doe@gsynergy.com',
          phone: '(212) 555-0123',
          address: '123 Main St',
          city: 'New York',
          state: 'NY',
          zip: '10001',
          order: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: '2',
          name: 'Express Hub',
          location: 'Midtown',
          type: 'express',
          status: 'active',
          manager: 'Jane Smith',
          contact: '555-0124',
          email: 'jane.smith@gsynergy.com',
          phone: '(212) 555-0124',
          address: '456 Market St',
          city: 'New York',
          state: 'NY',
          zip: '10002',
          order: 1,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: '3',
          name: 'Distribution Center',
          location: 'Industrial Park',
          type: 'warehouse',
          status: 'active',
          manager: 'Bob Wilson',
          contact: '555-0125',
          email: 'bob.wilson@gsynergy.com',
          phone: '(212) 555-0125',
          address: '789 Warehouse Ave',
          city: 'New York',
          state: 'NY',
          zip: '10003',
          order: 2,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ];
      this.saveStoresToStorage(sampleStores);
    }
  }

  private getStoresFromStorage(): Store[] {
    const storesJson = localStorage.getItem(this.STORAGE_KEY);
    return storesJson ? JSON.parse(storesJson) : [];
  }

  private saveStoresToStorage(stores: Store[]): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(stores));
  }

  async getStores(): Promise<Store[]> {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      const stores = this.getStoresFromStorage();
      return stores.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    } catch (error) {
      console.error('Error fetching stores:', error);
      throw new Error('Failed to fetch stores');
    }
  }

  async createStore(storeData: Omit<Store, 'id' | 'createdAt' | 'updatedAt'>): Promise<Store[]> {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const stores = this.getStoresFromStorage();
      const maxOrder = stores.reduce((max, store) => Math.max(max, store.order ?? 0), -1);
      
      const timestamp = new Date().toISOString();
      const newStore: Store = {
        ...storeData,
        id: uuidv4(),
        order: maxOrder + 1,
        createdAt: timestamp,
        updatedAt: timestamp
      };

      stores.push(newStore);
      this.saveStoresToStorage(stores);

      return this.getStores();
    } catch (error) {
      console.error('Error creating store:', error);
      throw new Error('Failed to create store');
    }
  }

  async updateStore(id: string, storeData: Partial<Store>): Promise<Store[]> {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));

      const stores = this.getStoresFromStorage();
      const storeIndex = stores.findIndex(store => store.id === id);

      if (storeIndex === -1) {
        throw new Error('Store not found');
      }

      const timestamp = new Date().toISOString();
      stores[storeIndex] = {
        ...stores[storeIndex],
        ...storeData,
        updatedAt: timestamp
      };

      this.saveStoresToStorage(stores);
      return this.getStores();
    } catch (error) {
      console.error('Error updating store:', error);
      throw new Error('Failed to update store');
    }
  }

  async deleteStore(id: string): Promise<Store[]> {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));

      const stores = this.getStoresFromStorage();
      const storeIndex = stores.findIndex(store => store.id === id);

      if (storeIndex === -1) {
        throw new Error('Store not found');
      }

      const deletedOrder = stores[storeIndex].order;
      stores.splice(storeIndex, 1);

      // Update order of remaining stores
      if (typeof deletedOrder === 'number') {
        stores.forEach(store => {
          if ((store.order ?? 0) > deletedOrder) {
            store.order = (store.order ?? 0) - 1;
          }
        });
      }

      this.saveStoresToStorage(stores);
      return this.getStores();
    } catch (error) {
      console.error('Error deleting store:', error);
      throw new Error('Failed to delete store');
    }
  }

  async reorderStore(id: string, newPosition: number): Promise<Store[]> {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));

      const stores = this.getStoresFromStorage();
      const storeIndex = stores.findIndex(store => store.id === id);

      if (storeIndex === -1) {
        throw new Error('Store not found');
      }

      const store = stores[storeIndex];
      const oldOrder = store.order ?? 0;
      const newOrder = Math.max(0, Math.min(newPosition, stores.length - 1));

      // Update orders
      if (oldOrder < newOrder) {
        stores.forEach(s => {
          const currentOrder = s.order ?? 0;
          if (currentOrder > oldOrder && currentOrder <= newOrder) {
            s.order = currentOrder - 1;
          }
        });
      } else {
        stores.forEach(s => {
          const currentOrder = s.order ?? 0;
          if (currentOrder >= newOrder && currentOrder < oldOrder) {
            s.order = currentOrder + 1;
          }
        });
      }

      store.order = newOrder;
      store.updatedAt = new Date().toISOString();

      this.saveStoresToStorage(stores);
      return stores.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    } catch (error) {
      console.error('Error reordering stores:', error);
      throw new Error('Failed to reorder stores');
    }
  }
}

export const storeService = new StoreService();
