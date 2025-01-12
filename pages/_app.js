// pages/_app.js
import '../public/assets/global.css'; // Global stil dosyası
import { UserProvider } from '../src/utils/UserContext';
import AdminPanel from './AdminPanel'; // AdminPanel gibi bileşenlerinizi import edin
import UserPanel from './UserPanel'; // UserPanel'i de import edebilirsiniz

const App = ({ Component, pageProps }) => {
  return (
    <UserProvider>  {/* UserProvider ile sarmalayın */}
      <Component {...pageProps} /> {/* AdminPanel veya diğer bileşenler otomatik olarak burada render edilir */}
    </UserProvider>
  );
};

export default App;
