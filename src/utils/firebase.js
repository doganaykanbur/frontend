import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';  // Firebase Auth import

// Firebase konfigürasyon bilgileri
const firebaseConfig = {
  apiKey: "AIzaSyA5LY_LnyVwDUE-G90FGuSbW18VCLTB3WQ",
  authDomain: "pc-part-picker-f2e9e.firebaseapp.com",
  projectId: "pc-part-picker-f2e9e",
  storageBucket: "pc-part-picker-f2e9e.firebasestorage.app",
  messagingSenderId: "1007102313170",
  appId: "1:1007102313170:web:5b0bd826b26002e109e30b",
  measurementId: "G-WKVK9PLXY8"
};

// Firebase uygulamasını başlat
const app = initializeApp(firebaseConfig);

// Firebase Auth nesnesini al
const auth = getAuth(app);

export { auth };  // auth nesnesini dışa aktar