export type StoreType = 'retail' | 'warehouse' | 'outlet';
export type StoreStatus = 'active' | 'inactive';

export interface Store {
  id: string;
  name: string;
  location: string;
  manager: string;
  contact: string;
  type: StoreType;
  status: StoreStatus;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  order: number;
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
