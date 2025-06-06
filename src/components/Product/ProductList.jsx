import { useState, useEffect } from 'react';
import { getProducts, deleteProduct } from '../../services/productService';
import { getCategories } from '../../services/categoryService';
import { getStores } from '../../services/storeService';
import { ProductForm } from './ProductForm';
import { AuthCheck } from '../../auth/AuthCheck';
import toast from 'react-hot-toast';

export const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    store: '',
    minPrice: '',
    maxPrice: '',
    brand: '',
    orderBy: { field: 'createdAt', direction: 'desc' }
  });
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    loadProducts();
    loadCategories();
    loadStores();
  }, [retryCount]);

  useEffect(() => {
    loadProducts();
  }, [filters.category, filters.store, filters.orderBy, filters.search, filters.brand, filters.minPrice, filters.maxPrice]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log("Cargando productos con filtros:", filters);
      const { products, error } = await getProducts({
        category: filters.category,
        store: filters.store,
        brand: filters.brand,
        minPrice: filters.minPrice,
        maxPrice: filters.maxPrice,
        search: filters.search,
        orderBy: filters.orderBy
      });
      
      if (error) {
        console.error("Error al cargar productos:", error);
        setError(error);
        toast.error(`Error al cargar productos: ${error}`);
        return;
      }
      
      console.log("Productos cargados:", products?.length || 0);
      setProducts(products || []);
    } catch (err) {
      console.error("Error inesperado al cargar productos:", err);
      setError(err.message);
      toast.error(`Error inesperado: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const { categories, error } = await getCategories();
      if (error) {
        console.error("Error al cargar categorías:", error);
        return;
      }
      setCategories(categories || []);
    } catch (err) {
      console.error("Error inesperado al cargar categorías:", err);
    }
  };

  const loadStores = async () => {
    try {
      const { stores, error } = await getStores();
      if (error) {
        console.error("Error al cargar tiendas:", error);
        return;
      }
      setStores(stores || []);
    } catch (err) {
      console.error("Error inesperado al cargar tiendas:", err);
    }
  };

  const handleDelete = async (productId) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar este producto?')) {
      return;
    }

    try {
      setLoading(true);
      console.log("Eliminando producto:", productId);
      
      const { error } = await deleteProduct(productId);
      
      if (error) {
        console.error("Error al eliminar producto:", error);
        toast.error(`Error al eliminar el producto: ${error}`);
        return;
      }
      
      toast.success('Producto eliminado exitosamente');
      loadProducts();
    } catch (err) {
      console.error("Error inesperado al eliminar producto:", err);
      toast.error(`Error inesperado: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product) => {
    console.log("Editando producto:", product);
    setSelectedProduct(product);
    setShowForm(true);
  };

  const handleSave = () => {
    setShowForm(false);
    setSelectedProduct(null);
    loadProducts();
  };

  const handleCancel = () => {
    setShowForm(false);
    setSelectedProduct(null);
  };

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
  };

  const handleResetFilters = () => {
    setFilters({
      search: '',
      category: '',
      store: '',
      brand: '',
      orderBy: { field: 'createdAt', direction: 'desc' }
    });
  };

  const filteredProducts = products;

  return (
    <AuthCheck>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Productos</h1>
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Nuevo Producto
          </button>
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
                  {error}. <button className="font-medium underline" onClick={handleRetry}>Reintentar</button>
                </p>
              </div>
            </div>
          </div>
        )}
        
        {!showForm && (
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4">
            <div className="space-y-4">
              {/* Búsqueda general */}
              <div>
                <label htmlFor="search" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Buscar por nombre o marca
                </label>
                <input
                  id="search"
                  type="text"
                  placeholder="Buscar productos..."
                  value={filters.search}
                  onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Filtro por marca */}
                <div>
                  <label htmlFor="brand" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Marca
                  </label>
                  <input
                    id="brand"
                    type="text"
                    placeholder="Filtrar por marca..."
                    value={filters.brand}
                    onChange={(e) => setFilters(prev => ({ ...prev, brand: e.target.value }))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
                
                {/* Filtro por categoría */}
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Categoría
                  </label>
                  <select
                    id="category"
                    value={filters.category}
                    onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  >
                    <option value="">Todas las categorías</option>
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                {/* Filtro por tienda */}
                <div>
                  <label htmlFor="store" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Tienda
                  </label>
                  <select
                    id="store"
                    value={filters.store}
                    onChange={(e) => setFilters(prev => ({ ...prev, store: e.target.value }))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  >
                    <option value="">Todas las tiendas</option>
                    {stores.map(store => (
                      <option key={store.id} value={store.id}>
                        {store.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="flex justify-end">
                <button
                  onClick={handleResetFilters}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:hover:bg-gray-600"
                >
                  Limpiar filtros
                </button>
              </div>
            </div>
          </div>
        )}

        {showForm ? (
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-6">
              {selectedProduct ? 'Editar Producto' : 'Nuevo Producto'}
            </h2>
            <ProductForm
              product={selectedProduct}
              onSave={handleSave}
              onCancel={handleCancel}
            />
          </div>
        ) : loading ? (
          <div className="animate-pulse space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-gray-800 shadow rounded-lg">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-white">No hay productos</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {(filters.search || filters.category || filters.store || filters.brand || filters.minPrice || filters.maxPrice) 
                ? 'No se encontraron productos que coincidan con tus filtros.' 
                : 'Comienza agregando un nuevo producto a tu lista.'}
            </p>
            <div className="mt-6">
              {(filters.search || filters.category || filters.store || filters.brand || filters.minPrice || filters.maxPrice) ? (
                <button
                  onClick={handleResetFilters}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:hover:bg-gray-600 mr-4"
                >
                  Limpiar filtros
                </button>
              ) : null}
              <button
                onClick={() => setShowForm(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                Nuevo Producto
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Mostrando {filteredProducts.length} {filteredProducts.length === 1 ? 'producto' : 'productos'}
              </p>
            </div>
            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredProducts.map((product) => (
                <li key={product.id} className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-indigo-600 truncate dark:text-indigo-400">
                          <span className="font-bold">Nombre:</span> {product.name}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          <span className="font-bold">Precio:</span> ${product.price} / {product.unit}
                        </p>
                      </div>
                      <div className="mt-2 flex justify-between">
                        <div className="sm:flex">
                          <p className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                            <span className="font-medium mr-1">Marca:</span> {product.brand || 'No especificada'}
                          </p>
                          <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6 dark:text-gray-400">
                            <span className="font-medium mr-1">Categoría:</span> {product.categoryName}
                          </p>
                          <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6 dark:text-gray-400">
                            <span className="font-medium mr-1">Tienda:</span> {product.storeName}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="ml-4 flex-shrink-0 flex space-x-2">
                      <button
                        onClick={() => handleEdit(product)}
                        className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </AuthCheck>
  );
};
