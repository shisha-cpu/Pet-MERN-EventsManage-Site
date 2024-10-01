import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { deleteUser } from '../store/slices/userSlice';
import './header.css';

export default function Header() {
  const user = useSelector(state => state.user.user);
  const dispatch = useDispatch();
  const navigate = useNavigate(); // используем useNavigate

  const handleLogout = () => {
    dispatch(deleteUser());
    navigate('/'); // перенаправляем на главную страницу
  };

  return (
    <header className="header">
      <nav className="nav">
        <Link className="nav-logo" to="/">Eventio</Link>
        <img src="../../public/i (4)-Photoroom (1).png" alt="" />
        {!user ? (
          <div className="auth">
            <Link className="nav-link" to="/login">Вход</Link>
            <Link className="nav-link" to="/register">Регистрация</Link>
          </div>
        ) : (
          <div>
            <Link className="nav-link" to="/dashboard">Личный кабинет</Link>
            <button className="nav-button" onClick={handleLogout}>Выйти</button>
          </div>
        )}
      </nav>
    </header>
  );
}
