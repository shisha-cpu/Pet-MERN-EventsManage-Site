import React, { useState } from 'react';
import axios from 'axios';
import { Navigate } from 'react-router-dom';
import { fetchUser } from '../store/slices/userSlice';
import { useDispatch } from 'react-redux';
import './auth.css';

const Register = () => {
  const [name, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [redirect, setRedirect] = useState(false);
  const dispatch = useDispatch();

  const handleRegister = async (e) => {
    e.preventDefault();
    axios.post('http://localhost:5000/register', { name, password })
      .then(res => {
        dispatch(fetchUser(res.data));
        setRedirect(true);
      })
      .catch(err => console.log(err));
  };

  if (redirect) {
    return <Navigate to='/' />;
  }

  return (
    <form onSubmit={handleRegister} className="auth-form">
      <h2 className="auth-title">Регистрация</h2>
      <input
        type="text"
        placeholder="Логин"
        value={name}
        onChange={(e) => setUsername(e.target.value)}
        required
        className="auth-input"
      />
      <input
        type="password"
        placeholder="Пароль"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        className="auth-input"
      />
      <button type="submit" className="auth-button">Зарегистрироваться</button>
    </form>
  );
};

export default Register;
