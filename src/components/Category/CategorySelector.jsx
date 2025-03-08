import { useState, useEffect } from 'react';
import { getCategories, addCategory } from '../../services/categoryService';
import toast from 'react-hot-toast';

export const CategorySelector = ({ onSelect, selectedCategory }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    loadCategories();
  }, [retryCount]);

  const loadCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log("Intentando cargar categorías...");
      const { categories, error } = await getCategories();
      
      if (error) {
        console.error("Error al cargar categorías:", error);
        setError(error);
        toast.error(`Error al cargar categorías: ${error}`);
        return;
      }
      
      console.log("Categorías cargadas:", categories);
      setCategories(categories || []);
      
      // Si no hay categorías, mostrar mensaje
      if (!categories || categories.length === 0) {
        toast.info("No hay categorías disponibles. Por favor, crea una nueva categoría.");
        setShowAddForm(true);
      }
    } catch (err) {
      console.error("Error inesperado al cargar categorías:", err);
      setError(err.message);
      toast.error(`Error inesperado: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    
    if (!newCategoryName.trim()) {
      toast.error('El nombre de la categoría es requerido');
      return;
    }
    
    try {
      setLoading(true);
      console.log("Intentando agregar categoría:", newCategoryName);
      
      const { id, error } = await addCategory({ name: newCategoryName.trim() });
      
      if (error) {
        console.error("Error al agregar categoría:", error);
        toast.error(`Error al agregar categoría: ${error}`);
        return;
      }
      
      console.log("Categoría agregada con ID:", id);
      toast.success('Categoría agregada exitosamente');
      
      // Crear objeto de categoría para seleccionarla automáticamente
      const newCategory = { id, name: newCategoryName.trim() };
      
      // Actualizar lista de categorías
      setCategories(prev => [...prev, newCategory]);
      
      // Seleccionar la nueva categoría
      onSelect(newCategory);
      
      // Limpiar formulario
      setNewCategoryName('');
      setShowAddForm(false);
    } catch (err) {
      console.error("Error inesperado al agregar categoría:", err);
      toast.error(`Error inesperado: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
  };

  // Asegurarse de que selectedCategory tenga un formato válido
  useEffect(() => {
    if (selectedCategory && categories.length > 0) {
      // Si selectedCategory no tiene id pero tiene un valor, intentar encontrarlo por nombre
      if (!selectedCategory.id && selectedCategory.name) {
        const foundCategory = categories.find(c => c.name === selectedCategory.name);
        if (foundCategory) {
          onSelect(foundCategory);
        }
      }
    }
  }, [selectedCategory, categories, onSelect]);

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
          value={selectedCategory?.id || ''}
          onChange={(e) => {
            const category = categories.find(c => c.id === e.target.value);
            if (category) {
              console.log("Categoría seleccionada desde dropdown:", category);
              onSelect(category);
            } else if (e.target.value === '') {
              onSelect(null);
            }
          }}
          disabled={loading || categories.length === 0}
        >
          <option value="">Seleccionar categoría</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
        <button
          type="button"
          onClick={() => setShowAddForm(!showAddForm)}
          className="ml-2 inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          {showAddForm ? 'Cancelar' : 'Nueva Categoría'}
        </button>
      </div>

      {showAddForm && (
        <form onSubmit={handleAddCategory} className="mt-3 flex gap-2">
          <input
            type="text"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            placeholder="Nombre de la categoría"
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
