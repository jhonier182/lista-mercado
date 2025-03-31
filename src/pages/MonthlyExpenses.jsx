import { useState, useEffect } from 'react';
import { getMonthlyExpenses, getExpensesByCategory } from '../services/expenseService';
import { AuthCheck } from '../auth/AuthCheck';
import { HiRefresh } from 'react-icons/hi';

export const MonthlyExpenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [categoryExpenses, setCategoryExpenses] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(() => {
    const now = new Date();
    return {
      year: now.getFullYear(),
      month: now.getMonth() + 1
    };
  });

  const loadExpenses = async () => {
    try {
      // Cargar datos en paralelo
      const [expensesResponse, categoryExpensesResponse] = await Promise.all([
        getMonthlyExpenses(selectedDate.year, selectedDate.month),
        getExpensesByCategory(selectedDate.year, selectedDate.month)
      ]);

      if (expensesResponse.error) throw new Error(expensesResponse.error);
      if (categoryExpensesResponse.error) throw new Error(categoryExpensesResponse.error);

      setExpenses(expensesResponse.expenses);
      setTotal(expensesResponse.total);
      setCategoryExpenses(categoryExpensesResponse.categoryExpenses);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Error al cargar gastos:', err);
    }
  };

  useEffect(() => {
    const initialLoad = async () => {
      await loadExpenses();
      setLoading(false);
    };
    initialLoad();

    // Actualizar datos cada 30 segundos
    const interval = setInterval(() => {
      loadExpenses();
    }, 30000);

    return () => clearInterval(interval);
  }, [selectedDate]);

  const handleRefresh = async () => {
    setUpdating(true);
    await loadExpenses();
    setUpdating(false);
  };

  const handleMonthChange = (e) => {
    const [year, month] = e.target.value.split('-');
    setSelectedDate({
      year: parseInt(year),
      month: parseInt(month)
    });
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
            Resumen de Gastos Mensuales
          </h1>
          <div className="flex items-center space-x-4">
            <input
              type="month"
              value={`${selectedDate.year}-${String(selectedDate.month).padStart(2, '0')}`}
              onChange={handleMonthChange}
              className="px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
            <button
              onClick={handleRefresh}
              disabled={updating}
              className={`flex items-center px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 ${
                updating ? 'animate-pulse' : ''
              }`}
            >
              <HiRefresh className={`w-4 h-4 mr-2 ${updating ? 'animate-spin' : ''}`} />
              {updating ? 'Actualizando...' : 'Actualizar'}
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 p-4 mb-6 dark:bg-red-900/20">
            <p className="text-red-700 dark:text-red-400">{error}</p>
          </div>
        )}

        {/* Resumen Total */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            Total del Mes
          </h2>
          <p className="text-4xl font-bold text-primary-600 dark:text-primary-400">
            {formatCurrency(total)}
          </p>
        </div>

        {/* Gastos por Categoría */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Gastos por Categoría
            </h2>
            <div className="space-y-4">
              {categoryExpenses.map((category) => (
                <div
                  key={category.categoryId}
                  className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
                >
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-medium text-gray-900 dark:text-white">
                      {category.categoryName}
                    </h3>
                    <span className="text-primary-600 dark:text-primary-400 font-semibold">
                      {formatCurrency(category.total)}
                    </span>
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {category.items.length} productos
                  </div>
                </div>
              ))}
              {categoryExpenses.length === 0 && (
                <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                  No hay gastos registrados en este mes
                </p>
              )}
            </div>
          </div>

          {/* Lista de Gastos */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Últimos Gastos
            </h2>
            <div className="space-y-4">
              {expenses.map((expense) => (
                <div
                  key={expense.id}
                  className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white">
                        {expense.name}
                      </h3>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        <p>{expense.categoryName}</p>
                        <p>{expense.storeName}</p>
                        <p>{formatDate(expense.createdAt)}</p>
                      </div>
                    </div>
                    <span className="text-primary-600 dark:text-primary-400 font-semibold">
                      {formatCurrency(expense.price)}
                    </span>
                  </div>
                </div>
              ))}
              {expenses.length === 0 && (
                <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                  No hay gastos registrados en este mes
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </AuthCheck>
  );
}; 