import { useState } from 'react';
import PropTypes from 'prop-types';

import '../assets/style.css';

const { VITE_URL } = import.meta.env;

function Login({ setIsAuth }) {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${VITE_URL}/admin/signin`, {
        method: 'POST',
        body: JSON.stringify(formData),
        headers: new Headers({
          'Content-Type': 'application/json',
        }),
      });

      const data = await response.json();

      if (data.success) {
        const { token, expired } = data;
        document.cookie = `hexToken=${token};expires=${new Date(expired)};`;
        setIsAuth(true);
      }
    } catch (error) {
      console.error('登入失敗: ' + error.response.data.message);
    }
  };

  return (
    <div className='container login'>
      <div className='row justify-content-center'>
        <h1 className='h3 mb-3 font-weight-normal'>請先登入</h1>
        <div className='col-8'>
          <form id='form' className='form-signin' onSubmit={handleSubmit}>
            <div className='form-floating mb-3'>
              <input
                type='email'
                className='form-control'
                id='username'
                placeholder='name@example.com'
                value={formData.username}
                onChange={handleInputChange}
                required
                autoFocus
                autoComplete='current-username'
              />
              <label htmlFor='username'>Email address</label>
            </div>
            <div className='form-floating'>
              <input
                type='password'
                className='form-control'
                id='password'
                placeholder='Password'
                value={formData.password}
                onChange={handleInputChange}
                required
                autoComplete='current-password'
              />
              <label htmlFor='password'>Password</label>
            </div>
            <button className='btn btn-lg btn-primary w-100 mt-3' type='submit'>
              登入
            </button>
          </form>
        </div>
      </div>
      <p className='mt-5 mb-3 text-muted'>&copy; 2024~∞ - 六角學院</p>
    </div>
  );
}

Login.propTypes = {
  setIsAuth: PropTypes.func.isRequired,
};

export default Login;
