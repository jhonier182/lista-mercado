import { useState, useEffect } from 'react';
import { getStores, addStore, updateStore, deleteStore } from '../services/storeService';
import { AuthCheck } from '../auth/AuthCheck';
import toast from 'react-hot-toast';

export const StoreManagement = () => {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newStoreName, setNewStoreName] = useState('');
  const [editingStore, setEditingStore] = useState(null);

  useEffect(() => {
    loadStores();
  }, []);

  const loadStores = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log("Cargando tiendas...");
      const { stores, error } = await getStores();
      
      if (error) {
        console.error("Error al cargar tiendas:", error);
        setError(error);
        toast.error(`Error al cargar tiendas: ${error}`);
        return;
      }
      
      console.log("Tiendas cargadas:", stores?.length || 0);
      setStores(stores || []);
    } catch (err) {
      console.error("Error inesperado al cargar tiendas:", err);
      setError(err.message);
      toast.error(`Error inesperado: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleAddStore = async (e) => {
    e.preventDefault();
    
    if (!newStoreName.trim()) {
      toast.error('El nombre de la tienda es requerido');
      return;
    }
    
    try {
      setLoading(true);
      console.log("Agregando tienda:", newStoreName);
      
      const { id, error } = await addStore({ name: newStoreName.trim() });
      
      if (error) {
        console.error("Error al agregar tienda:", error);
        toast.error(`Error al agregar tienda: ${error}`);
        return;
      }
      
      toast.success('Tienda agregada exitosamente');
      setNewStoreName('');
      loadStores();
    } catch (err) {
      console.error("Error inesperado al agregar tienda:", err);
      toast.error(`Error inesperado: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStore = async (e) => {
    e.preventDefault();
    
    if (!editingStore || !editingStore.name.trim()) {
      toast.error('El nombre de la tienda es requerido');
      return;
    }
    
    try {
      setLoading(true);
      console.log("Actualizando tienda:", editingStore);
      
      const { error } = await updateStore(editingStore.id, { name: editingStore.name.trim() });
      
      if (error) {
        console.error("Error al actualizar tienda:", error);
        toast.error(`Error al actualizar tienda: ${error}`);
        return;
      }
      
      toast.success('Tienda actualizada exitosamente');
      setEditingStore(null);
      loadStores();
    } catch (err) {
      console.error("Error inesperado al actualizar tienda:", err);
      toast.error(`Error inesperado: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteStore = async (storeId) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar esta tienda?')) {
      return;
    }
    
    try {
      setLoading(true);
      console.log("Eliminando tienda:", storeId);
      
      const { error } = await deleteStore(storeId);
      
      if (error) {
        console.error("Error al eliminar tienda:", error);
        toast.error(`Error al eliminar tienda: ${error}`);
        return;
      }
      
      toast.success('Tienda eliminada exitosamente');
      loadStores();
    } catch (err) {
      console.error("Error inesperado al eliminar tienda:", err);
      toast.error(`Error inesperado: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCheck>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Gestión de Tiendas</h1>
        </div>
        
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 dark:bg-red-900/20 dark:border-red-500/50">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700 dark:text-red-400">
                  {error}. <button className="font-medium underline" onClick={loadStores}>Reintentar</button>
                </p>
              </div>
            </div>
          </div>
        )}
        
        {/* Formulario para agregar tienda */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            {editingStore ? 'Editar Tienda' : 'Agregar Nueva Tienda'}
          </h2>
          <form onSubmit={editingStore ? handleUpdateStore : handleAddStore} className="space-y-4">
            <div>
              <label htmlFor="storeName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Nombre de la Tienda
              </label>
              <input
                type="text"
                id="storeName"
                value={editingStore ? editingStore.name : newStoreName}
                onChange={(e) => editingStore 
                  ? setEditingStore({...editingStore, name: e.target.value}) 
                  : setNewStoreName(e.target.value)
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="Ej: Supermercado XYZ, Tienda Local"
                required
              />
            </div>
            <div className="flex justify-end space-x-3">
              {editingStore && (
                <button
                  type="button"
                  onClick={() => setEditingStore(null)}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:hover:bg-gray-600"
                >
                  Cancelar
                </button>
              )}
              <button
                type="submit"
                disabled={loading}
                className="inline-flex justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                {loading ? 'Guardando...' : editingStore ? 'Actualizar' : 'Agregar'}
              </button>
            </div>
          </form>
        </div>
        
        {/* Lista de tiendas */}
        <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
              Tiendas Existentes
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">
              Gestiona las tiendas donde realizas tus compras.
            </p>
          </div>
          <div className="border-t border-gray-200 dark:border-gray-700">
            {loading && !editingStore ? (
              <div className="animate-pulse space-y-4 p-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
                ))}
              </div>
            ) : stores.length > 0 ? (
              <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                {stores.map((store) => (
                  <li key={store.id} className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {store.name}
                        </p>
                      </div>
                      <div className="ml-4 flex-shrink-0 flex space-x-2">
                        <button
                          onClick={() => setEditingStore(store)}
                          className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleDeleteStore(store.id)}
                          className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        >
                          Eliminar
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500 dark:text-gray-400">No hay tiendas disponibles.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </AuthCheck>
  );
}; 