// src/components/user/UserView.jsx
import React from 'react';
import { useParams } from 'react-router-dom';
import RequisitosList from './RequisitosList';
import './UserView.css';

const UserView = () => {
  const { convocatoriaId, etapaId, seccionId } = useParams();

  // Si no hay sección seleccionada, mostrar vista por defecto
  if (!seccionId) {
    return (
      <div className="user-view">
        <div className="welcome-section">
          <h2>Bienvenido al Sistema de Información Beca 18</h2>
          <p>Selecciona una sección del menú lateral para comenzar a explorar la información de la convocatoria.</p>
          
          <div className="info-cards">
            <div className="info-card">
              <div className="card-icon">📄</div>
              <h3>Requisitos de Postulación</h3>
              <p>Documentos y criterios necesarios para postular</p>
            </div>
            
            <div className="info-card">
              <div className="card-icon">📋</div>
              <h3>Procedimiento de Postulación</h3>
              <p>Pasos detallados del proceso de postulación</p>
            </div>
            
            <div className="info-card">
              <div className="card-icon">📅</div>
              <h3>Cronograma</h3>
              <p>Fechas importantes y plazos</p>
            </div>
            
            <div className="info-card">
              <div className="card-icon">🏛️</div>
              <h3>IES Elegibles</h3>
              <p>Instituciones de educación superior disponibles</p>
            </div>
            
            <div className="info-card">
              <div className="card-icon">📊</div>
              <h3>Criterios de Puntaje</h3>
              <p>Sistema de evaluación y puntajes</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Renderizar contenido según la sección
  const renderSeccionContent = () => {
    switch (seccionId) {
      case 'requisitos':
        return <RequisitosList convocatoriaId={convocatoriaId} etapaId={etapaId} />;
      case 'procedimiento':
        return (
          <div className="seccion-content">
            <h2>Procedimiento de Postulación</h2>
            <p className="ultima-actualizacion">📅 Última actualización: 15 de mayo, 2025</p>
            <div className="content-placeholder">
              <p>Contenido del procedimiento de postulación será implementado en la siguiente fase.</p>
            </div>
          </div>
        );
      case 'cronograma':
        return (
          <div className="seccion-content">
            <h2>Cronograma</h2>
            <p className="ultima-actualizacion">📅 Última actualización: 15 de mayo, 2025</p>
            <div className="content-placeholder">
              <p>Contenido del cronograma será implementado en la siguiente fase.</p>
            </div>
          </div>
        );
      case 'ies':
        return (
          <div className="seccion-content">
            <h2>IES Elegibles</h2>
            <p className="ultima-actualizacion">📅 Última actualización: 15 de mayo, 2025</p>
            <div className="content-placeholder">
              <p>Contenido de IES elegibles será implementado en la siguiente fase.</p>
            </div>
          </div>
        );
      case 'criterios':
        return (
          <div className="seccion-content">
            <h2>Criterios de Puntaje</h2>
            <p className="ultima-actualizacion">📅 Última actualización: 15 de mayo, 2025</p>
            <div className="content-placeholder">
              <p>Contenido de criterios de puntaje será implementado en la siguiente fase.</p>
            </div>
          </div>
        );
      default:
        return (
          <div className="seccion-content">
            <h2>Sección no encontrada</h2>
            <p>La sección solicitada no existe o no está disponible.</p>
          </div>
        );
    }
  };

  return (
    <div className="user-view">
      {renderSeccionContent()}
    </div>
  );
};

export default UserView;