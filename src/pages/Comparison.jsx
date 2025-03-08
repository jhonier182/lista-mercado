import { useState, useEffect } from 'react';
import { getProducts, getProductHistory } from '../services/productService';

export const Comparison = () => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [priceHistory, setPriceHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      const { products, error } = await getProducts();
      if (error) {
        setError(error);
      } else {
        setProducts(products);
      }
      setLoading(false);
    };

    loadProducts();
  }, []);

  const handleProductSelect = async (productId) => {
    setLoading(true);
    const selectedProduct = products.find(p => p.id === productId);
    setSelectedProduct(selectedProduct);

    const { history, error } = await getProductHistory(productId);
    if (error) {
      setError(error);
    } else {
      setPriceHistory(history);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 dark:text-white">Comparación de Precios</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          Error: {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Selector de Productos */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Selecciona un Producto</h2>
          <div className="space-y-4">
            {products.map((product) => (
              <button
                key={product.id}
                onClick={() => handleProductSelect(product.id)}
                className={`w-full text-left p-4 rounded-lg border transition-colors ${
                  selectedProduct?.id === product.id
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-200 hover:border-primary-300'
                }`}
              >
                <div className="font-medium">{product.name}</div>
                <div className="text-sm text-gray-500">
                  Último precio: ${product.price} - {product.store}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Historial de Precios */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Historial de Precios</h2>
          {selectedProduct ? (
            priceHistory.length > 0 ? (
              <div className="space-y-4">
                {priceHistory.map((record) => (
                  <div
                    key={record.id}
                    className="p-4 border border-gray-200 rounded-lg"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-medium">${record.price}</div>
                        <div className="text-sm text-gray-500">{record.store}</div>
                      </div>
                      <div className="text-sm text-gray-500">
                        {new Date(record.date).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">
                No hay historial de precios para este producto
              </p>
            )
          ) : (
            <p className="text-gray-500 text-center py-4">
              Selecciona un producto para ver su historial de precios
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
