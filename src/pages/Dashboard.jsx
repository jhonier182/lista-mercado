import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AuthCheck } from '../auth/AuthCheck';
import { getMonthlyExpenses } from '../services/expenseService';
import { getProducts } from '../services/productService';
import { getCategories } from '../services/categoryService';
import { getStores } from '../services/storeService';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import { HiShoppingCart, HiCurrencyDollar, HiTag, HiOfficeBuilding } from 'react-icons/hi';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

export const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalCategories: 0,
    totalStores: 0,
    monthlyExpenses: 0,
    recentProducts: [],
    expensesByCategory: []
  });

  const loadDashboardData = async () => {
    try {
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear();
      const currentMonth = currentDate.getMonth() + 1;

      // Cargar datos en paralelo
      const [
        productsResponse,
        categoriesResponse,
        storesResponse,
        expensesResponse
      ] = await Promise.all([
        getProducts(),
        getCategories(),
        getStores(),
        getMonthlyExpenses(currentYear, currentMonth)
      ]);

      if (productsResponse.error) throw new Error(productsResponse.error);
      if (categoriesResponse.error) throw new Error(categoriesResponse.error);
      if (storesResponse.error) throw new Error(storesResponse.error);
      if (expensesResponse.error) throw new Error(expensesResponse.error);

      // Procesar los productos recientes
      const recentProducts = expensesResponse.expenses
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5);

      setStats({
        totalProducts: productsResponse.products.length,
        totalCategories: categoriesResponse.categories.length,
        totalStores: storesResponse.stores.length,
        monthlyExpenses: expensesResponse.total,
        recentProducts,
        expensesByCategory: expensesResponse.expenses
      });
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Error al cargar datos del dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();

    // Actualizar datos cada 30 segundos
    const interval = setInterval(() => {
      loadDashboardData();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <AuthCheck>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Panel de Control
          </h1>
          <button
            onClick={loadDashboardData}
            className="flex items-center px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Actualizar
          </button>
        </div>

        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 p-4 mb-6 dark:bg-red-900/20">
            <p className="text-red-700 dark:text-red-400">{error}</p>
          </div>
        )}

        {/* Tarjetas de Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-500 rounded-full">
                <HiShoppingCart className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500 dark:text-gray-400">Total Productos</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {stats.totalProducts}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-500 rounded-full">
                <HiCurrencyDollar className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500 dark:text-gray-400">Gastos del Mes</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {formatCurrency(stats.monthlyExpenses)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <div className="flex items-center">
              <div className="p-3 bg-purple-500 rounded-full">
                <HiTag className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500 dark:text-gray-400">Categorías</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {stats.totalCategories}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-500 rounded-full">
                <HiOfficeBuilding className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500 dark:text-gray-400">Tiendas</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {stats.totalStores}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Productos Recientes */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Productos Recientes
              </h2>
              <Link
                to="/products"
                className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400"
              >
                Ver todos
              </Link>
            </div>
            <div className="space-y-4">
              {stats.recentProducts.map((product) => (
                <div
                  key={product.id}
                  className="flex justify-between items-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
                >
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {product.name}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {product.categoryName}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900 dark:text-white">
                      {formatCurrency(product.price)}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {formatDate(product.createdAt)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Enlaces Rápidos */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Acciones Rápidas
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <Link
                to="/products"
                className="flex items-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
              >
                <HiShoppingCart className="h-6 w-6 text-blue-500" />
                <span className="ml-3 font-medium text-blue-900 dark:text-blue-100">
                  Gestionar Productos
                </span>
              </Link>
              
              <Link
                to="/expenses"
                className="flex items-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors"
              >
                <HiCurrencyDollar className="h-6 w-6 text-green-500" />
                <span className="ml-3 font-medium text-green-900 dark:text-green-100">
                  Ver Gastos
                </span>
              </Link>
              
              <Link
                to="/categories"
                className="flex items-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors"
              >
                <HiTag className="h-6 w-6 text-purple-500" />
                <span className="ml-3 font-medium text-purple-900 dark:text-purple-100">
                  Gestionar Categorías
                </span>
              </Link>
              
              <Link
                to="/stores"
                className="flex items-center p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg hover:bg-yellow-100 dark:hover:bg-yellow-900/30 transition-colors"
              >
                <HiOfficeBuilding className="h-6 w-6 text-yellow-500" />
                <span className="ml-3 font-medium text-yellow-900 dark:text-yellow-100">
                  Gestionar Tiendas
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </AuthCheck>
  );
};
