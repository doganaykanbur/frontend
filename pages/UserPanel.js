import React, { useEffect, useState } from 'react';
import UpdatePriceModal from './UpdatePriceModal';
import styles from '../public/assets/userpanel.module.css';
import { useRouter } from 'next/router';
import { auth } from '../src/utils/firebase';  // Firebase Auth importu
import { signOut } from 'firebase/auth';  // Firebase signOut fonksiyonu
import { useUser } from '../src/utils/UserContext';  // Kullanıcı Context'i

const UserPanel = () => {
  const [showModal, setShowModal] = useState(false);
  const [showUpdatePriceModal, setShowUpdatePriceModal] = useState(false);

  const { email, logout } = useUser();  // `username` yerine `email` kullanalım
  const router = useRouter();

  // Token kontrolü ve login yönlendirmesi
  useEffect(() => {
    const user = auth.currentUser;  // Firebase Auth ile oturum açmış kullanıcıyı al
    if (!user) {
      router.replace('/Login');  // Kullanıcı oturum açmamışsa Login sayfasına yönlendir
    }
  }, [router]);  // Bu efekt yalnızca kullanıcı verisi değiştiğinde çalışır

  const handleBuildPcClick = () => {
    // Build PC sayfasına yönlendirme
    router.push('/BuildPanel');
  };

  const handleMyBuildsPcClick = () => {
    // Kullanıcının Build geçmişi sayfasına yönlendirme
    router.push('/MyBuilds');
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);  // Firebase ile çıkış yap
      logout();  // Kullanıcı context'ini temizle
      router.replace('/Login');  // Login sayfasına yönlendir
    } catch (error) {
      console.error('Logout error:', error.message);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.navbar}>
        <img src="/assets/logo.png" alt="Logo" />
        <h2>User Menu</h2>
        <div className={styles.userInfo}>
          <span>{email ? `Welcome, ${email}` : 'Guest'}</span> {/* Burada email'i göstereceğiz */}
          <button onClick={handleLogout} className={styles.logoutButton}>Logout</button>
        </div>
      </div>

      <div className={styles.buttonContainer}>
        <button
          className={styles.BuildPcButton}
          onClick={handleBuildPcClick}
        >
          Build PC
        </button>

        <button
          className={styles.BuildPcButton}
          onClick={handleMyBuildsPcClick}
        >
          MY Builds
        </button>
      </div>

      {showModal && (
        <Modal setShowModal={setShowModal}>
        </Modal>
      )}

      {showUpdatePriceModal && (
        <UpdatePriceModal
          setShowUpdatePriceModal={setShowUpdatePriceModal}
        />
      )}
    </div>
  );
};

export default UserPanel;