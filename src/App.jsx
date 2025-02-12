import { useState, useEffect } from 'react';

import LoginPage from './pages/LoginPage';
import ProductPage from './pages/ProductPage';

const { VITE_URL } = import.meta.env;

function App() {
  const [isAuth, setIsAuth] = useState(false);

  const checkAdmin = async (token) => {
    try {
      const response = await fetch(`${VITE_URL}/api/user/check`, {
        method: 'POST',
        headers: new Headers({
          'Content-Type': 'application/json',
          Authorization: token,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        setIsAuth(true);
      }
    } catch (error) {
      console.log(error.response.data.message);
    }
  };

  useEffect(() => {
    const token = document.cookie.replace(
      /(?:(?:^|.*;\s*)hexToken\s*=\s*([^;]*).*$)|^.*$/,
      '$1'
    );

    if (token) checkAdmin(token);
  }, []);

  return <>{isAuth ? <ProductPage /> : <LoginPage setIsAuth={setIsAuth} />}</>;
}

export default App;
