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

export const addCategory = async (categoryData) => {
  try {
    if (!auth.currentUser) {
      return { id: null, error: "Usuario no autenticado. Por favor, inicia sesión." };
    }
    
    const userId = auth.currentUser.uid;
    const categoriesRef = collection(db, 'categories');
    const newCategory = {
      ...categoryData,
      userId,
      createdAt: new Date().toISOString(),
      isActive: true
    };
    
    console.log("Intentando agregar categoría:", newCategory);
    const docRef = await addDoc(categoriesRef, newCategory);
    console.log("Categoría agregada con ID:", docRef.id);
    
    return { id: docRef.id, error: null };
  } catch (error) {
    console.error("Error al agregar categoría:", error);
    return { id: null, error: error.message };
  }
};

export const updateCategory = async (categoryId, categoryData) => {
  try {
    if (!auth.currentUser) {
      return { error: "Usuario no autenticado. Por favor, inicia sesión." };
    }
    
    const categoryRef = doc(db, 'categories', categoryId);
    await updateDoc(categoryRef, {
      ...categoryData,
      updatedAt: new Date().toISOString()
    });
    return { error: null };
  } catch (error) {
    console.error("Error al actualizar categoría:", error);
    return { error: error.message };
  }
};

export const deleteCategory = async (categoryId) => {
  try {
    if (!auth.currentUser) {
      return { error: "Usuario no autenticado. Por favor, inicia sesión." };
    }
    
    const categoryRef = doc(db, 'categories', categoryId);
    await updateDoc(categoryRef, { isActive: false });
    return { error: null };
  } catch (error) {
    console.error("Error al eliminar categoría:", error);
    return { error: error.message };
  }
};

export const getCategories = async () => {
  try {
    if (!auth.currentUser) {
      return { categories: [], error: "Usuario no autenticado. Por favor, inicia sesión." };
    }
    
    const userId = auth.currentUser.uid;
    const q = query(
      collection(db, 'categories'),
      where('userId', '==', userId),
      where('isActive', '==', true)
    );
    
    console.log("Obteniendo categorías para el usuario:", userId);
    const querySnapshot = await getDocs(q);
    const categories = [];
    querySnapshot.forEach((doc) => {
      categories.push({ id: doc.id, ...doc.data() });
    });
    console.log("Categorías obtenidas:", categories.length);
    
    return { categories, error: null };
  } catch (error) {
    console.error("Error al obtener categorías:", error);
    return { categories: [], error: error.message };
  }
}; 