// src/components/admin/SeccionesAdmin.jsx
import React, { useState } from 'react';
import { Plus, Edit, Trash2, ArrowLeft, ArrowUp, ArrowDown, Zap, Settings } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSecciones, useEtapas, useConvocatorias } from '../../hooks/useFirestore';
import SeccionModal from './SeccionModal';

const SeccionesAdmin = () => {
  const { convocatoriaId, etapaId } = useParams();
  const navigate = useNavigate();
  
  const { convocatorias } = useConvocatorias();
  const { etapas } = useEtapas(convocatoriaId);
  const { 
    secciones, 
    loading, 
    error, 
    createSeccion, 
    updateSeccion, 
    deleteSeccion 
  } = useSecciones(convocatoriaId, etapaId);

  const [showModal, setShowModal] = useState(false);
  const [editingSeccion, setEditingSeccion] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  // Encontrar información actual
  const convocatoriaActual = convocatorias.find(c => c.id === convocatoriaId);
  const etapaActual = etapas.find(e => e.id === etapaId);

  const handleNuevaSeccion = () => {
    setEditingSeccion(null);
    setShowModal(true);
  };

  const handleEditarSeccion = (seccion) => {
    setEditingSeccion(seccion);
    setShowModal(true);
  };

  const handleEliminarSeccion = async (seccionId) => {
    if (window.confirm('¿Está seguro de eliminar esta sección? Esta acción no se puede deshacer.')) {
      try {
        setDeletingId(seccionId);
        await deleteSeccion(seccionId);
        alert('Sección eliminada exitosamente');
      } catch (error) {
        alert('Error al eliminar la sección: ' + error.message);
      } finally {
        setDeletingId(null);
      }
    }
  };

  const handleSaveSeccion = async (seccionData) => {
    try {
      // Calcular el siguiente orden si es nueva sección
      if (!editingSeccion) {
        const maxOrden = secciones.length > 0 ? Math.max(...secciones.map(s => s.orden || 0)) : 0;
        seccionData.orden = maxOrden + 1;
      }

      if (editingSeccion) {
        await updateSeccion(editingSeccion.id, seccionData);
        alert('Sección actualizada exitosamente');
      } else {
        await createSeccion(seccionData);
        alert('Sección creada exitosamente');
      }
      setShowModal(false);
    } catch (error) {
      alert('Error al guardar la sección: ' + error.message);
    }
  };

  const handleMoverSeccion = async (seccionId, direccion) => {
    const seccionActual = secciones.find(s => s.id === seccionId);
    const ordenActual = seccionActual.orden;
    
    let nuevoOrden;
    if (direccion === 'arriba') {
      nuevoOrden = ordenActual - 1;
    } else {
      nuevoOrden = ordenActual + 1;
    }

    // Encontrar la sección que tiene el orden destino
    const seccionIntercambio = secciones.find(s => s.orden === nuevoOrden);
    
    if (seccionIntercambio) {
      try {
        // Intercambiar órdenes
        await updateSeccion(seccionId, { ...seccionActual, orden: nuevoOrden });
        await updateSeccion(seccionIntercambio.id, { ...seccionIntercambio, orden: ordenActual });
      } catch (error) {
        alert('Error al reordenar secciones: ' + error.message);
      }
    }
  };

  const handlePredefinirSecciones = async () => {
    if (secciones.length > 0) {
      const confirmar = window.confirm(
        'Ya existen secciones en esta etapa. ¿Desea agregar las secciones predefinidas además de las existentes?'
      );
      if (!confirmar) return;
    }

    try {
      // Secciones predefinidas para etapa de selección
      const seccionesPredefinidas = [
        { nombre: 'Requisitos de Postulación', icono: '📄', tipoContenido: 'requisitos' },
        { nombre: 'Procedimiento de Postulación', icono: '📋', tipoContenido: 'procedimiento' },
        { nombre: 'Cronograma', icono: '📅', tipoContenido: 'cronograma' },
        { nombre: 'IES Elegibles', icono: '🏛️', tipoContenido: 'ies' },
        { nombre: 'Criterios de Puntaje', icono: '📊', tipoContenido: 'criterios' }
      ];

      const maxOrden = secciones.length > 0 ? Math.max(...secciones.map(s => s.orden || 0)) : 0;

      for (let i = 0; i < seccionesPredefinidas.length; i++) {
        const seccionData = {
          ...seccionesPredefinidas[i],
          orden: maxOrden + i + 1,
          activa: true
        };
        await createSeccion(seccionData);
      }

      alert('Secciones predefinidas agregadas exitosamente');
    } catch (error) {
      alert('Error al agregar secciones predefinidas: ' + error.message);
    }
  };

  const formatFecha = (fecha) => {
    return fecha.toLocaleDateString('es-PE', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (!convocatoriaId || !etapaId) {
    return (
      <div className="secciones-admin">
        <div className="error">
          <p>No se especificó una convocatoria o etapa válida</p>
          <button className="btn btn-primary" onClick={() => navigate('/admin/convocatorias')}>
            Volver a Convocatorias
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="secciones-admin">
        <div className="loading">
          <p>Cargando secciones...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="secciones-admin">
        <div className="error">
          <p>Error al cargar secciones: {error}</p>
          <button className="btn btn-primary" onClick={() => window.location.reload()}>
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="secciones-admin">
      <div className="admin-section-header">
        <div className="header-left">
          <button 
            className="btn btn-secondary"
            onClick={() => navigate(`/admin/convocatorias/${convocatoriaId}/etapas`)}
          >
            <ArrowLeft size={16} />
            Volver a Etapas
          </button>
          <div className="header-info">
            <h2>Gestión de Secciones</h2>
            <p>
              <span>{convocatoriaActual?.nombre}</span>
              <span className="breadcrumb-separator"> → </span>
              <span>{etapaActual?.nombre}</span>
            </p>
          </div>
        </div>
        <div className="admin-actions">
          <button 
            className="btn btn-secondary"
            onClick={handlePredefinirSecciones}
          >
            <Zap size={16} />
            Secciones Predefinidas
          </button>
          <button className="btn btn-primary" onClick={handleNuevaSeccion}>
            <Plus size={16} />
            Nueva Sección
          </button>
        </div>
      </div>

      {secciones.length === 0 ? (
        <div className="empty-state">
          <p>No hay secciones creadas para esta etapa</p>
          <div className="empty-actions">
            <button className="btn btn-secondary" onClick={handlePredefinirSecciones}>
              <Zap size={16} />
              Agregar Secciones Predefinidas
            </button>
            <button className="btn btn-primary" onClick={handleNuevaSeccion}>
              <Plus size={16} />
              Crear sección personalizada
            </button>
          </div>
        </div>
      ) : (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Orden</th>
                <th>Nombre</th>
                <th>Icono</th>
                <th>Tipo Contenido</th>
                <th>Estado</th>
                <th>Fecha Creación</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {secciones.map((seccion) => (
                <tr key={seccion.id}>
                  <td>
                    <div className="orden-controls">
                      <span className="orden-numero">{seccion.orden}</span>
                      <div className="orden-buttons">
                        <button
                          className="btn-icon btn-sm"
                          onClick={() => handleMoverSeccion(seccion.id, 'arriba')}
                          disabled={seccion.orden === 1}
                          title="Subir"
                        >
                          <ArrowUp size={12} />
                        </button>
                        <button
                          className="btn-icon btn-sm"
                          onClick={() => handleMoverSeccion(seccion.id, 'abajo')}
                          disabled={seccion.orden === secciones.length}
                          title="Bajar"
                        >
                          <ArrowDown size={12} />
                        </button>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="seccion-nombre">{seccion.nombre}</div>
                  </td>
                  <td>
                    <span className="seccion-icono-display">{seccion.icono}</span>
                  </td>
                  <td>
                    <span className="tipo-contenido">{seccion.tipoContenido || '-'}</span>
                  </td>
                  <td>
                    <span className={`status-badge ${seccion.activa ? 'active' : 'inactive'}`}>
                      {seccion.activa ? 'Activa' : 'Inactiva'}
                    </span>
                  </td>
                  <td>{formatFecha(seccion.fechaCreacion)}</td>
                  <td>
                    <div className="table-actions">
                      <button
                        className="btn-icon"
                        onClick={() => navigate(`/admin/convocatorias/${convocatoriaId}/etapas/${etapaId}/secciones/${seccion.id}/contenido`)}
                        title="Gestionar Contenido"
                        disabled={deletingId === seccion.id}
                      >
                        <Settings size={16} />
                      </button>
                      <button
                        className="btn-icon"
                        onClick={() => handleEditarSeccion(seccion)}
                        title="Editar"
                        disabled={deletingId === seccion.id}
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        className="btn-icon btn-danger"
                        onClick={() => handleEliminarSeccion(seccion.id)}
                        title="Eliminar"
                        disabled={deletingId === seccion.id}
                      >
                        {deletingId === seccion.id ? '...' : <Trash2 size={16} />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal de formulario */}
      {showModal && (
        <SeccionModal
          seccion={editingSeccion}
          convocatoriaId={convocatoriaId}
          etapaId={etapaId}
          onSave={handleSaveSeccion}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
};

export default SeccionesAdmin;