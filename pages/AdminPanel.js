import React, { useState } from 'react';
import Modal from './AddPart';  
import UpdatePriceModal from './UpdatePriceModal';

import styles from '../public/assets/admin.module.css';
import { useRouter } from 'next/router';  // Router'ı doğru şekilde import edin
import { auth } from '../../my-firebase-app/src/firebase';  // Firebase Auth importu
import { signOut } from 'firebase/auth';  // Firebase signOut fonksiyonu
import { useUser } from '../src/utils/UserContext';  // Kullanıcı Context'i

const AdminPanel = () => {
  const [showModal, setShowModal] = useState(false);
  const [showUpdatePriceModal, setShowUpdatePriceModal] = useState(false);
  const { email, logout } = useUser();  // `username` yerine `email` kullanalım

  const router = useRouter();  // `useRouter`'ı burada tanımlayın

  const handleAddPartClick = () => {
    if (showModal) {
      setShowModal(false);
    } else {
      setShowModal(true);
      setShowUpdatePriceModal(false);
    }
  };

  const handleEditPartClick = () => {
    if (showUpdatePriceModal) {
      setShowUpdatePriceModal(false);
    } else {
      setShowUpdatePriceModal(true);
      setShowModal(false);
    }
  };

  const handleBuildPcClick = () => {
    window.location.replace('/BuildPanel');
  };

  const handleUserBuildsClick = () => {
    window.location.replace('/UserBuilds');
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);  // Firebase ile çıkış yap
      logout();  // Kullanıcı context'ini temizle
      router.push('/Login');  // Login sayfasına yönlendir
    } catch (error) {
      console.error('Logout error:', error.message);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.navbar}>
        <img src="/assets/logo.png" alt="Logo" />
        <h2>Admin Panel</h2>
        <div className={styles.userInfo}>
          <span>{email ? `Welcome, ${email}` : 'Guest'}</span> {/* Burada email'i göstereceğiz */}
          <button onClick={handleLogout} className={styles.logoutButton}>Logout</button>
        </div>
      </div>

      <div className={styles.buttonContainer}>
        <button
          className={styles.addPartButton}
          onClick={handleAddPartClick}
        >
          Add Part
        </button>

        <button
          className={styles.EditPartButton}
          onClick={handleEditPartClick}
        >
          Edit Part
        </button>

        <button
          className={styles.BuildPcButton}
          onClick={handleBuildPcClick}
        >
          Build PC
        </button>
        <button
          className={styles.UserBuildsButton}
          onClick={handleUserBuildsClick}
        >
          User Builds
        </button>
      </div>

      {showModal && (
        <Modal setShowModal={setShowModal} />
      )}

      {showUpdatePriceModal && (
        <UpdatePriceModal
          setShowUpdatePriceModal={setShowUpdatePriceModal}
        />
      )}
    </div>
  );
};

export default AdminPanel;