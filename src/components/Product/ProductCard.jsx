import { useState } from 'react';
import { getProductHistory } from '../../services/productService';
import toast from 'react-hot-toast';

export const ProductCard = ({ product, onEdit, onDelete }) => {
  const [showHistory, setShowHistory] = useState(false);
  const [priceHistory, setPriceHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadPriceHistory = async () => {
    if (!showHistory) {
      setLoading(true);
      try {
        const { history, error } = await getProductHistory(product.id);
        if (error) throw new Error(error);
        setPriceHistory(history);
        setShowHistory(true);
      } catch (error) {
        toast.error('Error al cargar el historial de precios: ' + error.message);
      } finally {
        setLoading(false);
      }
    } else {
      setShowHistory(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white">
              {product.name}
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">
              {product.brand}
            </p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-semibold text-gray-900 dark:text-white">
              ${product.price}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              por {product.unit}
            </p>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Categoría</p>
            <p className="mt-1 text-sm text-gray-900 dark:text-white">{product.categoryName}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Tienda</p>
            <p className="mt-1 text-sm text-gray-900 dark:text-white">{product.storeName}</p>
          </div>
        </div>

        {product.notes && (
          <div className="mt-4">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Notas</p>
            <p className="mt-1 text-sm text-gray-900 dark:text-white">{product.notes}</p>
          </div>
        )}

        {showHistory && !loading && (
          <div className="mt-4">
            <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
              Historial de Precios
            </h4>
            <div className="space-y-2">
              {priceHistory.map((record) => (
                <div
                  key={record.id}
                  className="flex justify-between text-sm"
                >
                  <span className="text-gray-500 dark:text-gray-400">
                    {new Date(record.date).toLocaleDateString()}
                  </span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    ${record.price} - {record.store}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      
      <div className="bg-gray-50 dark:bg-gray-700 px-4 py-4 sm:px-6">
        <div className="flex justify-between space-x-3">
          <button
            type="button"
            onClick={loadPriceHistory}
            disabled={loading}
            className="inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-gray-600 dark:text-white dark:border-gray-500 dark:hover:bg-gray-500"
          >
            {loading ? 'Cargando...' : showHistory ? 'Ocultar Historial' : 'Ver Historial'}
          </button>
          <div className="flex space-x-2">
            <button
              type="button"
              onClick={() => onEdit(product)}
              className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Editar
            </button>
            <button
              type="button"
              onClick={() => onDelete(product.id)}
              className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Eliminar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
