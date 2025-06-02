// src/components/admin/AdminView.jsx
import React from 'react';
import { useParams } from 'react-router-dom';
import ConvocatoriasAdmin from './ConvocatoriasAdmin';
import './AdminView.css';

const AdminView = () => {
  const { convocatoriaId, etapaId, seccionId } = useParams();

  // Vista por defecto del admin
  if (!convocatoriaId) {
    return (
      <div className="admin-view">
        <div className="admin-header">
          <h1>Panel de Administración</h1>
          <p>Gestiona convocatorias, etapas y contenido del sistema Beca 18</p>
        </div>

        <ConvocatoriasAdmin />
      </div>
    );
  }

  // Gestión de secciones específicas
  const renderSeccionAdmin = () => {
    switch (seccionId) {
      case 'requisitos':
        return (
          <div className="seccion-admin">
            <h2>Administrar Requisitos de Postulación</h2>
            <p>Gestión de contenido de requisitos será implementada en la Fase 5.</p>
          </div>
        );
      default:
        return (
          <div className="seccion-admin">
            <h2>Sección en Desarrollo</h2>
            <p>La administración de esta sección será implementada en fases posteriores.</p>
          </div>
        );
    }
  };

  return (
    <div className="admin-view">
      <div className="admin-header">
        <h1>Panel de Administración</h1>
        <p>Convocatoria: {convocatoriaId} / Etapa: {etapaId} / Sección: {seccionId}</p>
      </div>

      {renderSeccionAdmin()}
    </div>
  );
};

export default AdminView;