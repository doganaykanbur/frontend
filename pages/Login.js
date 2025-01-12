import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { auth } from '../src/utils/firebase';  // Firebase auth'ı import ediyoruz
import { signInWithEmailAndPassword } from 'firebase/auth';
import styles from '../public/assets/register.module.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false); // Yükleniyor durumu
  const [errorMessage, setErrorMessage] = useState(''); // Hata mesajı
  const router = useRouter();
 


  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true); // Giriş işlemi başladığında loading durumunu true yap
    setErrorMessage(''); // Hata mesajını sıfırla
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password); 
      const user = userCredential.user;
      console.log('Login successful!', user);

     

      // Admin kullanıcıyı kontrol et
      if (user.email === 'admin@gmail.com') {
        router.push('/AdminPanel');
      } else {
        router.push('/UserPanel');
      }
    } catch (error) {
      console.error('Login error:', error.message);
      setErrorMessage('Giriş yaparken hata oluştu: ' + error.message); // Hata mesajını state'e kaydet
    } finally {
      setLoading(false); // İşlem tamamlandığında loading durumunu false yap
    }
  };

  const handleRegisterClick = () => {
    router.push('/Register');
  };

  return (
    <div className={styles.container}>
      <nav className={styles.navbar}>
        <img src="/assets/logo.png" alt="Logo" />
        <h2>WELCOME</h2>
      </nav>
      <div className={styles.formContainer}>
        <form onSubmit={handleLogin} className={styles.form}>
          <h1>Login</h1>
          {errorMessage && <p className={styles.error}>{errorMessage}</p>} {/* Hata mesajını göster */}
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
          <button type="submit" className={styles.button} disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
          <div className={styles.registerLink}>
            <span>
              Don't have an account?{' '}
              <span onClick={handleRegisterClick} className={styles.linkText}>
                Register
              </span>
            </span>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
