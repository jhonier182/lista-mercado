import { useState, useEffect } from 'react';
import { getProductPriceComparison } from '../services/priceComparisonService';
import { AuthCheck } from '../auth/AuthCheck';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export const PriceComparison = () => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [monthsToCompare, setMonthsToCompare] = useState(3);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadProducts();
  }, [monthsToCompare]);

  const loadProducts = async () => {
    setLoading(true);
    setError(null);

    try {
      const { products, error } = await getProductPriceComparison(monthsToCompare);
      if (error) {
        setError(error);
        return;
      }
      setProducts(products);
      if (products.length > 0 && !selectedProduct) {
        setSelectedProduct(products[0]);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

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

  const getChartData = (product) => {
    if (!product) return null;

    const data = {
      labels: product.priceHistory.map(h => formatDate(h.date)),
      datasets: [
        {
          label: 'Precio',
          data: product.priceHistory.map(h => h.price),
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.1
        }
      ]
    };

    return data;
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Historial de Precios'
      }
    },
    scales: {
      y: {
        beginAtZero: false,
        ticks: {
          callback: (value) => formatCurrency(value)
        }
      }
    }
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
            Comparación de Precios
          </h1>
          <select
            value={monthsToCompare}
            onChange={(e) => setMonthsToCompare(Number(e.target.value))}
            className="px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            <option value={3}>Últimos 3 meses</option>
            <option value={6}>Últimos 6 meses</option>
            <option value={12}>Último año</option>
          </select>
        </div>

        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 p-4 mb-6 dark:bg-red-900/20">
            <p className="text-red-700 dark:text-red-400">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Lista de Productos */}
          <div className="md:col-span-1 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Productos
            </h2>
            <div className="space-y-4 max-h-[600px] overflow-y-auto">
              {products.map((product) => (
                <button
                  key={product.id}
                  onClick={() => setSelectedProduct(product)}
                  className={`w-full text-left p-4 rounded-lg border transition-colors ${
                    selectedProduct?.id === product.id
                      ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-primary-300'
                  }`}
                >
                  <div className="font-medium text-gray-900 dark:text-white">
                    {product.name}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {product.categoryName}
                  </div>
                  <div className={`text-sm font-medium ${
                    product.percentageChange > 0 
                      ? 'text-red-600 dark:text-red-400'
                      : product.percentageChange < 0
                        ? 'text-green-600 dark:text-green-400'
                        : 'text-gray-600 dark:text-gray-400'
                  }`}>
                    {product.percentageChange > 0 ? '↑' : product.percentageChange < 0 ? '↓' : '='} 
                    {Math.abs(product.percentageChange).toFixed(2)}%
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Detalles y Gráfico */}
          <div className="md:col-span-2 space-y-6">
            {selectedProduct ? (
              <>
                {/* Tarjeta de Información */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    {selectedProduct.name}
                  </h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        Precio Actual
                      </div>
                      <div className="text-lg font-semibold text-gray-900 dark:text-white">
                        {formatCurrency(selectedProduct.currentPrice)}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        Precio más bajo
                      </div>
                      <div className="text-lg font-semibold text-green-600 dark:text-green-400">
                        {formatCurrency(selectedProduct.lowestPrice)}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        Precio más alto
                      </div>
                      <div className="text-lg font-semibold text-red-600 dark:text-red-400">
                        {formatCurrency(selectedProduct.highestPrice)}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        Variación
                      </div>
                      <div className={`text-lg font-semibold ${
                        selectedProduct.percentageChange > 0 
                          ? 'text-red-600 dark:text-red-400'
                          : 'text-green-600 dark:text-green-400'
                      }`}>
                        {selectedProduct.percentageChange > 0 ? '+' : ''}
                        {selectedProduct.percentageChange.toFixed(2)}%
                      </div>
                    </div>
                  </div>
                </div>

                {/* Gráfico */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                  <div className="h-[400px]">
                    {getChartData(selectedProduct) && (
                      <Line data={getChartData(selectedProduct)} options={chartOptions} />
                    )}
                  </div>
                </div>
              </>
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 text-center">
                <p className="text-gray-500 dark:text-gray-400">
                  Selecciona un producto para ver sus detalles
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </AuthCheck>
  );
}; 