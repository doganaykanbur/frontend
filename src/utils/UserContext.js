import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '../../../my-firebase-app/src/firebase'; // Firebase yapılandırması ve auth nesnesini import et
import { onAuthStateChanged, signOut } from 'firebase/auth';

const UserContext = createContext();

export const useUser = () => {
  return useContext(UserContext);
};

export const UserProvider = ({ children }) => {
  const [email, setEmail] = useState('');
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Kullanıcı verisi almak için Firebase Auth dinleyicisi
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setEmail(user.email); // Firebase user objesindeki email'i al
        setToken(user.accessToken); // Firebase'den alınan token
      } else {
        setEmail('');
        setToken(null);
      }
      setLoading(false);
    });

    // Temizlik işlemi
    return () => unsubscribe();
  }, []);

  const logout = () => {
    signOut(auth)
      .then(() => {
        setToken(null);
        setEmail('');
        localStorage.removeItem('jwtToken');
        window.location.replace('/Login');
      })
      .catch((error) => {
        setError('Çıkış işlemi sırasında hata oluştu: ' + error.message);
      });
  };

  return (
    <UserContext.Provider value={{ email, token, logout, loading, error }}>
      {children}
    </UserContext.Provider>
  );
};
