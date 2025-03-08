import { v4 as uuidv4 } from 'uuid';
import { Store, CreateStoreDto, UpdateStoreDto } from '../types/store';

class StoreService {
  private readonly STORAGE_KEY = 'gsynergy_stores_v1';

  constructor() {
    // Initialize with some sample data if storage is empty
    if (!localStorage.getItem(this.STORAGE_KEY)) {
      const sampleStores: Store[] = [
        {
          id: uuidv4(),
          name: 'Main Store',
          location: 'New York',
          manager: 'John Doe',
          contact: '555-0123',
          email: 'john.doe@gsynergy.com',
          type: 'retail',
          status: 'active',
          order: 0,
          address: '123 Main St',
          city: 'New York',
          state: 'NY',
          zipCode: '10001',
          phone: '(212) 555-0123',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: uuidv4(),
          name: 'Downtown Outlet',
          location: 'Los Angeles',
          manager: 'Jane Smith',
          contact: '555-0124',
          email: 'jane.smith@gsynergy.com',
          type: 'outlet',
          status: 'active',
          order: 1,
          address: '456 Market St',
          city: 'Los Angeles',
          state: 'CA',
          zipCode: '90012',
          phone: '(213) 555-0124',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];
      this.saveStoresToStorage(sampleStores);
    }
  }

  private getStoresFromStorage(): Store[] {
    try {
      const stores = localStorage.getItem(this.STORAGE_KEY);
      return stores ? JSON.parse(stores) : [];
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return [];
    }
  }

  private saveStoresToStorage(stores: Store[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(stores));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
      throw new Error('Failed to save stores data');
    }
  }

  async getAllStores(): Promise<Store[]> {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      const stores = this.getStoresFromStorage();
      return stores.sort((a, b) => a.order - b.order);
    } catch (error) {
      console.error('Error fetching stores:', error);
      throw new Error('Failed to fetch stores');
    }
  }

  async createStore(storeData: CreateStoreDto): Promise<Store> {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const stores = this.getStoresFromStorage();
      const maxOrder = stores.reduce((max, store) => Math.max(max, store.order), -1);
      
      const timestamp = new Date().toISOString();
      const newStore: Store = {
        id: uuidv4(),
        ...storeData,
        order: maxOrder + 1,
        createdAt: timestamp,
        updatedAt: timestamp,
      };

      stores.push(newStore);
      this.saveStoresToStorage(stores);
      return newStore;
    } catch (error) {
      console.error('Error creating store:', error);
      throw new Error('Failed to create store');
    }
  }

  async updateStore(storeData: UpdateStoreDto): Promise<Store> {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));

      const stores = this.getStoresFromStorage();
      const index = stores.findIndex(store => store.id === storeData.id);

      if (index === -1) {
        throw new Error('Store not found');
      }

      const updatedStore: Store = {
        ...stores[index],
        ...storeData,
        updatedAt: new Date().toISOString(),
      };

      stores[index] = updatedStore;
      this.saveStoresToStorage(stores);
      return updatedStore;
    } catch (error) {
      console.error('Error updating store:', error);
      throw new Error('Failed to update store');
    }
  }

  async deleteStore(id: string): Promise<void> {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));

      const stores = this.getStoresFromStorage();
      const index = stores.findIndex(store => store.id === id);

      if (index === -1) {
        throw new Error('Store not found');
      }

      const deletedOrder = stores[index].order;
      stores.splice(index, 1);

      // Update order of remaining stores
      stores.forEach(store => {
        if (store.order > deletedOrder) {
          store.order--;
        }
      });

      this.saveStoresToStorage(stores);
    } catch (error) {
      console.error('Error deleting store:', error);
      throw new Error('Failed to delete store');
    }
  }

  async reorderStores(draggedId: string, targetId: string): Promise<Store[]> {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));

      const stores = this.getStoresFromStorage();
      const draggedStore = stores.find(store => store.id === draggedId);
      const targetStore = stores.find(store => store.id === targetId);

      if (!draggedStore || !targetStore) {
        throw new Error('Store not found');
      }

      const oldOrder = draggedStore.order;
      const newOrder = targetStore.order;

      // Update orders
      if (oldOrder < newOrder) {
        stores.forEach(store => {
          if (store.order > oldOrder && store.order <= newOrder) {
            store.order--;
          }
        });
      } else {
        stores.forEach(store => {
          if (store.order >= newOrder && store.order < oldOrder) {
            store.order++;
          }
        });
      }

      draggedStore.order = newOrder;
      draggedStore.updatedAt = new Date().toISOString();

      this.saveStoresToStorage(stores);
      return stores.sort((a, b) => a.order - b.order);
    } catch (error) {
      console.error('Error reordering stores:', error);
      throw new Error('Failed to reorder stores');
    }
  }
}

export const storeService = new StoreService();
