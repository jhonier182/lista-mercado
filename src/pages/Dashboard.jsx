import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getProducts } from '../services/productService';
import { getCategories } from '../services/categoryService';
import { getStores } from '../services/storeService';
import { AuthCheck } from '../auth/AuthCheck';
import toast from 'react-hot-toast';

export const Dashboard = () => {
  const [data, setData] = useState({
    products: [],
    categories: [],
    stores: [],
    totalSpent: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log("Cargando datos del dashboard...");
      
      // Cargar productos
      const { products, error: productsError } = await getProducts();
      if (productsError) {
        throw new Error(`Error al cargar productos: ${productsError}`);
      }
      
      // Cargar categorías
      const { categories, error: categoriesError } = await getCategories();
      if (categoriesError) {
        throw new Error(`Error al cargar categorías: ${categoriesError}`);
      }
      
      // Cargar tiendas
      const { stores, error: storesError } = await getStores();
      if (storesError) {
        throw new Error(`Error al cargar tiendas: ${storesError}`);
      }
      
      // Calcular gasto total
      const totalSpent = products.reduce((total, product) => {
        return total + (product.price * (product.quantity || 1));
      }, 0);
      
      console.log("Datos cargados:", {
        products: products.length,
        categories: categories.length,
        stores: stores.length,
        totalSpent
      });
      
      setData({
        products,
        categories,
        stores,
        totalSpent
      });
    } catch (err) {
      console.error("Error al cargar datos del dashboard:", err);
      setError(err.message);
      toast.error(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Funciones para manejar las acciones
  const handleManageCategories = () => {
    navigate('/categories');
  };

  const handleManageStores = () => {
    navigate('/stores');
  };

  return (
    <AuthCheck>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        
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
                  {error}. <button className="font-medium underline" onClick={loadData}>Reintentar</button>
                </p>
              </div>
            </div>
          </div>
        )}
        
        {loading ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="animate-pulse bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg h-32"></div>
            ))}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {/* Tarjeta de Productos */}
              <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-indigo-500 rounded-md p-3">
                      <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                      </svg>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                          Productos
                        </dt>
                        <dd>
                          <div className="text-lg font-medium text-gray-900 dark:text-white">
                            {data.products.length}
                          </div>
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 px-4 py-4 sm:px-6">
                  <div className="text-sm">
                    <Link to="/products" className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400">
                      Ver todos los productos
                    </Link>
                  </div>
                </div>
              </div>

              {/* Tarjeta de Categorías */}
              <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
                      <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                      </svg>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                          Categorías
                        </dt>
                        <dd>
                          <div className="text-lg font-medium text-gray-900 dark:text-white">
                            {data.categories.length}
                          </div>
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 px-4 py-4 sm:px-6">
                  <div className="text-sm">
                    <button 
                      onClick={handleManageCategories}
                      className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
                    >
                      Administrar categorías
                    </button>
                  </div>
                </div>
              </div>

              {/* Tarjeta de Tiendas */}
              <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-yellow-500 rounded-md p-3">
                      <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                          Tiendas
                        </dt>
                        <dd>
                          <div className="text-lg font-medium text-gray-900 dark:text-white">
                            {data.stores.length}
                          </div>
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 px-4 py-4 sm:px-6">
                  <div className="text-sm">
                    <button 
                      onClick={handleManageStores}
                      className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
                    >
                      Administrar tiendas
                    </button>
                  </div>
                </div>
              </div>

              {/* Tarjeta de Gasto Total */}
              <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-red-500 rounded-md p-3">
                      <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                          Gasto Total
                        </dt>
                        <dd>
                          <div className="text-lg font-medium text-gray-900 dark:text-white">
                            ${data.totalSpent.toFixed(2)}
                          </div>
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 px-4 py-4 sm:px-6">
                  <div className="text-sm">
                    <Link to="/products" className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400">
                      Ver comparación de precios
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Productos Recientes */}
            <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                  Productos Recientes
                </h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">
                  Los últimos productos agregados a tu lista.
                </p>
              </div>
              <div className="border-t border-gray-200 dark:border-gray-700">
                {data.products.length > 0 ? (
                  <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                    {data.products.slice(0, 5).map((product) => (
                      <li key={product.id} className="px-4 py-4 sm:px-6">
                        <div className="flex items-center justify-between">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-indigo-600 truncate dark:text-indigo-400">
                              {product.name}
                            </p>
                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                              {product.categoryName} • {product.storeName}
                            </p>
                          </div>
                          <div className="ml-4 flex-shrink-0">
                            <p className="text-sm text-gray-900 dark:text-white">
                              ${product.price}
                            </p>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500 dark:text-gray-400">No hay productos disponibles.</p>
                    <Link 
                      to="/products" 
                      className="mt-2 inline-block text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
                    >
                      Agregar productos
                    </Link>
                  </div>
                )}
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 px-4 py-4 sm:px-6">
                <div className="text-sm">
                  <Link to="/products" className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400">
                    Ver todos los productos
                  </Link>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </AuthCheck>
  );
};
