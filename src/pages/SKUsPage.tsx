import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AgGridReact } from 'ag-grid-react';
import { ColDef, ValueFormatterParams } from 'ag-grid-community';
import { SKU, CreateSKUDto } from '../types/sku';
import { RootState } from '../store/store';
import { skuService } from '../services/skuService';
import { setSKUs, addSKU, updateSKU, removeSKU as deleteSKU, setLoading, setError } from '../store/skusSlice';
import SKUForm from '../components/skus/SKUForm';
import AuthForm from '../components/auth/AuthForm';

const SKUsPage: React.FC = () => {
  const dispatch = useDispatch();
  const { skus, loading, error } = useSelector((state: RootState) => state.skus);
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const [showForm, setShowForm] = useState(false);
  const [showAuthForm, setShowAuthForm] = useState(false);
  const [selectedSKU, setSelectedSKU] = useState<SKU | undefined>();

  const columnDefs: ColDef<SKU>[] = [
    { 
      field: 'name', 
      headerName: 'SKU Name',
      sortable: true,
      filter: true,
      width: 200,
    },
    { 
      field: 'description', 
      headerName: 'Description',
      sortable: true,
      filter: true,
      width: 250,
    },
    { 
      field: 'price', 
      headerName: 'Price',
      sortable: true,
      filter: true,
      width: 120,
      valueFormatter: (params: ValueFormatterParams) => {
        return params.value ? `$${params.value.toFixed(2)}` : '';
      },
    },
    { 
      field: 'cost', 
      headerName: 'Cost',
      sortable: true,
      filter: true,
      width: 120,
      valueFormatter: (params: ValueFormatterParams) => {
        return params.value ? `$${params.value.toFixed(2)}` : '';
      },
    },
    { 
      field: 'category', 
      headerName: 'Category',
      sortable: true,
      filter: true,
      width: 150,
    },
    { 
      field: 'status', 
      headerName: 'Status',
      sortable: true,
      filter: true,
      width: 120,
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
      width: 150,
      cellRenderer: (params: { data: SKU }) => {
        if (!params.data || !isAuthenticated) return null;
        return (
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleEdit(params.data)}
              className="px-3 py-1 text-sm font-medium text-blue-600 hover:text-blue-800 focus:outline-none"
            >
              Edit
            </button>
            <button
              onClick={() => handleDelete(params.data.id)}
              className="px-3 py-1 text-sm font-medium text-red-600 hover:text-red-800 focus:outline-none"
            >
              Delete
            </button>
          </div>
        );
      },
      sortable: false,
      filter: false,
    },
  ];

  const loadSKUs = useCallback(async () => {
    try {
      dispatch(setLoading(true));
      const data = await skuService.getAllSKUs();
      dispatch(setSKUs(data));
    } catch (err) {
      dispatch(setError(err instanceof Error ? err.message : 'Failed to load SKUs'));
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  useEffect(() => {
    void loadSKUs();
  }, [loadSKUs]);

  const handleCreateSKU = async (skuData: CreateSKUDto) => {
    if (!isAuthenticated) {
      setShowAuthForm(true);
      return;
    }

    try {
      dispatch(setLoading(true));
      const newSKU = await skuService.createSKU(skuData);
      dispatch(addSKU(newSKU));
      setShowForm(false);
      setSelectedSKU(undefined);
      await loadSKUs();
    } catch (err) {
      dispatch(setError(err instanceof Error ? err.message : 'Failed to create SKU'));
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleUpdateSKU = async (skuData: CreateSKUDto) => {
    if (!selectedSKU || !isAuthenticated) return;

    try {
      dispatch(setLoading(true));
      const updatedSKU = await skuService.updateSKU(selectedSKU.id, skuData);
      if (updatedSKU) {
        dispatch(updateSKU(updatedSKU));
      } else {
        throw new Error('Failed to update SKU');
      }
      setShowForm(false);
      setSelectedSKU(undefined);
      await loadSKUs();
    } catch (err) {
      dispatch(setError(err instanceof Error ? err.message : 'Failed to update SKU'));
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleDelete = async (id: string) => {
    if (!isAuthenticated || !window.confirm('Are you sure you want to delete this SKU?')) return;

    try {
      dispatch(setLoading(true));
      await skuService.deleteSKU(id);
      dispatch(deleteSKU(id));
      await loadSKUs();
    } catch (err) {
      dispatch(setError(err instanceof Error ? err.message : 'Failed to delete SKU'));
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleEdit = (sku: SKU) => {
    setSelectedSKU(sku);
    setShowForm(true);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">SKU Management</h1>
        {isAuthenticated && (
          <button
            onClick={() => {
              setSelectedSKU(undefined);
              setShowForm(true);
            }}
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors"
          >
            Add New SKU
          </button>
        )}
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div 
          className="flex-1 w-full ag-theme-alpine" 
          style={{ height: '600px', width: '100%' }}
        >
          <AgGridReact
            rowData={skus}
            columnDefs={columnDefs}
            defaultColDef={{
              resizable: true,
              sortable: true,
              filter: true,
              minWidth: 100,
            }}
            animateRows={true}
            pagination={true}
            paginationPageSize={10}
          />
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg max-w-2xl w-full mx-4">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-900">
                {selectedSKU ? 'Edit SKU' : 'Add New SKU'}
              </h2>
              <button
                onClick={() => {
                  setShowForm(false);
                  setSelectedSKU(undefined);
                }}
                className="text-gray-400 hover:text-gray-500 focus:outline-none"
              >
                <span className="sr-only">Close</span>
                &times;
              </button>
            </div>
            <SKUForm
              onSubmit={selectedSKU ? handleUpdateSKU : handleCreateSKU}
              onCancel={() => {
                setShowForm(false);
                setSelectedSKU(undefined);
              }}
              initialData={selectedSKU}
            />
          </div>
        </div>
      )}

      {showAuthForm && !isAuthenticated && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg max-w-md w-full mx-4">
            <AuthForm mode="login" onClose={() => setShowAuthForm(false)} />
          </div>
        </div>
      )}
    </div>
  );
};

export default SKUsPage;
