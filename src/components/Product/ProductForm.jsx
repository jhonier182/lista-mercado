import { useState, useEffect } from 'react';
import { addProduct, updateProduct } from '../../services/productService';
import { StoreSelector } from '../Store/StoreSelector';
import { CategorySelector } from '../Category/CategorySelector';
import { AuthCheck } from '../../auth/AuthCheck';
import toast from 'react-hot-toast';

export const ProductForm = ({ product, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    price: '',
    unit: 'unidad',
    quantity: '1',
    store: null,
    category: null,
    notes: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [debugInfo, setDebugInfo] = useState(null);

  useEffect(() => {
    if (product) {
      console.log("Editando producto:", product);
      setFormData({
        name: product.name || '',
        brand: product.brand || '',
        price: product.price || '',
        unit: product.unit || 'unidad',
        quantity: product.quantity || '1',
        store: {
          id: product.storeId,
          name: product.storeName
        },
        category: {
          id: product.categoryId,
          name: product.categoryName
        },
        notes: product.notes || ''
      });
    }
  }, [product]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpiar error del campo
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const handleStoreSelect = (store) => {
    console.log("Tienda seleccionada:", store);
    setFormData(prev => ({
      ...prev,
      store
    }));
    
    // Limpiar error
    if (errors.store) {
      setErrors(prev => ({
        ...prev,
        store: null
      }));
    }
  };

  const handleCategorySelect = (category) => {
    console.log("Categoría seleccionada:", category);
    setFormData(prev => ({
      ...prev,
      category
    }));
    
    // Limpiar error
    if (errors.category) {
      setErrors(prev => ({
        ...prev,
        category: null
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'El nombre del producto es requerido';
    }
    
    if (!formData.price || isNaN(parseFloat(formData.price)) || parseFloat(formData.price) <= 0) {
      newErrors.price = 'El precio debe ser un número mayor que cero';
    }
    
    if (!formData.store || !formData.store.id) {
      newErrors.store = 'Debes seleccionar una tienda';
    }
    
    if (!formData.category || !formData.category.id) {
      newErrors.category = 'Debes seleccionar una categoría';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Por favor, corrige los errores en el formulario');
      return;
    }
    
    setLoading(true);
    setDebugInfo(null);

    try {
      console.log("Enviando datos del producto:", formData);
      
      // Verificar que los objetos store y category tengan id
      if (!formData.store || !formData.store.id) {
        throw new Error("La tienda seleccionada no tiene un ID válido");
      }
      
      if (!formData.category || !formData.category.id) {
        throw new Error("La categoría seleccionada no tiene un ID válido");
      }
      
      const productData = {
        name: formData.name.trim(),
        brand: formData.brand.trim(),
        price: parseFloat(formData.price),
        unit: formData.unit,
        quantity: parseFloat(formData.quantity),
        storeId: formData.store.id,
        storeName: formData.store.name,
        categoryId: formData.category.id,
        categoryName: formData.category.name,
        notes: formData.notes.trim()
      };

      console.log("Datos procesados del producto:", productData);
      
      const result = product
        ? await updateProduct(product.id, productData)
        : await addProduct(productData);

      if (result.error) {
        console.error("Error al guardar producto:", result.error);
        setDebugInfo(JSON.stringify(result, null, 2));
        throw new Error(result.error);
      }

      toast.success(product ? 'Producto actualizado' : 'Producto agregado');
      onSave();
    } catch (error) {
      console.error("Error inesperado:", error);
      toast.error(error.message || 'Error al guardar el producto');
      setDebugInfo(JSON.stringify({
        message: error.message,
        formData: formData,
        stack: error.stack
      }, null, 2));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCheck>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Nombre del producto
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.name ? 'border-red-500' : ''}`}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-500">{errors.name}</p>
            )}
          </div>

          <div>
            <label htmlFor="brand" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Marca
            </label>
            <input
              type="text"
              id="brand"
              name="brand"
              value={formData.brand}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>

          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Precio
            </label>
            <input
              type="number"
              id="price"
              name="price"
              min="0"
              step="0.01"
              value={formData.price}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.price ? 'border-red-500' : ''}`}
            />
            {errors.price && (
              <p className="mt-1 text-sm text-red-500">{errors.price}</p>
            )}
          </div>

          <div>
            <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Cantidad
            </label>
            <div className="mt-1 flex rounded-md shadow-sm">
              <input
                type="number"
                id="quantity"
                name="quantity"
                min="0"
                step="0.01"
                value={formData.quantity}
                onChange={handleChange}
                className="block w-full rounded-none rounded-l-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
              <select
                name="unit"
                value={formData.unit}
                onChange={handleChange}
                className="inline-flex items-center rounded-r-md border border-l-0 border-gray-300 bg-gray-50 px-3 text-gray-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value="unidad">unidad</option>
                <option value="kg">kg</option>
                <option value="gr">gr</option>
                <option value="litros">litros</option>
                <option value="mililitros">mililitros</option>
              </select>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Tienda
            </label>
            <StoreSelector
              selectedStore={formData.store}
              onSelect={handleStoreSelect}
            />
            {errors.store && (
              <p className="mt-1 text-sm text-red-500">{errors.store}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Categoría
            </label>
            <CategorySelector
              selectedCategory={formData.category}
              onSelect={handleCategorySelect}
            />
            {errors.category && (
              <p className="mt-1 text-sm text-red-500">{errors.category}</p>
            )}
          </div>

          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Notas
            </label>
            <textarea
              id="notes"
              name="notes"
              rows="3"
              value={formData.notes}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
        </div>

        {debugInfo && (
          <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded text-xs overflow-auto max-h-40">
            <p className="font-bold mb-1">Información de depuración:</p>
            <pre>{debugInfo}</pre>
          </div>
        )}

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex justify-center rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:bg-gray-600"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={loading}
            className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Guardando...' : product ? 'Actualizar' : 'Crear'}
          </button>
        </div>
      </form>
    </AuthCheck>
  );
};
