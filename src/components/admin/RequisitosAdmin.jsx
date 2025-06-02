// src/components/admin/RequisitosAdmin.jsx
import React, { useState } from 'react';
import { Plus, Edit, Trash2, ArrowLeft, ArrowUp, ArrowDown, FileText, Image } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { useContenidoRequisitos, useSecciones, useEtapas, useConvocatorias } from '../../hooks/useFirestore';
import RequisitoModal from './RequisitoModal';

const RequisitosAdmin = () => {
  const { convocatoriaId, etapaId, seccionId } = useParams();
  const navigate = useNavigate();
  
  const { convocatorias } = useConvocatorias();
  const { etapas } = useEtapas(convocatoriaId);
  const { secciones } = useSecciones(convocatoriaId, etapaId);
  const { 
    requisitos, 
    loading, 
    error, 
    createRequisito, 
    updateRequisito, 
    deleteRequisito 
  } = useContenidoRequisitos(convocatoriaId, etapaId, seccionId);

  const [showModal, setShowModal] = useState(false);
  const [editingRequisito, setEditingRequisito] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  // Encontrar información actual
  const convocatoriaActual = convocatorias.find(c => c.id === convocatoriaId);
  const etapaActual = etapas.find(e => e.id === etapaId);
  const seccionActual = secciones.find(s => s.id === seccionId);

  const handleNuevoRequisito = () => {
    setEditingRequisito(null);
    setShowModal(true);
  };

  const handleEditarRequisito = (requisito) => {
    setEditingRequisito(requisito);
    setShowModal(true);
  };

  const handleEliminarRequisito = async (requisitoId) => {
    if (window.confirm('¿Está seguro de eliminar este requisito? Esta acción no se puede deshacer.')) {
      try {
        setDeletingId(requisitoId);
        await deleteRequisito(requisitoId);
        alert('Requisito eliminado exitosamente');
      } catch (error) {
        alert('Error al eliminar el requisito: ' + error.message);
      } finally {
        setDeletingId(null);
      }
    }
  };

  const handleSaveRequisito = async (requisitoData) => {
    try {
      // Calcular el siguiente orden si es nuevo requisito
      if (!editingRequisito) {
        const maxOrden = requisitos.length > 0 ? Math.max(...requisitos.map(r => r.orden || 0)) : 0;
        requisitoData.orden = maxOrden + 1;
      }

      if (editingRequisito) {
        await updateRequisito(editingRequisito.id, requisitoData);
        alert('Requisito actualizado exitosamente');
      } else {
        await createRequisito(requisitoData);
        alert('Requisito creado exitosamente');
      }
      setShowModal(false);
    } catch (error) {
      alert('Error al guardar el requisito: ' + error.message);
    }
  };

  const handleMoverRequisito = async (requisitoId, direccion) => {
    const requisitoActual = requisitos.find(r => r.id === requisitoId);
    const ordenActual = requisitoActual.orden;
    
    let nuevoOrden;
    if (direccion === 'arriba') {
      nuevoOrden = ordenActual - 1;
    } else {
      nuevoOrden = ordenActual + 1;
    }

    // Encontrar el requisito que tiene el orden destino
    const requisitoIntercambio = requisitos.find(r => r.orden === nuevoOrden);
    
    if (requisitoIntercambio) {
      try {
        // Intercambiar órdenes
        await updateRequisito(requisitoId, { ...requisitoActual, orden: nuevoOrden });
        await updateRequisito(requisitoIntercambio.id, { ...requisitoIntercambio, orden: ordenActual });
      } catch (error) {
        alert('Error al reordenar requisitos: ' + error.message);
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

  const getCategoriaColor = (categoria) => {
    const colores = {
      'condiciones_previas': 'bg-blue-100 text-blue-800',
      'obligatorios': 'bg-red-100 text-red-800', 
      'condicionales': 'bg-yellow-100 text-yellow-800'
    };
    return colores[categoria] || 'bg-gray-100 text-gray-800';
  };

  if (!convocatoriaId || !etapaId || !seccionId) {
    return (
      <div className="requisitos-admin">
        <div className="error">
          <p>No se especificaron parámetros válidos</p>
          <button className="btn btn-primary" onClick={() => navigate('/admin/convocatorias')}>
            Volver a Convocatorias
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="requisitos-admin">
        <div className="loading">
          <p>Cargando requisitos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="requisitos-admin">
        <div className="error">
          <p>Error al cargar requisitos: {error}</p>
          <button className="btn btn-primary" onClick={() => window.location.reload()}>
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="requisitos-admin">
      <div className="admin-section-header">
        <div className="header-left">
          <button 
            className="btn btn-secondary"
            onClick={() => navigate(`/admin/convocatorias/${convocatoriaId}/etapas/${etapaId}/secciones`)}
          >
            <ArrowLeft size={16} />
            Volver a Secciones
          </button>
          <div className="header-info">
            <h2>Gestión de Contenido - {seccionActual?.nombre}</h2>
            <p>
              <span>{convocatoriaActual?.nombre}</span>
              <span className="breadcrumb-separator"> → </span>
              <span>{etapaActual?.nombre}</span>
              <span className="breadcrumb-separator"> → </span>
              <span>{seccionActual?.nombre}</span>
            </p>
          </div>
        </div>
        <div className="admin-actions">
          <button className="btn btn-primary" onClick={handleNuevoRequisito}>
            <Plus size={16} />
            Nuevo Requisito
          </button>
        </div>
      </div>

      {requisitos.length === 0 ? (
        <div className="empty-state">
          <p>No hay requisitos creados para esta sección</p>
          <button className="btn btn-primary" onClick={handleNuevoRequisito}>
            <Plus size={16} />
            Crear primer requisito
          </button>
        </div>
      ) : (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Orden</th>
                <th>Código</th>
                <th>Título</th>
                <th>Categoría</th>
                <th>Tipo</th>
                <th>Obligatorio</th>
                <th>Modelos</th>
                <th>Fecha</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {requisitos.map((requisito) => (
                <tr key={requisito.id}>
                  <td>
                    <div className="orden-controls">
                      <span className="orden-numero">{requisito.orden}</span>
                      <div className="orden-buttons">
                        <button
                          className="btn-icon btn-sm"
                          onClick={() => handleMoverRequisito(requisito.id, 'arriba')}
                          disabled={requisito.orden === 1}
                          title="Subir"
                        >
                          <ArrowUp size={12} />
                        </button>
                        <button
                          className="btn-icon btn-sm"
                          onClick={() => handleMoverRequisito(requisito.id, 'abajo')}
                          disabled={requisito.orden === requisitos.length}
                          title="Bajar"
                        >
                          <ArrowDown size={12} />
                        </button>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="codigo-requisito">{requisito.codigo}</span>
                  </td>
                  <td>
                    <div className="requisito-titulo">{requisito.titulo}</div>
                    <div className="requisito-descripcion-preview">
                      {requisito.descripcion.substring(0, 80)}
                      {requisito.descripcion.length > 80 ? '...' : ''}
                    </div>
                  </td>
                  <td>
                    <span className={`categoria-badge ${getCategoriaColor(requisito.categoria)}`}>
                      {requisito.categoria?.replace('_', ' ')}
                    </span>
                  </td>
                  <td>
                    <span className="tipo-documento">{requisito.tipoDocumento || '-'}</span>
                  </td>
                  <td>
                    <span className={`status-badge ${requisito.obligatorio ? 'active' : 'inactive'}`}>
                      {requisito.obligatorio ? 'Sí' : 'No'}
                    </span>
                  </td>
                  <td>
                    <div className="modelos-icons">
                      {requisito.tieneModelo && (
                        <FileText size={16} className="modelo-icon" title="Tiene modelo" />
                      )}
                      {requisito.tieneImagen && (
                        <Image size={16} className="imagen-icon" title="Tiene ejemplo" />
                      )}
                    </div>
                  </td>
                  <td>{formatFecha(requisito.fechaCreacion)}</td>
                  <td>
                    <div className="table-actions">
                      <button
                        className="btn-icon"
                        onClick={() => handleEditarRequisito(requisito)}
                        title="Editar"
                        disabled={deletingId === requisito.id}
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        className="btn-icon btn-danger"
                        onClick={() => handleEliminarRequisito(requisito.id)}
                        title="Eliminar"
                        disabled={deletingId === requisito.id}
                      >
                        {deletingId === requisito.id ? '...' : <Trash2 size={16} />}
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
        <RequisitoModal
          requisito={editingRequisito}
          convocatoriaId={convocatoriaId}
          etapaId={etapaId}
          seccionId={seccionId}
          onSave={handleSaveRequisito}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
};

export default RequisitosAdmin;