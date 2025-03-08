import React, { useEffect, useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AgGridReact } from 'ag-grid-react';
import { ColDef } from 'ag-grid-community';
import { Store, CreateStoreDto } from '../types/store';
import { RootState } from '../store/store';
import { storeService } from '../services/storeService';
import { setStores, addStore, updateStore, removeStore, setLoading, setError } from '../store/storesSlice';
import StoreForm from '../components/stores/StoreForm';
import AuthForm from '../components/auth/AuthForm';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

const StoresPage: React.FC = () => {
  const dispatch = useDispatch();
  const { stores, loading, error } = useSelector((state: RootState) => state.stores);
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const [showForm, setShowForm] = React.useState(false);
  const [showAuthForm, setShowAuthForm] = React.useState(false);
  const [selectedStore, setSelectedStore] = React.useState<Store | null>(null);

  const loadStores = useCallback(async () => {
    try {
      dispatch(setLoading(true));
      const data = await storeService.getAllStores();
      dispatch(setStores(data));
    } catch (err) {
      dispatch(setError(err instanceof Error ? err.message : 'Failed to load stores'));
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  useEffect(() => {
    loadStores();
  }, [loadStores]);

  const columnDefs = useMemo<ColDef[]>(() => [
    { 
      field: 'name',
      headerName: 'Store Name',
      sortable: true,
      filter: true,
      flex: 1,
      minWidth: 150,
    },
    { 
      field: 'location',
      headerName: 'Location',
      sortable: true,
      filter: true,
      flex: 1,
      minWidth: 120,
    },
    { 
      field: 'manager',
      headerName: 'Manager',
      sortable: true,
      filter: true,
      flex: 1,
      minWidth: 120,
    },
    { 
      field: 'type',
      headerName: 'Type',
      sortable: true,
      filter: true,
      width: 100,
    },
    { 
      field: 'status',
      headerName: 'Status',
      sortable: true,
      filter: true,
      width: 100,
      cellRenderer: (params: { value: string }) => (
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
          params.value === 'active' 
            ? 'bg-green-100 text-green-800' 
            : 'bg-red-100 text-red-800'
        }`}>
          {params.value.charAt(0).toUpperCase() + params.value.slice(1)}
        </span>
      ),
    },
    {
      headerName: 'Actions',
      width: 120,
      sortable: false,
      filter: false,
      cellRenderer: (params: { data: Store }) => {
        if (!isAuthenticated || !params.data) return null;
        return (
          <div className="flex items-center space-x-2">
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
        );
      },
    },
  ], [isAuthenticated]);

  const defaultColDef = useMemo(() => ({
    resizable: true,
    sortable: true,
    filter: true,
  }), []);

  const handleCreateStore = async (storeData: CreateStoreDto) => {
    if (!isAuthenticated) {
      setShowAuthForm(true);
      return;
    }

    try {
      dispatch(setLoading(true));
      const newStore = await storeService.createStore(storeData);
      dispatch(addStore(newStore));
      await loadStores();
      setShowForm(false);
    } catch (err) {
      dispatch(setError(err instanceof Error ? err.message : 'Failed to create store'));
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleUpdateStore = async (storeData: CreateStoreDto) => {
    if (!selectedStore || !isAuthenticated) return;

    try {
      dispatch(setLoading(true));
      const updatedStore = await storeService.updateStore({
        ...storeData,
        id: selectedStore.id,
      });
      dispatch(updateStore(updatedStore));
      await loadStores();
      setShowForm(false);
      setSelectedStore(null);
    } catch (err) {
      dispatch(setError(err instanceof Error ? err.message : 'Failed to update store'));
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleDelete = async (id: string) => {
    if (!isAuthenticated || !window.confirm('Are you sure you want to delete this store?')) return;

    try {
      dispatch(setLoading(true));
      await storeService.deleteStore(id);
      dispatch(removeStore(id));
      await loadStores();
    } catch (err) {
      dispatch(setError(err instanceof Error ? err.message : 'Failed to delete store'));
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleEdit = (store: Store) => {
    setSelectedStore(store);
    setShowForm(true);
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Store Management</h1>
        {isAuthenticated && (
          <button
            onClick={() => setShowForm(true)}
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark"
          >
            Add New Store
          </button>
        )}
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="ag-theme-alpine w-full" style={{ height: 'calc(100vh - 250px)' }}>
          {loading ? (
            <div className="flex justify-center items-center h-full">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <AgGridReact
              rowData={stores}
              columnDefs={columnDefs}
              defaultColDef={defaultColDef}
              animateRows={true}
              rowSelection="single"
              pagination={true}
              paginationPageSize={10}
              suppressCellFocus={true}
              onGridReady={params => {
                params.api.sizeColumnsToFit();
              }}
            />
          )}
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">
                  {selectedStore ? 'Edit Store' : 'Create New Store'}
                </h2>
                <button
                  onClick={() => {
                    setShowForm(false);
                    setSelectedStore(null);
                  }}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <span className="sr-only">Close</span>
                  ×
                </button>
              </div>
              <StoreForm
                onSubmit={selectedStore ? handleUpdateStore : handleCreateStore}
                onCancel={() => {
                  setShowForm(false);
                  setSelectedStore(null);
                }}
                initialData={selectedStore}
              />
            </div>
          </div>
        </div>
      )}

      {showAuthForm && !isAuthenticated && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg max-w-md w-full mx-4">
            <AuthForm onClose={() => setShowAuthForm(false)} />
          </div>
        </div>
      )}
    </div>
  );
};

export default StoresPage;
