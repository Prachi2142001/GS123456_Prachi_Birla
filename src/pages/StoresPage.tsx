import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { Store } from '../types';
import { addStore, updateStore, removeStore, reorderStores } from '../store/storesSlice';
import './StoresPage.css';

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
    
    // Update order property for all stores
    const updatedStores = reorderedStores.map((store, index) => ({
      ...store,
      order: index
    }));
    
    dispatch(reorderStores(updatedStores));
  };

  return (
    <div className="stores-page">
      <h1>Stores Management</h1>
      
      <div className="add-store">
        <input
          type="text"
          value={newStore}
          onChange={(e) => setNewStore(e.target.value)}
          placeholder="Enter store name"
        />
        <button onClick={handleAddStore}>Add Store</button>
      </div>

      <div className="stores-list">
        {stores.map((store, index) => (
          <div key={store.id} className="store-item">
            <input
              type="text"
              value={store.name}
              onChange={(e) => handleUpdateStore(store, e.target.value)}
            />
            <div className="store-actions">
              <button onClick={() => handleRemoveStore(store.id)}>Remove</button>
              {index > 0 && (
                <button onClick={() => handleReorder(index, index - 1)}>↑</button>
              )}
              {index < stores.length - 1 && (
                <button onClick={() => handleReorder(index, index + 1)}>↓</button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StoresPage;
