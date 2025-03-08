export interface SKU {
  id: string;
  name: string;
  description: string;
  price: number;
  cost: number;
  category: string;
  status: 'active' | 'inactive';
  storeId: string;
  quantity: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSKUDto {
  name: string;
  description: string;
  price: number;
  cost: number;
  category: string;
  status: 'active' | 'inactive';
  storeId: string;
  quantity: number;
}

export interface UpdateSKUDto extends Partial<CreateSKUDto> {}

export interface SKUsState {
  skus: SKU[];
  loading: boolean;
  error: string | null;
}
