
import { useRouter } from 'next/router';

const HomePage = () => {
  const router = useRouter();

  const handleLoginClick = () => {
    router.push('/Login');
  };

  const handleRegisterClick = () => {
    router.push('/Register');
  };

  return (
    <div>
      <h1>Hoşgeldiniz!</h1>
      <p>
        <button onClick={handleLoginClick}>Giriş Yap</button>
        veya
        <button onClick={handleRegisterClick}>Kayıt Ol</button>
      </p>
    </div>
  );
};

export default HomePage;
