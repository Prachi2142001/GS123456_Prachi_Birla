import { v4 as uuidv4 } from 'uuid';
import { SKU, CreateSKUDto, UpdateSKUDto } from '../types/sku';

class SKUService {
  private readonly STORAGE_KEY = 'gsynergy_skus_v1';

  constructor() {
    // Initialize with sample data if storage is empty
    if (!localStorage.getItem(this.STORAGE_KEY)) {
      const sampleSKUs: SKU[] = [
        {
          id: uuidv4(),
          name: 'Basic T-Shirt',
          description: 'Cotton crew neck t-shirt',
          price: 19.99,
          cost: 8.50,
          category: 'Apparel',
          status: 'active',
          storeId: 'store1',
          quantity: 100,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: uuidv4(),
          name: 'Premium Jeans',
          description: 'High-quality denim jeans',
          price: 79.99,
          cost: 35.00,
          category: 'Apparel',
          status: 'active',
          storeId: 'store1',
          quantity: 50,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: uuidv4(),
          name: 'Running Shoes',
          description: 'Athletic running shoes',
          price: 129.99,
          cost: 55.00,
          category: 'Footwear',
          status: 'active',
          storeId: 'store2',
          quantity: 75,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];
      this.saveSKUsToStorage(sampleSKUs);
    }
  }

  private getSKUsFromStorage(): SKU[] {
    try {
      const skus = localStorage.getItem(this.STORAGE_KEY);
      return skus ? JSON.parse(skus) : [];
    } catch (error) {
      console.error('Error reading SKUs from localStorage:', error);
      return [];
    }
  }

  private saveSKUsToStorage(skus: SKU[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(skus));
    } catch (error) {
      console.error('Error saving SKUs to localStorage:', error);
      throw new Error('Failed to save SKUs data');
    }
  }

  async getAllSKUs(): Promise<SKU[]> {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      const skus = this.getSKUsFromStorage();
      return skus.sort((a, b) => a.name.localeCompare(b.name));
    } catch (error) {
      console.error('Error fetching SKUs:', error);
      throw new Error('Failed to fetch SKUs');
    }
  }

  async createSKU(skuData: CreateSKUDto): Promise<SKU> {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const skus = this.getSKUsFromStorage();
      
      const newSKU: SKU = {
        id: uuidv4(),
        ...skuData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      skus.push(newSKU);
      this.saveSKUsToStorage(skus);
      return newSKU;
    } catch (error) {
      console.error('Error creating SKU:', error);
      throw new Error('Failed to create SKU');
    }
  }

  async updateSKU(id: string, skuData: UpdateSKUDto): Promise<SKU | undefined> {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));

      const skus = this.getSKUsFromStorage();
      const index = skus.findIndex(sku => sku.id === id);

      if (index === -1) {
        throw new Error('SKU not found');
      }

      const existingSKU = skus[index];
      const updatedSKU: SKU = {
        ...existingSKU,
        ...skuData,
        id: existingSKU.id,
        updatedAt: new Date().toISOString(),
      };

      skus[index] = updatedSKU;
      this.saveSKUsToStorage(skus);
      return updatedSKU;
    } catch (error) {
      console.error('Error updating SKU:', error);
      throw new Error('Failed to update SKU');
    }
  }

  async deleteSKU(id: string): Promise<void> {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));

      const skus = this.getSKUsFromStorage();
      const index = skus.findIndex(sku => sku.id === id);

      if (index === -1) {
        throw new Error('SKU not found');
      }

      skus.splice(index, 1);
      this.saveSKUsToStorage(skus);
    } catch (error) {
      console.error('Error deleting SKU:', error);
      throw new Error('Failed to delete SKU');
    }
  }
}

export const skuService = new SKUService();
