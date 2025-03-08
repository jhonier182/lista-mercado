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
    const userId = auth.currentUser.uid;
    const categoriesRef = collection(db, 'categories');
    const newCategory = {
      ...categoryData,
      userId,
      createdAt: new Date().toISOString(),
      isActive: true
    };
    const docRef = await addDoc(categoriesRef, newCategory);
    return { id: docRef.id, error: null };
  } catch (error) {
    return { id: null, error: error.message };
  }
};

export const updateCategory = async (categoryId, categoryData) => {
  try {
    const categoryRef = doc(db, 'categories', categoryId);
    await updateDoc(categoryRef, {
      ...categoryData,
      updatedAt: new Date().toISOString()
    });
    return { error: null };
  } catch (error) {
    return { error: error.message };
  }
};

export const deleteCategory = async (categoryId) => {
  try {
    const categoryRef = doc(db, 'categories', categoryId);
    await updateDoc(categoryRef, { isActive: false });
    return { error: null };
  } catch (error) {
    return { error: error.message };
  }
};

export const getCategories = async () => {
  try {
    const userId = auth.currentUser.uid;
    const q = query(
      collection(db, 'categories'),
      where('userId', '==', userId),
      where('isActive', '==', true)
    );
    
    const querySnapshot = await getDocs(q);
    const categories = [];
    querySnapshot.forEach((doc) => {
      categories.push({ id: doc.id, ...doc.data() });
    });
    return { categories, error: null };
  } catch (error) {
    return { categories: [], error: error.message };
  }
}; 