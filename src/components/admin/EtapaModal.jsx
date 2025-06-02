// src/components/admin/EtapaModal.jsx
import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const EtapaModal = ({ etapa, convocatoriaId, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    activa: true
  });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  // Etapas predefinidas comunes
  const etapasPredefinidas = [
    'Etapa de Preselección',
    'Etapa de Selección', 
    'Etapa de Adjudicación',
    'Etapa de Matrícula',
    'Etapa de Seguimiento'
  ];

  useEffect(() => {
    if (etapa) {
      setFormData({
        nombre: etapa.nombre || '',
        descripcion: etapa.descripcion || '',
        activa: etapa.activa ?? true
      });
    }
  }, [etapa]);

  const validateForm = () => {
    const newErrors = {};

    // Validar nombre
    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es requerido';
    } else if (formData.nombre.trim().length < 3) {
      newErrors.nombre = 'El nombre debe tener al menos 3 caracteres';
    }

    // Validar descripción (opcional pero si se proporciona, mínimo 10 caracteres)
    if (formData.descripcion.trim() && formData.descripcion.trim().length < 10) {
      newErrors.descripcion = 'La descripción debe tener al menos 10 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setSaving(true);
      await onSave({
        nombre: formData.nombre.trim(),
        descripcion: formData.descripcion.trim(),
        activa: formData.activa
      });
    } catch (error) {
      console.error('Error al guardar:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleEtapaPredefinida = (nombreEtapa) => {
    setFormData(prev => ({
      ...prev,
      nombre: nombreEtapa
    }));
    
    // Limpiar error si existe
    if (errors.nombre) {
      setErrors(prev => ({
        ...prev,
        nombre: ''
      }));
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={handleBackdropClick}>
      <div className="modal">
        <div className="modal-header">
          <h3>{etapa ? 'Editar Etapa' : 'Nueva Etapa'}</h3>
          <button 
            className="modal-close"
            onClick={onClose}
            disabled={saving}
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body">
          {/* Etapas predefinidas (solo para nuevas etapas) */}
          {!etapa && (
            <div className="form-group">
              <label className="form-label">
                Etapas Predefinidas (opcional)
              </label>
              <div className="predefined-buttons">
                {etapasPredefinidas.map((nombreEtapa) => (
                  <button
                    key={nombreEtapa}
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={() => handleEtapaPredefinida(nombreEtapa)}
                  >
                    {nombreEtapa}
                  </button>
                ))}
              </div>
              <small className="form-help">
                Haz clic en una etapa predefinida para usar su nombre
              </small>
            </div>
          )}

          <div className="form-group">
            <label className="form-label">
              Nombre de la Etapa *
            </label>
            <input
              type="text"
              className={`form-input ${errors.nombre ? 'error' : ''}`}
              value={formData.nombre}
              onChange={(e) => handleChange('nombre', e.target.value)}
              placeholder="Ej: Etapa de Selección"
              disabled={saving}
            />
            {errors.nombre && <span className="field-error">{errors.nombre}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">
              Descripción
            </label>
            <textarea
              className={`form-textarea ${errors.descripcion ? 'error' : ''}`}
              value={formData.descripcion}
              onChange={(e) => handleChange('descripcion', e.target.value)}
              placeholder="Descripción de la etapa (opcional)"
              rows="3"
              disabled={saving}
            />
            {errors.descripcion && <span className="field-error">{errors.descripcion}</span>}
          </div>

          <div className="form-group">
            <label className="checkbox-container">
              <input
                type="checkbox"
                checked={formData.activa}
                onChange={(e) => handleChange('activa', e.target.checked)}
                disabled={saving}
              />
              <span className="checkbox-label">Etapa activa</span>
            </label>
            <small className="form-help">
              Las etapas activas aparecen en la navegación de usuarios
            </small>
          </div>

          <div className="modal-footer">
            <button 
              type="button" 
              className="btn btn-secondary"
              onClick={onClose}
              disabled={saving}
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={saving}
            >
              {saving ? 'Guardando...' : (etapa ? 'Actualizar' : 'Crear')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EtapaModal;