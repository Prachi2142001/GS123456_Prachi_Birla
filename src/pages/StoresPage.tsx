import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { AgGridReact } from 'ag-grid-react';
import { ColDef } from 'ag-grid-community';
import { RootState } from '../store/store';
import { Store } from '../types/store';
import { deleteStore } from '../store/storesSlice';
import StoreForm from '../components/stores/StoreForm';
import AuthForm from '../components/auth/AuthForm';

const StoresPage: React.FC = () => {
  const dispatch = useDispatch();
  const { stores } = useSelector((state: RootState) => state.stores);
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const [showStoreForm, setShowStoreForm] = useState(false);
  const [editingStore, setEditingStore] = useState<Store | null>(null);
  const [showAuthForm, setShowAuthForm] = useState(false);

  const columnDefs: ColDef[] = [
    {
      headerName: 'Store Name',
      field: 'name',
      minWidth: 150,
      flex: 1,
      resizable: true,
      filter: true,
      sortable: true,
    },
    {
      headerName: 'Location',
      field: 'location',
      minWidth: 150,
      flex: 1,
      resizable: true,
      filter: true,
      sortable: true,
    },
    {
      headerName: 'Manager',
      field: 'manager',
      minWidth: 150,
      flex: 1,
      resizable: true,
      filter: true,
      sortable: true,
    },
    {
      headerName: 'Contact',
      field: 'contact',
      minWidth: 150,
      flex: 1,
      resizable: true,
      filter: true,
      sortable: true,
    },
    {
      headerName: 'Actions',
      minWidth: 150,
      flex: 1,
      sortable: false,
      filter: false,
      cellRenderer: (params: any) => (
        <div className="flex space-x-2">
          <button
            onClick={() => handleEdit(params.data)}
            className="text-blue-600 hover:text-blue-800"
          >
            Edit
          </button>
          <button
            onClick={() => handleDelete(params.data.id)}
            className="text-red-600 hover:text-red-800"
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  const defaultColDef = {
    sortable: true,
    filter: true,
    resizable: true,
  };

  const handleEdit = (store: Store) => {
    if (!isAuthenticated) {
      setShowAuthForm(true);
      return;
    }
    setEditingStore(store);
    setShowStoreForm(true);
  };

  const handleDelete = (storeId: string) => {
    if (!isAuthenticated) {
      setShowAuthForm(true);
      return;
    }
    if (window.confirm('Are you sure you want to delete this store?')) {
      dispatch(deleteStore(storeId));
    }
  };

  const handleAddStore = () => {
    if (!isAuthenticated) {
      setShowAuthForm(true);
      return;
    }
    setEditingStore(null);
    setShowStoreForm(true);
  };

  return (
    <div className="flex flex-col h-full p-4 space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-2 sm:mb-0">Stores</h1>
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 w-full sm:w-auto">
          <button
            onClick={handleAddStore}
            className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors w-full sm:w-auto"
          >
            Add Store
          </button>
          <button
            onClick={() => {/* Add export functionality */}}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors w-full sm:w-auto"
          >
            Export to Excel
          </button>
        </div>
      </div>

      <div className="flex-grow w-full h-[calc(100vh-12rem)] min-h-[400px] bg-white rounded-lg shadow overflow-hidden">
        <div className="ag-theme-alpine w-full h-full">
          <AgGridReact
            rowData={stores}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            animateRows={true}
            rowSelection="multiple"
            suppressRowClickSelection={true}
            pagination={true}
            paginationPageSize={10}
            domLayout="autoHeight"
          />
        </div>
      </div>

      {showStoreForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-lg w-full mx-4">
            <StoreForm
              store={editingStore}
              onClose={() => setShowStoreForm(false)}
            />
          </div>
        </div>
      )}

      {showAuthForm && !isAuthenticated && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full mx-4">
            <AuthForm mode="login" onClose={() => setShowAuthForm(false)} />
          </div>
        </div>
      )}
    </div>
  );
};

export default StoresPage;
