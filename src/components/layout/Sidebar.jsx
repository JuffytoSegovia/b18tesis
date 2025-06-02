// src/components/layout/Sidebar.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ChevronDown, ChevronRight, Settings } from 'lucide-react';
import { useConvocatorias, useEtapas, useSecciones } from '../../hooks/useFirestore';
import './Sidebar.css';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isAdminView = location.pathname.includes('/admin');

  // Estados locales
  const [selectedConvocatoria, setSelectedConvocatoria] = useState('');
  const [expandedEtapa, setExpandedEtapa] = useState('');

  // Hooks de Firebase - CAMBIO: usar useConvocatorias en lugar de useActiveConvocatorias
  const { convocatorias, loading: loadingConvocatorias } = useConvocatorias();
  const { etapas, loading: loadingEtapas } = useEtapas(selectedConvocatoria);
  const { secciones, loading: loadingSecciones } = useSecciones(selectedConvocatoria, expandedEtapa);

  // Filtrar solo convocatorias activas para vista usuario
  const convocatoriasParaSelector = isAdminView 
    ? convocatorias 
    : convocatorias.filter(conv => conv.activa);

  // Efecto para seleccionar la primera convocatoria activa automáticamente
  useEffect(() => {
    if (convocatoriasParaSelector.length > 0 && !selectedConvocatoria) {
      const primeraConvocatoria = convocatoriasParaSelector[0];
      setSelectedConvocatoria(primeraConvocatoria.id);
    }
  }, [convocatoriasParaSelector, selectedConvocatoria]);

  // Efecto para expandir la primera etapa automáticamente
  useEffect(() => {
    if (etapas.length > 0 && !expandedEtapa) {
      const primeraEtapa = etapas.find(etapa => etapa.activa) || etapas[0];
      setExpandedEtapa(primeraEtapa.id);
    }
  }, [etapas, expandedEtapa]);

  // Limpiar etapa expandida cuando cambia la convocatoria
  useEffect(() => {
    setExpandedEtapa('');
  }, [selectedConvocatoria]);

  const handleConvocatoriaChange = (convocatoriaId) => {
    setSelectedConvocatoria(convocatoriaId);
    setExpandedEtapa('');
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

  // Funciones de renderizado
  const renderConvocatoriaSelector = () => {
    if (loadingConvocatorias) {
      return (
        <select className="convocatoria-selector" disabled>
          <option>Cargando...</option>
        </select>
      );
    }

    if (convocatoriasParaSelector.length === 0) {
      return (
        <select className="convocatoria-selector" disabled>
          <option>
            {isAdminView 
              ? 'No hay convocatorias' 
              : 'No hay convocatorias activas'
            }
          </option>
        </select>
      );
    }

    return (
      <select 
        className="convocatoria-selector"
        value={selectedConvocatoria}
        onChange={(e) => handleConvocatoriaChange(e.target.value)}
      >
        {convocatoriasParaSelector.map((conv) => (
          <option key={conv.id} value={conv.id}>
            {conv.nombre}
          </option>
        ))}
      </select>
    );
  };

  const renderEtapas = () => {
    if (!selectedConvocatoria) {
      return (
        <div className="no-selection">
          <p>Selecciona una convocatoria</p>
        </div>
      );
    }

    if (loadingEtapas) {
      return (
        <div className="loading-section">
          <p>Cargando etapas...</p>
        </div>
      );
    }

    if (etapas.length === 0) {
      return (
        <div className="no-selection">
          <p>No hay etapas disponibles</p>
          {isAdminView && (
            <button 
              className="btn btn-sm btn-primary"
              onClick={() => navigate('/admin/convocatorias')}
            >
              Gestionar Etapas
            </button>
          )}
        </div>
      );
    }

    return etapas.map((etapa) => (
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

        {expandedEtapa === etapa.id && renderSecciones()}
      </div>
    ));
  };

  const renderSecciones = () => {
    if (loadingSecciones) {
      return (
        <div className="secciones-container">
          <div className="loading-section">
            <p>Cargando secciones...</p>
          </div>
        </div>
      );
    }

    if (secciones.length === 0) {
      // Mostrar secciones predeterminadas si no hay secciones en Firebase
      const seccionesDefault = [
        { id: 'requisitos', nombre: 'Requisitos de Postulación', icono: '📄' },
        { id: 'procedimiento', nombre: 'Procedimiento de Postulación', icono: '📋' },
        { id: 'cronograma', nombre: 'Cronograma', icono: '📅' },
        { id: 'ies', nombre: 'IES Elegibles', icono: '🏛️' },
        { id: 'criterios', nombre: 'Criterios de Puntaje', icono: '📊' }
      ];

      return (
        <div className="secciones-container">
          {seccionesDefault.map((seccion) => (
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
      );
    }

    return (
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
    );
  };

  return (
    <aside className="sidebar">
      {/* Selector de Convocatoria */}
      <div className="sidebar-section">
        <label className="sidebar-label">Convocatoria:</label>
        {renderConvocatoriaSelector()}
      </div>

      {/* Navegación por Etapas */}
      <nav className="sidebar-nav">
        {renderEtapas()}
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