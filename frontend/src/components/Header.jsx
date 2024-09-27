import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { deleteUser } from '../store/slices/userSlice';
export default function Header (){
  const user = useSelector(state => state.user.user)
  const dispatch = useDispatch()
  if (user){
    console.log(user);
    
  }
  return (
    <header>
      <nav>
   
        {!user? <>
          <Link to="/login">Вход</Link>
          <Link to="/register">Регистрация</Link>
        </>
        :
        <>
        <Link to="/dashboard">Личный кабинет</Link>
        <button onClick={()=>{
          dispatch(deleteUser())
        }} >Выйти</button>
        </>}



      </nav>
    </header>
  );
}
