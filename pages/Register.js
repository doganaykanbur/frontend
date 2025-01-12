import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { auth } from '../../my-firebase-app/src/firebase';  // Firebase auth import
import { createUserWithEmailAndPassword } from 'firebase/auth';  // Firebase createUser fonksiyonu
import styles from '../public/assets/register.module.css';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const router = useRouter();

  // E-posta formatı kontrol fonksiyonu
  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(''); // Hata mesajını sıfırlıyoruz
    setSuccessMessage(''); // Başarı mesajını sıfırlıyoruz

    // Boş alanları kontrol et
    if (!email || !password) {
      setError('Tüm alanlar zorunludur.');
      return;
    }

    // E-posta formatını kontrol et
    if (!validateEmail(email)) {
      setError('Geçersiz e-posta formatı.');
      return;
    }

    // Şifre uzunluğunu kontrol et
    if (password.length < 6) {
      setError('Şifre en az 6 karakter uzunluğunda olmalıdır.');
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log('Kayıt başarılı!', user);

      // Başarı mesajını göster
      setSuccessMessage('Kayıt başarılı! Giriş yapmak için lütfen login sayfasına gidin.');
      
      // Login sayfasına yönlendir
      setTimeout(() => {
        router.push('/Login');
      }, 2000); // 2 saniye sonra yönlendiriyoruz

    } catch (error) {
      console.error('Kayıt Hatası:', error.message);
      setError('Kayıt sırasında bir hata oluştu. Lütfen tekrar deneyin.');
    }
  };

  return (
    <div className={styles.container}>
      <nav className={styles.navbar}>
        <img src="/assets/logo.png" alt="Logo" />
        <h2>WELCOME</h2>
      </nav>
      <div className={styles.formContainer}>
        <form onSubmit={handleRegister} className={styles.form}>
          <h1>Register</h1>

          {/* Başarı mesajı */}
          {successMessage && <p className={styles.success}>{successMessage}</p>}

          {/* Hata mesajı */}
          {error && <p className={styles.error}>{error}</p>}

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={styles.input}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={styles.input}
          />
          <button type="submit" className={styles.button}>Register</button>
        </form>

        {/* Already have an account? */}
        <div className={styles.registerLink}>
          <span>Already have an account? </span>
          <span
            onClick={() => router.push('/Login')}
            className={styles.linkText}
          >
            Login
          </span>
        </div>
      </div>
    </div>
  );
};

export default Register;