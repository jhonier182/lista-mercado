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
    const userId = auth.currentUser.uid;
    const productsRef = collection(db, 'products');
    const newProduct = {
      ...productData,
      userId,
      createdAt: new Date().toISOString(),
      isActive: true
    };
    const docRef = await addDoc(productsRef, newProduct);
    return { id: docRef.id, error: null };
  } catch (error) {
    return { id: null, error: error.message };
  }
};

export const updateProduct = async (productId, productData) => {
  try {
    const productRef = doc(db, 'products', productId);
    await updateDoc(productRef, {
      ...productData,
      updatedAt: new Date().toISOString()
    });
    return { error: null };
  } catch (error) {
    return { error: error.message };
  }
};

export const deleteProduct = async (productId) => {
  try {
    const productRef = doc(db, 'products', productId);
    await updateDoc(productRef, { isActive: false });
    return { error: null };
  } catch (error) {
    return { error: error.message };
  }
};

export const getProducts = async (filters = {}) => {
  try {
    const userId = auth.currentUser.uid;
    let q = query(
      collection(db, 'products'),
      where('userId', '==', userId),
      where('isActive', '==', true)
    );

    if (filters.category) {
      q = query(q, where('category', '==', filters.category));
    }
    if (filters.store) {
      q = query(q, where('store', '==', filters.store));
    }
    if (filters.orderBy) {
      q = query(q, orderBy(filters.orderBy.field, filters.orderBy.direction));
    }

    const querySnapshot = await getDocs(q);
    const products = [];
    querySnapshot.forEach((doc) => {
      products.push({ id: doc.id, ...doc.data() });
    });
    return { products, error: null };
  } catch (error) {
    return { products: [], error: error.message };
  }
};

export const getProductHistory = async (productId) => {
  try {
    const historyRef = collection(db, 'products', productId, 'priceHistory');
    const q = query(historyRef, orderBy('date', 'desc'));
    const querySnapshot = await getDocs(q);
    const history = [];
    querySnapshot.forEach((doc) => {
      history.push({ id: doc.id, ...doc.data() });
    });
    return { history, error: null };
  } catch (error) {
    return { history: [], error: error.message };
  }
};

export const addPriceToHistory = async (productId, price, store, date = new Date()) => {
  try {
    const historyRef = collection(db, 'products', productId, 'priceHistory');
    await addDoc(historyRef, {
      price,
      store,
      date: date.toISOString()
    });
    return { error: null };
  } catch (error) {
    return { error: error.message };
  }
};
