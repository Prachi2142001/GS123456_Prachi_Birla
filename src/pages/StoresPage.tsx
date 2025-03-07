import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { Store } from '../types';
import { addStore, updateStore, removeStore, reorderStores } from '../store/storesSlice';

const StoresPage: React.FC = () => {
  const dispatch = useDispatch();
  const { stores } = useSelector((state: RootState) => state.stores);
  const [newStore, setNewStore] = useState('');

  const handleAddStore = () => {
    if (newStore.trim()) {
      const store: Store = {
        id: Date.now().toString(),
        name: newStore.trim(),
        order: stores.length
      };
      dispatch(addStore(store));
      setNewStore('');
    }
  };

  const handleUpdateStore = (store: Store, newName: string) => {
    dispatch(updateStore({ ...store, name: newName }));
  };

  const handleRemoveStore = (id: string) => {
    dispatch(removeStore(id));
  };

  const handleReorder = (dragIndex: number, dropIndex: number) => {
    const reorderedStores = [...stores];
    const [draggedStore] = reorderedStores.splice(dragIndex, 1);
    reorderedStores.splice(dropIndex, 0, draggedStore);
    
    const updatedStores = reorderedStores.map((store, index) => ({
      ...store,
      order: index
    }));
    
    dispatch(reorderStores(updatedStores));
  };

  return (
    <div className="p-8 pt-[180px] ml-sidenav min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Stores Management</h1>
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex gap-4 mb-8">
            <input
              type="text"
              value={newStore}
              onChange={(e) => setNewStore(e.target.value)}
              placeholder="Enter store name"
              className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
            />
            <button 
              onClick={handleAddStore}
              className="px-6 py-2 bg-primary text-white rounded-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors"
            >
              Add Store
            </button>
          </div>

          <div className="space-y-4">
            {stores.map((store, index) => (
              <div key={store.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors">
                <input
                  type="text"
                  value={store.name}
                  onChange={(e) => handleUpdateStore(store, e.target.value)}
                  className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                />
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => handleRemoveStore(store.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                  >
                    Remove
                  </button>
                  {index > 0 && (
                    <button 
                      onClick={() => handleReorder(index, index - 1)}
                      className="p-2 text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
                    >
                      ↑
                    </button>
                  )}
                  {index < stores.length - 1 && (
                    <button 
                      onClick={() => handleReorder(index, index + 1)}
                      className="p-2 text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
                    >
                      ↓
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoresPage;
