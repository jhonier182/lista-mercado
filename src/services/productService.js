import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  where, 
  getDocs,
  orderBy 
} from 'firebase/firestore';
import { auth } from '../config/firebase';
import { db } from '../config/firebase';

export const addProduct = async (productData) => {
  try {
    if (!auth.currentUser) {
      console.error("Error: Usuario no autenticado");
      return { id: null, error: "Usuario no autenticado. Por favor, inicia sesión." };
    }
    
    // Validar datos requeridos
    if (!productData.name || !productData.name.trim()) {
      return { id: null, error: "El nombre del producto es requerido" };
    }
    
    if (!productData.price || isNaN(productData.price) || productData.price <= 0) {
      return { id: null, error: "El precio debe ser un número mayor que cero" };
    }
    
    if (!productData.storeId) {
      return { id: null, error: "La tienda es requerida" };
    }
    
    if (!productData.categoryId) {
      return { id: null, error: "La categoría es requerida" };
    }
    
    const userId = auth.currentUser.uid;
    const productsRef = collection(db, 'products');
    const newProduct = {
      ...productData,
      userId,
      createdAt: new Date().toISOString(),
      isActive: true
    };
    
    console.log("Intentando agregar producto:", newProduct);
    const docRef = await addDoc(productsRef, newProduct);
    console.log("Producto agregado con ID:", docRef.id);
    
    // Agregar el precio al historial
    if (productData.price) {
      await addPriceToHistory(
        docRef.id, 
        productData.price, 
        productData.storeName || 'Tienda no especificada'
      );
    }
    
    return { id: docRef.id, error: null };
  } catch (error) {
    console.error("Error al agregar producto:", error);
    return { id: null, error: error.message };
  }
};

export const updateProduct = async (productId, productData) => {
  try {
    if (!auth.currentUser) {
      console.error("Error: Usuario no autenticado");
      return { error: "Usuario no autenticado. Por favor, inicia sesión." };
    }
    
    if (!productId) {
      return { error: "ID de producto no válido" };
    }
    
    // Validar datos requeridos
    if (!productData.name || !productData.name.trim()) {
      return { error: "El nombre del producto es requerido" };
    }
    
    if (!productData.price || isNaN(productData.price) || productData.price <= 0) {
      return { error: "El precio debe ser un número mayor que cero" };
    }
    
    if (!productData.storeId) {
      return { error: "La tienda es requerida" };
    }
    
    if (!productData.categoryId) {
      return { error: "La categoría es requerida" };
    }
    
    const productRef = doc(db, 'products', productId);
    await updateDoc(productRef, {
      ...productData,
      updatedAt: new Date().toISOString()
    });
    
    // Agregar el precio al historial si ha cambiado
    if (productData.price) {
      await addPriceToHistory(
        productId, 
        productData.price, 
        productData.storeName || 'Tienda no especificada'
      );
    }
    
    return { error: null };
  } catch (error) {
    console.error("Error al actualizar producto:", error);
    return { error: error.message };
  }
};

export const deleteProduct = async (productId) => {
  try {
    if (!auth.currentUser) {
      console.error("Error: Usuario no autenticado");
      return { error: "Usuario no autenticado. Por favor, inicia sesión." };
    }
    
    if (!productId) {
      return { error: "ID de producto no válido" };
    }
    
    const productRef = doc(db, 'products', productId);
    await updateDoc(productRef, { isActive: false });
    return { error: null };
  } catch (error) {
    console.error("Error al eliminar producto:", error);
    return { error: error.message };
  }
};

export const getProducts = async (filters = {}) => {
  try {
    if (!auth.currentUser) {
      console.error("Error: Usuario no autenticado");
      return { products: [], error: "Usuario no autenticado. Por favor, inicia sesión." };
    }
    
    const userId = auth.currentUser.uid;
    
    // Construir la consulta base - SOLO con filtros básicos, sin ordenamiento
    let queryConstraints = [
      where('userId', '==', userId),
      where('isActive', '==', true)
    ];
    
    // Agregar filtros adicionales si existen
    if (filters.category) {
      queryConstraints.push(where('categoryId', '==', filters.category));
    }
    if (filters.store) {
      queryConstraints.push(where('storeId', '==', filters.store));
    }
    
    // Crear la consulta básica sin ordenamiento
    let q = query(collection(db, 'products'), ...queryConstraints);
    
    console.log("Obteniendo productos para el usuario:", userId);
    const querySnapshot = await getDocs(q);
    const products = [];
    querySnapshot.forEach((doc) => {
      products.push({ id: doc.id, ...doc.data() });
    });
    console.log("Productos obtenidos:", products.length);
    
    // Aplicar ordenamiento en el cliente
    if (filters.orderBy) {
      console.log("Aplicando ordenamiento en el cliente:", filters.orderBy);
      products.sort((a, b) => {
        const fieldA = a[filters.orderBy.field];
        const fieldB = b[filters.orderBy.field];
        
        // Manejar valores nulos o indefinidos
        if (!fieldA && fieldB) return filters.orderBy.direction === 'asc' ? -1 : 1;
        if (fieldA && !fieldB) return filters.orderBy.direction === 'asc' ? 1 : -1;
        if (!fieldA && !fieldB) return 0;
        
        // Comparar fechas si los campos son strings de fecha
        if (typeof fieldA === 'string' && (fieldA.includes('T') || fieldA.includes('-'))) {
          const dateA = new Date(fieldA);
          const dateB = new Date(fieldB);
          if (!isNaN(dateA) && !isNaN(dateB)) {
            return filters.orderBy.direction === 'asc' 
              ? dateA.getTime() - dateB.getTime() 
              : dateB.getTime() - dateA.getTime();
          }
        }
        
        // Comparación estándar para otros tipos de datos
        if (fieldA < fieldB) {
          return filters.orderBy.direction === 'asc' ? -1 : 1;
        }
        if (fieldA > fieldB) {
          return filters.orderBy.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    
    return { products, error: null };
  } catch (error) {
    console.error("Error al obtener productos:", error);
    return { products: [], error: error.message };
  }
};

export const getProductHistory = async (productId) => {
  try {
    if (!auth.currentUser) {
      console.error("Error: Usuario no autenticado");
      return { history: [], error: "Usuario no autenticado. Por favor, inicia sesión." };
    }
    
    if (!productId) {
      return { history: [], error: "ID de producto no válido" };
    }
    
    const historyRef = collection(db, 'products', productId, 'priceHistory');
    const q = query(historyRef, orderBy('date', 'desc'));
    
    console.log("Obteniendo historial para el producto:", productId);
    const querySnapshot = await getDocs(q);
    const history = [];
    querySnapshot.forEach((doc) => {
      history.push({ id: doc.id, ...doc.data() });
    });
    console.log("Historial obtenido:", history.length, "registros");
    
    return { history, error: null };
  } catch (error) {
    console.error("Error al obtener historial de precios:", error);
    return { history: [], error: error.message };
  }
};

export const addPriceToHistory = async (productId, price, store, date = new Date()) => {
  try {
    if (!auth.currentUser) {
      console.error("Error: Usuario no autenticado");
      return { error: "Usuario no autenticado. Por favor, inicia sesión." };
    }
    
    if (!productId) {
      return { error: "ID de producto no válido" };
    }
    
    if (!price || isNaN(price) || price <= 0) {
      return { error: "Precio no válido" };
    }
    
    const historyRef = collection(db, 'products', productId, 'priceHistory');
    const historyData = {
      price,
      store: store || 'Tienda no especificada',
      date: date.toISOString()
    };
    
    console.log("Agregando precio al historial:", historyData);
    await addDoc(historyRef, historyData);
    console.log("Precio agregado al historial correctamente");
    
    return { error: null };
  } catch (error) {
    console.error("Error al agregar precio al historial:", error);
    return { error: error.message };
  }
};
