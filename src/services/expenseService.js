import { 
  collection, 
  query, 
  where, 
  getDocs,
  doc,
  getDoc
} from 'firebase/firestore';
import { auth, db } from '../config/firebase';

const getStartAndEndDates = (year, month) => {
  // Crear fecha de inicio (primer día del mes a las 00:00:00)
  const startDate = new Date(year, month - 1, 1);
  startDate.setHours(0, 0, 0, 0);

  // Crear fecha de fin (primer día del siguiente mes a las 00:00:00)
  const endDate = new Date(year, month, 1);
  endDate.setHours(0, 0, 0, 0);

  return {
    startDate: startDate.toISOString(),
    endDate: endDate.toISOString()
  };
};

export const getMonthlyExpenses = async (year, month) => {
  try {
    if (!auth.currentUser) {
      return { 
        expenses: [], 
        total: 0, 
        error: "Usuario no autenticado. Por favor, inicia sesión." 
      };
    }

    const userId = auth.currentUser.uid;
    const { startDate, endDate } = getStartAndEndDates(year, month);
    
    // Consulta básica solo por userId
    const q = query(
      collection(db, 'products'),
      where('userId', '==', userId)
    );

    const querySnapshot = await getDocs(q);
    const expenses = [];
    let total = 0;

    // Procesamiento y filtrado en memoria
    for (const docSnapshot of querySnapshot.docs) {
      const data = docSnapshot.data();
      
      // Verificar si el producto está dentro del mes seleccionado y está activo
      if (data.isActive && data.createdAt >= startDate && data.createdAt < endDate) {
        // Obtener detalles de la categoría
        let categoryName = 'Sin categoría';
        if (data.categoryId) {
          const categoryDoc = await getDoc(doc(db, 'categories', data.categoryId));
          if (categoryDoc.exists()) {
            categoryName = categoryDoc.data().name;
          }
        }

        // Obtener detalles de la tienda
        let storeName = 'Sin tienda';
        if (data.storeId) {
          const storeDoc = await getDoc(doc(db, 'stores', data.storeId));
          if (storeDoc.exists()) {
            storeName = storeDoc.data().name;
          }
        }

        const expense = {
          id: docSnapshot.id,
          ...data,
          categoryName,
          storeName
        };

        expenses.push(expense);
        total += parseFloat(data.price) || 0;
      }
    }

    // Ordenar por fecha de creación descendente en memoria
    expenses.sort((a, b) => b.createdAt.localeCompare(a.createdAt));

    return { 
      expenses, 
      total,
      error: null 
    };
  } catch (error) {
    console.error("Error al obtener gastos mensuales:", error);
    return { 
      expenses: [], 
      total: 0,
      error: error.message 
    };
  }
};

export const getExpensesByCategory = async (year, month) => {
  try {
    const { expenses, error } = await getMonthlyExpenses(year, month);
    if (error) return { categoryExpenses: [], error };

    const categoryExpenses = expenses.reduce((acc, expense) => {
      const categoryId = expense.categoryId || 'uncategorized';
      const categoryName = expense.categoryName || 'Sin categoría';
      
      if (!acc[categoryId]) {
        acc[categoryId] = {
          categoryId,
          categoryName,
          total: 0,
          items: []
        };
      }
      
      acc[categoryId].total += parseFloat(expense.price) || 0;
      acc[categoryId].items.push(expense);
      return acc;
    }, {});

    // Ordenar las categorías por total de gastos
    const sortedCategoryExpenses = Object.values(categoryExpenses)
      .sort((a, b) => b.total - a.total);

    return { 
      categoryExpenses: sortedCategoryExpenses,
      error: null 
    };
  } catch (error) {
    console.error("Error al obtener gastos por categoría:", error);
    return { 
      categoryExpenses: [],
      error: error.message 
    };
  }
}; 