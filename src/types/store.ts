export interface Store {
    id: string;
    name: string;
    location: string;
    manager: string;
    contact: string;
    email: string;
    type: 'retail' | 'warehouse' | 'outlet';
    status: 'active' | 'inactive';
    order: number;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    phone: string;
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
        status?: 'active' | 'inactive';
        type?: 'retail' | 'warehouse' | 'outlet';
        searchTerm?: string;
    };
    sorting: {
        field: keyof Store;
        direction: 'asc' | 'desc';
    };
}
