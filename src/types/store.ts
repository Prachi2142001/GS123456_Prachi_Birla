export type StoreType = 'retail' | 'express' | 'warehouse';
export type StoreStatus = 'active' | 'inactive';

export interface Store {
  id: string;
  name: string;
  location: string;
  type: StoreType;
  status: StoreStatus;
  manager?: string;
  contact?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  order?: number;
  createdAt?: string;
  updatedAt?: string;
}

export type CreateStoreDto = Omit<Store, 'id' | 'createdAt' | 'updatedAt'>;

export type UpdateStoreDto = Store;

export interface StoresState {
  stores: Store[];
  loading: boolean;
  error: string | null;
  selectedStore: Store | null;
  filters: {
    status?: StoreStatus;
    type?: StoreType;
    searchTerm?: string;
  };
  sorting: {
    field: keyof Store;
    direction: 'asc' | 'desc';
  };
}
