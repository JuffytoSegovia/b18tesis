// src/components/admin/ConvocatoriasAdmin.jsx
import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Download, Upload } from 'lucide-react';

const ConvocatoriasAdmin = () => {
  const [convocatorias, setConvocatorias] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingConvocatoria, setEditingConvocatoria] = useState(null);

  // Mock data inicial
  useEffect(() => {
    setConvocatorias([
      {
        id: '2025',
        nombre: 'Beca 18 - 2025',
        ano: 2025,
        descripcion: 'Convocatoria de Beca 18 para el año académico 2025',
        activa: true,
        fechaCreacion: new Date('2024-12-01'),
        fechaActualizacion: new Date('2025-01-15')
      },
      {
        id: '2024',
        nombre: 'Beca 18 - 2024',
        ano: 2024,
        descripcion: 'Convocatoria de Beca 18 para el año académico 2024',
        activa: false,
        fechaCreacion: new Date('2023-12-01'),
        fechaActualizacion: new Date('2024-12-31')
      }
    ]);
  }, []);

  const handleNuevaConvocatoria = () => {
    setEditingConvocatoria(null);
    setShowModal(true);
  };

  const handleEditarConvocatoria = (convocatoria) => {
    setEditingConvocatoria(convocatoria);
    setShowModal(true);
  };

  const handleEliminarConvocatoria = (id) => {
    if (window.confirm('¿Está seguro de eliminar esta convocatoria?')) {
      setConvocatorias(prev => prev.filter(c => c.id !== id));
    }
  };

  const handleExportarCSV = () => {
    alert('Función de exportar CSV será implementada en la siguiente fase');
  };

  const handleImportarCSV = () => {
    alert('Función de importar CSV será implementada en la siguiente fase');
  };

  const formatFecha = (fecha) => {
    return fecha.toLocaleDateString('es-PE', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="convocatorias-admin">
      <div className="admin-section-header">
        <h2>Gestión de Convocatorias</h2>
        <div className="admin-actions">
          <button className="btn btn-secondary" onClick={handleImportarCSV}>
            <Upload size={16} />
            Importar CSV
          </button>
          <button className="btn btn-secondary" onClick={handleExportarCSV}>
            <Download size={16} />
            Exportar CSV
          </button>
          <button className="btn btn-primary" onClick={handleNuevaConvocatoria}>
            <Plus size={16} />
            Nueva Convocatoria
          </button>
        </div>
      </div>

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
                    <div className="convocatoria-descripcion">{convocatoria.descripcion}</div>
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
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      className="btn-icon btn-danger"
                      onClick={() => handleEliminarConvocatoria(convocatoria.id)}
                      title="Eliminar"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal de formulario será implementado en la siguiente iteración */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>{editingConvocatoria ? 'Editar Convocatoria' : 'Nueva Convocatoria'}</h3>
            <p>Formulario de convocatoria será implementado en la siguiente fase.</p>
            <button className="btn btn-secondary" onClick={() => setShowModal(false)}>
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConvocatoriasAdmin;