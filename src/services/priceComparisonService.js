import { 
  collection, 
  query, 
  where, 
  getDocs,
  orderBy
} from 'firebase/firestore';
import { auth, db } from '../config/firebase';

export const getProductPriceComparison = async (months = 3) => {
  try {
    if (!auth.currentUser) {
      return { 
        products: [], 
        error: "Usuario no autenticado. Por favor, inicia sesión." 
      };
    }

    const userId = auth.currentUser.uid;
    const endDate = new Date();
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - months);

    const q = query(
      collection(db, 'products'),
      where('userId', '==', userId),
      where('isActive', '==', true)
    );

    const querySnapshot = await getDocs(q);
    const productsMap = new Map();

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const key = `${data.name}-${data.categoryId}`;
      
      if (!productsMap.has(key)) {
        productsMap.set(key, {
          id: doc.id,
          name: data.name,
          categoryId: data.categoryId,
          categoryName: data.categoryName,
          currentPrice: parseFloat(data.price) || 0,
          priceHistory: [],
          priceChange: 0,
          percentageChange: 0,
          lowestPrice: parseFloat(data.price) || 0,
          highestPrice: parseFloat(data.price) || 0,
          storeName: data.storeName
        });
      }

      const product = productsMap.get(key);
      const price = parseFloat(data.price) || 0;
      const date = new Date(data.createdAt);

      if (date >= startDate && date <= endDate) {
        product.priceHistory.push({
          price,
          date: data.createdAt,
          storeName: data.storeName
        });

        // Actualizar precios máximos y mínimos
        product.lowestPrice = Math.min(product.lowestPrice, price);
        product.highestPrice = Math.max(product.highestPrice, price);
      }
    });

    // Calcular cambios de precio y ordenar el historial
    const products = Array.from(productsMap.values()).map(product => {
      product.priceHistory.sort((a, b) => new Date(b.date) - new Date(a.date));
      
      if (product.priceHistory.length > 1) {
        const oldestPrice = product.priceHistory[product.priceHistory.length - 1].price;
        product.priceChange = product.currentPrice - oldestPrice;
        product.percentageChange = (product.priceChange / oldestPrice) * 100;
      }

      return product;
    });

    // Ordenar productos por porcentaje de cambio
    products.sort((a, b) => Math.abs(b.percentageChange) - Math.abs(a.percentageChange));

    return { 
      products,
      error: null 
    };
  } catch (error) {
    console.error("Error al obtener comparación de precios:", error);
    return { 
      products: [],
      error: error.message 
    };
  }
}; 