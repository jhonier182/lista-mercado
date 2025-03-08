import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  where, 
  getDocs 
} from 'firebase/firestore';
import { auth } from '../config/firebase';
import { db } from '../config/firebase';

export const addStore = async (storeData) => {
  try {
    if (!auth.currentUser) {
      return { id: null, error: "Usuario no autenticado. Por favor, inicia sesión." };
    }
    
    const userId = auth.currentUser.uid;
    const storesRef = collection(db, 'stores');
    const newStore = {
      ...storeData,
      userId,
      createdAt: new Date().toISOString(),
      isActive: true
    };
    
    console.log("Intentando agregar tienda:", newStore);
    const docRef = await addDoc(storesRef, newStore);
    console.log("Tienda agregada con ID:", docRef.id);
    
    return { id: docRef.id, error: null };
  } catch (error) {
    console.error("Error al agregar tienda:", error);
    return { id: null, error: error.message };
  }
};

export const updateStore = async (storeId, storeData) => {
  try {
    if (!auth.currentUser) {
      return { error: "Usuario no autenticado. Por favor, inicia sesión." };
    }
    
    const storeRef = doc(db, 'stores', storeId);
    await updateDoc(storeRef, {
      ...storeData,
      updatedAt: new Date().toISOString()
    });
    return { error: null };
  } catch (error) {
    console.error("Error al actualizar tienda:", error);
    return { error: error.message };
  }
};

export const deleteStore = async (storeId) => {
  try {
    if (!auth.currentUser) {
      return { error: "Usuario no autenticado. Por favor, inicia sesión." };
    }
    
    const storeRef = doc(db, 'stores', storeId);
    await updateDoc(storeRef, { isActive: false });
    return { error: null };
  } catch (error) {
    console.error("Error al eliminar tienda:", error);
    return { error: error.message };
  }
};

export const getStores = async () => {
  try {
    if (!auth.currentUser) {
      return { stores: [], error: "Usuario no autenticado. Por favor, inicia sesión." };
    }
    
    const userId = auth.currentUser.uid;
    const q = query(
      collection(db, 'stores'),
      where('userId', '==', userId),
      where('isActive', '==', true)
    );
    
    console.log("Obteniendo tiendas para el usuario:", userId);
    const querySnapshot = await getDocs(q);
    const stores = [];
    querySnapshot.forEach((doc) => {
      stores.push({ id: doc.id, ...doc.data() });
    });
    console.log("Tiendas obtenidas:", stores.length);
    
    return { stores, error: null };
  } catch (error) {
    console.error("Error al obtener tiendas:", error);
    return { stores: [], error: error.message };
  }
}; 