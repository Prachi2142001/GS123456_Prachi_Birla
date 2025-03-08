import { RootState } from '../store/store';

export interface StoreMetric {
  storeName: string;
  totalSKUs: number;
  totalValue: number;
}

export interface SKUMetric {
  category: string;
  count: number;
  averagePrice: number;
}

export const chartService = {
  getStoreMetrics: (state: RootState): StoreMetric[] => {
    const stores = state.stores.stores;
    const skus = state.skus.skus;

    return stores.map(store => {
      const storeSKUs = skus.filter(sku => sku.storeId === store.id);
      const totalValue = storeSKUs.reduce((sum, sku) => sum + (sku.price * sku.quantity), 0);

      return {
        storeName: store.name,
        totalSKUs: storeSKUs.length,
        totalValue
      };
    });
  },

  getSKUMetrics: (state: RootState): SKUMetric[] => {
    const skus = state.skus.skus;
    const categories = Array.from(new Set(skus.map(sku => sku.category)));

    return categories.map(category => {
      const categorySkus = skus.filter(sku => sku.category === category);
      const totalPrice = categorySkus.reduce((sum, sku) => sum + sku.price, 0);

      return {
        category,
        count: categorySkus.length,
        averagePrice: totalPrice / categorySkus.length
      };
    });
  }
};
