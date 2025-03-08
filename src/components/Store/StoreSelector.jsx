import { useState, useEffect } from 'react';
import { getStores, addStore } from '../../services/storeService';
import toast from 'react-hot-toast';

export const StoreSelector = ({ onSelect, selectedStore }) => {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newStoreName, setNewStoreName] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    loadStores();
  }, [retryCount]);

  const loadStores = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log("Intentando cargar tiendas...");
      const { stores, error } = await getStores();
      
      if (error) {
        console.error("Error al cargar tiendas:", error);
        setError(error);
        toast.error(`Error al cargar tiendas: ${error}`);
        return;
      }
      
      console.log("Tiendas cargadas:", stores);
      setStores(stores || []);
      
      // Si no hay tiendas, mostrar mensaje
      if (!stores || stores.length === 0) {
        toast.info("No hay tiendas disponibles. Por favor, crea una nueva tienda.");
        setShowAddForm(true);
      }
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
      console.log("Intentando agregar tienda:", newStoreName);
      
      const { id, error } = await addStore({ name: newStoreName.trim() });
      
      if (error) {
        console.error("Error al agregar tienda:", error);
        toast.error(`Error al agregar tienda: ${error}`);
        return;
      }
      
      console.log("Tienda agregada con ID:", id);
      toast.success('Tienda agregada exitosamente');
      
      // Crear objeto de tienda para seleccionarla automáticamente
      const newStore = { id, name: newStoreName.trim() };
      
      // Actualizar lista de tiendas
      setStores(prev => [...prev, newStore]);
      
      // Seleccionar la nueva tienda
      onSelect(newStore);
      
      // Limpiar formulario
      setNewStoreName('');
      setShowAddForm(false);
    } catch (err) {
      console.error("Error inesperado al agregar tienda:", err);
      toast.error(`Error inesperado: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
  };

  // Asegurarse de que selectedStore tenga un formato válido
  useEffect(() => {
    if (selectedStore && stores.length > 0) {
      // Si selectedStore no tiene id pero tiene un valor, intentar encontrarlo por nombre
      if (!selectedStore.id && selectedStore.name) {
        const foundStore = stores.find(s => s.name === selectedStore.name);
        if (foundStore) {
          onSelect(foundStore);
        }
      }
    }
  }, [selectedStore, stores, onSelect]);

  return (
    <div className="space-y-4">
      {error && (
        <div className="text-red-500 text-sm">
          Error: {error}. <button className="underline" onClick={handleRetry}>Reintentar</button>
        </div>
      )}
      
      <div className="flex items-center justify-between">
        <select
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          value={selectedStore?.id || ''}
          onChange={(e) => {
            const store = stores.find(s => s.id === e.target.value);
            if (store) {
              console.log("Tienda seleccionada desde dropdown:", store);
              onSelect(store);
            } else if (e.target.value === '') {
              onSelect(null);
            }
          }}
          disabled={loading || stores.length === 0}
        >
          <option value="">Seleccionar tienda</option>
          {stores.map((store) => (
            <option key={store.id} value={store.id}>
              {store.name}
            </option>
          ))}
        </select>
        <button
          type="button"
          onClick={() => setShowAddForm(!showAddForm)}
          className="ml-2 inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          {showAddForm ? 'Cancelar' : 'Nueva Tienda'}
        </button>
      </div>

      {showAddForm && (
        <form onSubmit={handleAddStore} className="mt-3 flex gap-2">
          <input
            type="text"
            value={newStoreName}
            onChange={(e) => setNewStoreName(e.target.value)}
            placeholder="Nombre de la tienda"
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            {loading ? 'Agregando...' : 'Agregar'}
          </button>
        </form>
      )}
      
      {loading && (
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-indigo-500"></div>
          <span className="ml-2 text-sm text-gray-500">Cargando...</span>
        </div>
      )}
    </div>
  );
};
