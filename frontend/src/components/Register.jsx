import React, { useState } from 'react';
import axios from 'axios';
import { fetchUser } from '../store/slices/userSlice';
import { useDispatch } from 'react-redux';
const Register = () => {
  const [name, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [redirect ,setRedirect  ] = useState(false)
const dispatch = useDispatch()
  const handleRegister = async (e) => {
    e.preventDefault()
    axios.post('http://localhost:5000/register'  , {name  , password})
    .then(res => {
        dispatch(fetchUser(res.data))

    }
    )
  };
  if (redirect){
    return <Navigate  to='/' />
  }
  return (
    <form onSubmit={handleRegister}>
      <h2>Регистрация</h2>
      <input type="text" placeholder="Логин" value={name} onChange={(e) => setUsername(e.target.value)} required />
      <input type="password" placeholder="Пароль" value={password} onChange={(e) => setPassword(e.target.value)} required />
      <button type="submit">Зарегистрироваться</button>
    </form>
  );
};

export default Register;
