import { 
  collection, 
  query, 
  where, 
  getDocs
} from 'firebase/firestore';
import { auth, db } from '../config/firebase';

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
    
    // Consulta simple sin ordenamiento
    const q = query(
      collection(db, 'products'),
      where('userId', '==', userId)
    );

    const querySnapshot = await getDocs(q);
    const expenses = [];
    let total = 0;

    // Filtramos y ordenamos en memoria
    const startDate = new Date(year, month - 1, 1).toISOString();
    const endDate = new Date(year, month, 0).toISOString();

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      if (data.isActive && data.createdAt >= startDate && data.createdAt <= endDate) {
        const expense = {
          id: doc.id,
          ...data
        };
        expenses.push(expense);
        total += parseFloat(data.price) || 0;
      }
    });

    // Ordenar por fecha de creación descendente
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