// src/components/layout/Sidebar.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ChevronDown, ChevronRight, FileText, Settings, Calendar, Building, Award } from 'lucide-react';
import './Sidebar.css';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedConvocatoria, setSelectedConvocatoria] = useState('2025');
  const [expandedEtapa, setExpandedEtapa] = useState('seleccion');
  const isAdminView = location.pathname.includes('/admin');

  // Mock data - esto será reemplazado por datos de Firebase
  const convocatorias = [
    { id: '2025', nombre: 'Beca 18 - 2025', activa: true },
    { id: '2024', nombre: 'Beca 18 - 2024', activa: false }
  ];

  const etapas = [
    { id: 'seleccion', nombre: 'Etapa de Selección', activa: true }
  ];

  const secciones = [
    { id: 'requisitos', nombre: 'Requisitos de Postulación', icono: '📄' },
    { id: 'procedimiento', nombre: 'Procedimiento de Postulación', icono: '📋' },
    { id: 'cronograma', nombre: 'Cronograma', icono: '📅' },
    { id: 'ies', nombre: 'IES Elegibles', icono: '🏛️' },
    { id: 'criterios', nombre: 'Criterios de Puntaje', icono: '📊' }
  ];

  const handleConvocatoriaChange = (convocatoriaId) => {
    setSelectedConvocatoria(convocatoriaId);
  };

  const handleEtapaToggle = (etapaId) => {
    setExpandedEtapa(expandedEtapa === etapaId ? '' : etapaId);
  };

  const handleSeccionClick = (seccionId) => {
    if (isAdminView) {
      navigate(`/admin/convocatorias/${selectedConvocatoria}/etapas/${expandedEtapa}/secciones/${seccionId}`);
    } else {
      navigate(`/convocatorias/${selectedConvocatoria}/etapas/${expandedEtapa}/secciones/${seccionId}`);
    }
  };

  return (
    <aside className="sidebar">
      {/* Selector de Convocatoria */}
      <div className="sidebar-section">
        <label className="sidebar-label">Convocatoria:</label>
        <select 
          className="convocatoria-selector"
          value={selectedConvocatoria}
          onChange={(e) => handleConvocatoriaChange(e.target.value)}
        >
          {convocatorias.map((conv) => (
            <option key={conv.id} value={conv.id}>
              {conv.nombre}
            </option>
          ))}
        </select>
      </div>

      {/* Navegación por Etapas */}
      <nav className="sidebar-nav">
        {etapas.map((etapa) => (
          <div key={etapa.id} className="etapa-container">
            <button
              className={`etapa-header ${expandedEtapa === etapa.id ? 'expanded' : ''}`}
              onClick={() => handleEtapaToggle(etapa.id)}
            >
              <span className="etapa-nombre">{etapa.nombre}</span>
              {expandedEtapa === etapa.id ? 
                <ChevronDown size={16} /> : 
                <ChevronRight size={16} />
              }
            </button>

            {/* Secciones */}
            {expandedEtapa === etapa.id && (
              <div className="secciones-container">
                {secciones.map((seccion) => (
                  <button
                    key={seccion.id}
                    className={`seccion-item ${
                      location.pathname.includes(seccion.id) ? 'active' : ''
                    }`}
                    onClick={() => handleSeccionClick(seccion.id)}
                  >
                    <span className="seccion-icono">{seccion.icono}</span>
                    <span className="seccion-nombre">{seccion.nombre}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>

      {/* Panel Admin Quick Links */}
      {isAdminView && (
        <div className="admin-quick-links">
          <h4>Gestión Admin</h4>
          <button 
            className="admin-link"
            onClick={() => navigate('/admin/convocatorias')}
          >
            <Settings size={16} />
            Gestionar Convocatorias
          </button>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;