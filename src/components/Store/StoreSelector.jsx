import { useState, useEffect } from 'react';
import { getStores, addStore } from '../../services/storeService';
import toast from 'react-hot-toast';

export const StoreSelector = ({ onSelect, selectedStore }) => {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newStoreName, setNewStoreName] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    loadStores();
  }, []);

  const loadStores = async () => {
    try {
      const { stores, error } = await getStores();
      if (error) throw new Error(error);
      setStores(stores);
    } catch (error) {
      toast.error('Error al cargar las tiendas: ' + error.message);
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
      const { error } = await addStore({ name: newStoreName.trim() });
      if (error) throw new Error(error);
      
      toast.success('Tienda agregada exitosamente');
      setNewStoreName('');
      setShowAddForm(false);
      loadStores();
    } catch (error) {
      toast.error('Error al agregar la tienda: ' + error.message);
    }
  };

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-10 bg-gray-200 rounded w-full"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <select
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          value={selectedStore?.id || ''}
          onChange={(e) => {
            const store = stores.find(s => s.id === e.target.value);
            onSelect(store);
          }}
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
            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            Agregar
          </button>
        </form>
      )}
    </div>
  );
};
