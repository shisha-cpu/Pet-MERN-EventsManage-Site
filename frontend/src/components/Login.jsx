import React, { useState } from 'react';
import axios from 'axios';
import { Navigate  } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUser } from '../store/slices/userSlice';
const Login = () => {
  const [name, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const user  = useSelector(state => state.user)
 const [redirect ,setRedirect  ] = useState(false)
    const dispatch = useDispatch()


  const handleLogin = async (e) => {
    e.preventDefault();
    axios.post('http://localhost:5000/login' , {name , password})
    .then(res=> {

        dispatch(fetchUser(res.data))
        setRedirect(true)
    })
    .catch(err => console.log(err)
    )
    
  };
  if (redirect){
    return <Navigate  to='/' />
  }
  console.log(user);
  
  return (
    <form onSubmit={handleLogin}>
      <h2>Вход</h2>
      <input type="text" placeholder="Логин" value={name} onChange={(e) => setUsername(e.target.value)} required />
      <input type="password" placeholder="Пароль" value={password} onChange={(e) => setPassword(e.target.value)} required />
      <button type="submit">Войти</button>
    </form>
  );
};

export default Login;
