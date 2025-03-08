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
    const userId = auth.currentUser.uid;
    const storesRef = collection(db, 'stores');
    const newStore = {
      ...storeData,
      userId,
      createdAt: new Date().toISOString(),
      isActive: true
    };
    const docRef = await addDoc(storesRef, newStore);
    return { id: docRef.id, error: null };
  } catch (error) {
    return { id: null, error: error.message };
  }
};

export const updateStore = async (storeId, storeData) => {
  try {
    const storeRef = doc(db, 'stores', storeId);
    await updateDoc(storeRef, {
      ...storeData,
      updatedAt: new Date().toISOString()
    });
    return { error: null };
  } catch (error) {
    return { error: error.message };
  }
};

export const deleteStore = async (storeId) => {
  try {
    const storeRef = doc(db, 'stores', storeId);
    await updateDoc(storeRef, { isActive: false });
    return { error: null };
  } catch (error) {
    return { error: error.message };
  }
};

export const getStores = async () => {
  try {
    const userId = auth.currentUser.uid;
    const q = query(
      collection(db, 'stores'),
      where('userId', '==', userId),
      where('isActive', '==', true)
    );
    
    const querySnapshot = await getDocs(q);
    const stores = [];
    querySnapshot.forEach((doc) => {
      stores.push({ id: doc.id, ...doc.data() });
    });
    return { stores, error: null };
  } catch (error) {
    return { stores: [], error: error.message };
  }
}; 