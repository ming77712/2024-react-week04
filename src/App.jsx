import { useState, useEffect } from 'react';
import { apiFetch } from './api/apiFetch';

import LoginPage from './pages/LoginPage';
import ProductPage from './pages/ProductPage';

const { VITE_URL } = import.meta.env;

function App() {
  const [isAuth, setIsAuth] = useState(false);

  const checkAdmin = async () => {
    const url = `${VITE_URL}/api/user/check`;

    const data = await apiFetch(url, 'POST', true);

    if (data.success) setIsAuth(true);
  };

  useEffect(() => {
    checkAdmin();
  }, []);

  return <>{isAuth ? <ProductPage /> : <LoginPage setIsAuth={setIsAuth} />}</>;
}

export default App;
