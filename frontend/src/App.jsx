import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';

function App() {
  const [token, setToken] = useState(null);

  const handleLogout = () => {
    setToken(null);
  };

  return (
    <Router>
      <Header isAuthenticated={!!token} onLogout={handleLogout} />
      <Routes>
        <Route path="/" element={<h1>Добро пожаловать в систему управления мероприятиями</h1>} />
        <Route path="/login" element={<Login setToken={setToken} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={token ? <Dashboard token={token} /> : <h2>Пожалуйста, войдите</h2>} />
      </Routes>
    </Router>
  );
}

export default App;
