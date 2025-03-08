export type SKUStatus = 'active' | 'inactive';

export interface SKU {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  cost: number;
  storeId: string;
  quantity: number;
  status: SKUStatus;
  createdAt?: string;
  updatedAt?: string;
}

export type CreateSKUDto = Omit<SKU, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateSKUDto = SKU;

export interface SKUsState {
  skus: SKU[];
  loading: boolean;
  error: string | null;
  selectedSKU: SKU | null;
  filters: {
    category?: string;
    status?: SKUStatus;
    searchTerm?: string;
  };
  sorting: {
    field: keyof SKU;
    direction: 'asc' | 'desc';
  };
}
