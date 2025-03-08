import { Store } from '../types/store';
import { SKU } from '../types/sku';
import { storeService } from './storeService';
import { skuService } from './skuService';

class ChartService {
  async getStoreMetrics() {
    try {
      const stores = await storeService.getAllStores();
      const skus = await skuService.getAllSKUs();

      return stores.map(store => {
        const storeSKUs = skus.filter(sku => sku.storeId === store.id);
        const totalValue = storeSKUs.reduce((sum, sku) => sum + (sku.price * sku.quantity), 0);

        return {
          storeName: store.name,
          totalSKUs: storeSKUs.length,
          totalValue,
        };
      });
    } catch (error) {
      console.error('Error fetching store metrics:', error);
      throw new Error('Failed to fetch store metrics');
    }
  }

  async getSKUMetrics() {
    try {
      const skus = await skuService.getAllSKUs();
      const categorySet = new Set(skus.map(sku => sku.category));
      const categories = Array.from(categorySet);

      return categories.map(category => {
        const categorySkus = skus.filter(sku => sku.category === category);
        const totalPrice = categorySkus.reduce((sum, sku) => sum + sku.price, 0);

        return {
          category,
          count: categorySkus.length,
          averagePrice: totalPrice / categorySkus.length,
        };
      });
    } catch (error) {
      console.error('Error fetching SKU metrics:', error);
      throw new Error('Failed to fetch SKU metrics');
    }
  }
}

export const chartService = new ChartService();
