// src/components/layout/Header.jsx
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Header.css';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isAdminView = location.pathname.includes('/admin');

  const toggleView = () => {
    if (isAdminView) {
      navigate('/');
    } else {
      navigate('/admin');
    }
  };

  return (
    <header className="header">
      <div className="header-content">
        <div className="header-left">
          <h1 className="header-title">Beca 18 - Programa Nacional de Becas</h1>
          <p className="header-subtitle">Sistema de Información para Postulantes</p>
        </div>
        <div className="header-right">
          <button 
            className="toggle-view-btn"
            onClick={toggleView}
          >
            {isAdminView ? 'Ver como Usuario' : 'Acceder como Admin'}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;