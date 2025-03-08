import { Store, StoreType, StoreStatus } from '../types/store';
import { SKU, SKUStatus } from '../types/sku';
import { PlanningGridRow } from '../types/planning';

export const sampleStores: Store[] = [
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

export const sampleSKUs: SKU[] = [
  {
    id: '1',
    name: 'Premium Coffee',
    description: 'High-quality Arabica coffee beans',
    category: 'Beverages',
    price: 19.99,
    cost: 12.50,
    storeId: '1',
    quantity: 100,
    status: 'active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '2',
    name: 'Organic Tea',
    description: 'Assorted organic tea collection',
    category: 'Beverages',
    price: 14.99,
    cost: 8.75,
    storeId: '1',
    quantity: 150,
    status: 'active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '3',
    name: 'Fresh Bread',
    description: 'Artisanal sourdough bread',
    category: 'Bakery',
    price: 5.99,
    cost: 2.50,
    storeId: '2',
    quantity: 50,
    status: 'active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '4',
    name: 'Chocolate Bar',
    description: 'Premium dark chocolate',
    category: 'Confectionery',
    price: 4.99,
    cost: 2.25,
    storeId: '2',
    quantity: 200,
    status: 'active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '5',
    name: 'Fresh Milk',
    description: 'Organic whole milk',
    category: 'Dairy',
    price: 3.99,
    cost: 2.00,
    storeId: '3',
    quantity: 75,
    status: 'active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export const samplePlanningData: PlanningGridRow[] = sampleStores.flatMap(store =>
  sampleSKUs.filter(sku => sku.storeId === store.id).map(sku => ({
    id: `${store.id}-${sku.id}`,
    storeId: store.id,
    store: store.name,
    skuId: sku.id,
    sku: sku.name,
    category: sku.category,
    price: sku.price,
    cost: sku.cost,
    quantity: sku.quantity,
    week: new Date().toISOString().split('T')[0],
    units: Math.floor(Math.random() * 50),
    salesUnits: Math.floor(Math.random() * 50),
    salesDollars: 0,
    gmDollars: 0,
    gmPercentage: 0,
    currentStock: Math.floor(Math.random() * 100),
    requiredStock: Math.floor(Math.random() * 100),
    difference: 0
  }))
).map(row => ({
  ...row,
  salesDollars: row.units * row.price,
  gmDollars: row.units * (row.price - row.cost),
  gmPercentage: ((row.price - row.cost) / row.price) * 100,
  difference: row.requiredStock - row.currentStock
}));
