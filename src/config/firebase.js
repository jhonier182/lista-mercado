import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyCI2PVF9tJhHxqXpqiFOQ058j24atfADl4",
  authDomain: "lista-productos-aded5.firebaseapp.com",
  projectId: "lista-productos-aded5",
  storageBucket: "lista-productos-aded5.appspot.com",
  messagingSenderId: "373366774995",
  appId: "1:373366774995:web:06269290345ec536284826"
};

// Inicializar la aplicación de Firebase
const app = initializeApp(firebaseConfig);

// Inicializar servicios de Firebase
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app; 