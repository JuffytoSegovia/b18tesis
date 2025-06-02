// src/components/admin/ConvocatoriasAdmin.jsx
import React, { useState } from 'react';
import { Plus, Edit, Trash2, Download, Upload } from 'lucide-react';
import { useConvocatorias } from '../../hooks/useFirestore';
import ConvocatoriaModal from './ConvocatoriaModal';

const ConvocatoriasAdmin = () => {
  const { 
    convocatorias, 
    loading, 
    error, 
    createConvocatoria, 
    updateConvocatoria, 
    deleteConvocatoria 
  } = useConvocatorias();

  const [showModal, setShowModal] = useState(false);
  const [editingConvocatoria, setEditingConvocatoria] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const handleNuevaConvocatoria = () => {
    setEditingConvocatoria(null);
    setShowModal(true);
  };

  const handleEditarConvocatoria = (convocatoria) => {
    setEditingConvocatoria(convocatoria);
    setShowModal(true);
  };

  const handleEliminarConvocatoria = async (id) => {
    if (window.confirm('¿Está seguro de eliminar esta convocatoria? Esta acción no se puede deshacer.')) {
      try {
        setDeletingId(id);
        await deleteConvocatoria(id);
        alert('Convocatoria eliminada exitosamente');
      } catch (error) {
        alert('Error al eliminar la convocatoria: ' + error.message);
      } finally {
        setDeletingId(null);
      }
    }
  };

  const handleSaveConvocatoria = async (convocatoriaData) => {
    try {
      if (editingConvocatoria) {
        await updateConvocatoria(editingConvocatoria.id, convocatoriaData);
        alert('Convocatoria actualizada exitosamente');
      } else {
        await createConvocatoria(convocatoriaData);
        alert('Convocatoria creada exitosamente');
      }
      setShowModal(false);
    } catch (error) {
      alert('Error al guardar la convocatoria: ' + error.message);
    }
  };

  const handleExportarCSV = () => {
    if (convocatorias.length === 0) {
      alert('No hay convocatorias para exportar');
      return;
    }

    // Crear CSV básico
    const headers = ['ID', 'Nombre', 'Año', 'Descripción', 'Estado', 'Fecha Creación', 'Última Actualización'];
    const csvData = [
      headers.join(','),
      ...convocatorias.map(conv => [
        conv.id,
        `"${conv.nombre}"`,
        conv.ano,
        `"${conv.descripcion || ''}"`,
        conv.activa ? 'ACTIVA' : 'INACTIVA',
        conv.fechaCreacion.toLocaleDateString('es-PE'),
        conv.fechaActualizacion.toLocaleDateString('es-PE')
      ].join(','))
    ].join('\n');

    // Descargar archivo
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `convocatorias_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleImportarCSV = () => {
    alert('Función de importar CSV será implementada en la siguiente iteración');
  };

  const formatFecha = (fecha) => {
    return fecha.toLocaleDateString('es-PE', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="convocatorias-admin">
        <div className="loading">
          <p>Cargando convocatorias...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="convocatorias-admin">
        <div className="error">
          <p>Error al cargar convocatorias: {error}</p>
          <button className="btn btn-primary" onClick={() => window.location.reload()}>
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="convocatorias-admin">
      <div className="admin-section-header">
        <h2>Gestión de Convocatorias</h2>
        <div className="admin-actions">
          <button className="btn btn-secondary" onClick={handleImportarCSV}>
            <Upload size={16} />
            Importar CSV
          </button>
          <button 
            className="btn btn-secondary" 
            onClick={handleExportarCSV}
            disabled={convocatorias.length === 0}
          >
            <Download size={16} />
            Exportar CSV
          </button>
          <button className="btn btn-primary" onClick={handleNuevaConvocatoria}>
            <Plus size={16} />
            Nueva Convocatoria
          </button>
        </div>
      </div>

      {convocatorias.length === 0 ? (
        <div className="empty-state">
          <p>No hay convocatorias creadas</p>
          <button className="btn btn-primary" onClick={handleNuevaConvocatoria}>
            <Plus size={16} />
            Crear primera convocatoria
          </button>
        </div>
      ) : (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Año</th>
                <th>Estado</th>
                <th>Fecha Creación</th>
                <th>Última Actualización</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {convocatorias.map((convocatoria) => (
                <tr key={convocatoria.id}>
                  <td>
                    <div>
                      <div className="convocatoria-nombre">{convocatoria.nombre}</div>
                      {convocatoria.descripcion && (
                        <div className="convocatoria-descripcion">{convocatoria.descripcion}</div>
                      )}
                    </div>
                  </td>
                  <td>{convocatoria.ano}</td>
                  <td>
                    <span className={`status-badge ${convocatoria.activa ? 'active' : 'inactive'}`}>
                      {convocatoria.activa ? 'Activa' : 'Inactiva'}
                    </span>
                  </td>
                  <td>{formatFecha(convocatoria.fechaCreacion)}</td>
                  <td>{formatFecha(convocatoria.fechaActualizacion)}</td>
                  <td>
                    <div className="table-actions">
                      <button
                        className="btn-icon"
                        onClick={() => handleEditarConvocatoria(convocatoria)}
                        title="Editar"
                        disabled={deletingId === convocatoria.id}
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        className="btn-icon btn-danger"
                        onClick={() => handleEliminarConvocatoria(convocatoria.id)}
                        title="Eliminar"
                        disabled={deletingId === convocatoria.id}
                      >
                        {deletingId === convocatoria.id ? '...' : <Trash2 size={16} />}
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
        <ConvocatoriaModal
          convocatoria={editingConvocatoria}
          onSave={handleSaveConvocatoria}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
};

export default ConvocatoriasAdmin;