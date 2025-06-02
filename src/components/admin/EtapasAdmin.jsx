// src/components/admin/EtapasAdmin.jsx
import React, { useState } from 'react';
import { Plus, Edit, Trash2, ArrowLeft, ArrowUp, ArrowDown } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { useEtapas, useConvocatorias } from '../../hooks/useFirestore';
import EtapaModal from './EtapaModal';

const EtapasAdmin = () => {
  const { convocatoriaId } = useParams();
  const navigate = useNavigate();
  
  const { convocatorias } = useConvocatorias();
  const { 
    etapas, 
    loading, 
    error, 
    createEtapa, 
    updateEtapa, 
    deleteEtapa 
  } = useEtapas(convocatoriaId);

  const [showModal, setShowModal] = useState(false);
  const [editingEtapa, setEditingEtapa] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  // Encontrar información de la convocatoria actual
  const convocatoriaActual = convocatorias.find(c => c.id === convocatoriaId);

  const handleNuevaEtapa = () => {
    setEditingEtapa(null);
    setShowModal(true);
  };

  const handleEditarEtapa = (etapa) => {
    setEditingEtapa(etapa);
    setShowModal(true);
  };

  const handleEliminarEtapa = async (etapaId) => {
    if (window.confirm('¿Está seguro de eliminar esta etapa? Esta acción no se puede deshacer.')) {
      try {
        setDeletingId(etapaId);
        await deleteEtapa(etapaId);
        alert('Etapa eliminada exitosamente');
      } catch (error) {
        alert('Error al eliminar la etapa: ' + error.message);
      } finally {
        setDeletingId(null);
      }
    }
  };

  const handleSaveEtapa = async (etapaData) => {
    try {
      // Calcular el siguiente orden si es nueva etapa
      if (!editingEtapa) {
        const maxOrden = etapas.length > 0 ? Math.max(...etapas.map(e => e.orden || 0)) : 0;
        etapaData.orden = maxOrden + 1;
      }

      if (editingEtapa) {
        await updateEtapa(editingEtapa.id, etapaData);
        alert('Etapa actualizada exitosamente');
      } else {
        await createEtapa(etapaData);
        alert('Etapa creada exitosamente');
      }
      setShowModal(false);
    } catch (error) {
      alert('Error al guardar la etapa: ' + error.message);
    }
  };

  const handleMoverEtapa = async (etapaId, direccion) => {
    const etapaActual = etapas.find(e => e.id === etapaId);
    const ordenActual = etapaActual.orden;
    
    let nuevoOrden;
    if (direccion === 'arriba') {
      nuevoOrden = ordenActual - 1;
    } else {
      nuevoOrden = ordenActual + 1;
    }

    // Encontrar la etapa que tiene el orden destino
    const etapaIntercambio = etapas.find(e => e.orden === nuevoOrden);
    
    if (etapaIntercambio) {
      try {
        // Intercambiar órdenes
        await updateEtapa(etapaId, { ...etapaActual, orden: nuevoOrden });
        await updateEtapa(etapaIntercambio.id, { ...etapaIntercambio, orden: ordenActual });
      } catch (error) {
        alert('Error al reordenar etapas: ' + error.message);
      }
    }
  };

  const formatFecha = (fecha) => {
    return fecha.toLocaleDateString('es-PE', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (!convocatoriaId) {
    return (
      <div className="etapas-admin">
        <div className="error">
          <p>No se especificó una convocatoria válida</p>
          <button className="btn btn-primary" onClick={() => navigate('/admin/convocatorias')}>
            Volver a Convocatorias
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="etapas-admin">
        <div className="loading">
          <p>Cargando etapas...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="etapas-admin">
        <div className="error">
          <p>Error al cargar etapas: {error}</p>
          <button className="btn btn-primary" onClick={() => window.location.reload()}>
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="etapas-admin">
      <div className="admin-section-header">
        <div className="header-left">
          <button 
            className="btn btn-secondary"
            onClick={() => navigate('/admin/convocatorias')}
          >
            <ArrowLeft size={16} />
            Volver a Convocatorias
          </button>
          <div className="header-info">
            <h2>Gestión de Etapas</h2>
            <p>Convocatoria: {convocatoriaActual?.nombre || 'Cargando...'}</p>
          </div>
        </div>
        <div className="admin-actions">
          <button className="btn btn-primary" onClick={handleNuevaEtapa}>
            <Plus size={16} />
            Nueva Etapa
          </button>
        </div>
      </div>

      {etapas.length === 0 ? (
        <div className="empty-state">
          <p>No hay etapas creadas para esta convocatoria</p>
          <button className="btn btn-primary" onClick={handleNuevaEtapa}>
            <Plus size={16} />
            Crear primera etapa
          </button>
        </div>
      ) : (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Orden</th>
                <th>Nombre</th>
                <th>Descripción</th>
                <th>Estado</th>
                <th>Fecha Creación</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {etapas.map((etapa) => (
                <tr key={etapa.id}>
                  <td>
                    <div className="orden-controls">
                      <span className="orden-numero">{etapa.orden}</span>
                      <div className="orden-buttons">
                        <button
                          className="btn-icon btn-sm"
                          onClick={() => handleMoverEtapa(etapa.id, 'arriba')}
                          disabled={etapa.orden === 1}
                          title="Subir"
                        >
                          <ArrowUp size={12} />
                        </button>
                        <button
                          className="btn-icon btn-sm"
                          onClick={() => handleMoverEtapa(etapa.id, 'abajo')}
                          disabled={etapa.orden === etapas.length}
                          title="Bajar"
                        >
                          <ArrowDown size={12} />
                        </button>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="etapa-nombre">{etapa.nombre}</div>
                  </td>
                  <td>
                    <div className="etapa-descripcion">
                      {etapa.descripcion || '-'}
                    </div>
                  </td>
                  <td>
                    <span className={`status-badge ${etapa.activa ? 'active' : 'inactive'}`}>
                      {etapa.activa ? 'Activa' : 'Inactiva'}
                    </span>
                  </td>
                  <td>{formatFecha(etapa.fechaCreacion)}</td>
                  <td>
                    <div className="table-actions">
                      <button
                        className="btn-icon"
                        onClick={() => handleEditarEtapa(etapa)}
                        title="Editar"
                        disabled={deletingId === etapa.id}
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        className="btn-icon btn-danger"
                        onClick={() => handleEliminarEtapa(etapa.id)}
                        title="Eliminar"
                        disabled={deletingId === etapa.id}
                      >
                        {deletingId === etapa.id ? '...' : <Trash2 size={16} />}
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
        <EtapaModal
          etapa={editingEtapa}
          convocatoriaId={convocatoriaId}
          onSave={handleSaveEtapa}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
};

export default EtapasAdmin;