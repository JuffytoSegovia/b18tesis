// src/components/admin/ConvocatoriaModal.jsx
import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const ConvocatoriaModal = ({ convocatoria, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    ano: new Date().getFullYear(),
    descripcion: '',
    activa: true
  });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (convocatoria) {
      setFormData({
        nombre: convocatoria.nombre || '',
        ano: convocatoria.ano || new Date().getFullYear(),
        descripcion: convocatoria.descripcion || '',
        activa: convocatoria.activa ?? true
      });
    }
  }, [convocatoria]);

  const validateForm = () => {
    const newErrors = {};

    // Validar nombre
    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es requerido';
    } else if (formData.nombre.trim().length < 3) {
      newErrors.nombre = 'El nombre debe tener al menos 3 caracteres';
    }

    // Validar año
    const currentYear = new Date().getFullYear();
    if (!formData.ano) {
      newErrors.ano = 'El año es requerido';
    } else if (formData.ano < 2020 || formData.ano > currentYear + 5) {
      newErrors.ano = `El año debe estar entre 2020 y ${currentYear + 5}`;
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
        ano: parseInt(formData.ano),
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

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={handleBackdropClick}>
      <div className="modal">
        <div className="modal-header">
          <h3>{convocatoria ? 'Editar Convocatoria' : 'Nueva Convocatoria'}</h3>
          <button 
            className="modal-close"
            onClick={onClose}
            disabled={saving}
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body">
          <div className="form-group">
            <label className="form-label">
              Nombre de la Convocatoria *
            </label>
            <input
              type="text"
              className={`form-input ${errors.nombre ? 'error' : ''}`}
              value={formData.nombre}
              onChange={(e) => handleChange('nombre', e.target.value)}
              placeholder="Ej: Beca 18 - 2025"
              disabled={saving}
            />
            {errors.nombre && <span className="field-error">{errors.nombre}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">
              Año *
            </label>
            <input
              type="number"
              className={`form-input ${errors.ano ? 'error' : ''}`}
              value={formData.ano}
              onChange={(e) => handleChange('ano', e.target.value)}
              min="2020"
              max={new Date().getFullYear() + 5}
              disabled={saving}
            />
            {errors.ano && <span className="field-error">{errors.ano}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">
              Descripción
            </label>
            <textarea
              className={`form-textarea ${errors.descripcion ? 'error' : ''}`}
              value={formData.descripcion}
              onChange={(e) => handleChange('descripcion', e.target.value)}
              placeholder="Descripción de la convocatoria (opcional)"
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
              <span className="checkbox-label">Convocatoria activa</span>
            </label>
            <small className="form-help">
              Las convocatorias activas aparecen en el selector de la vista de usuario
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
              {saving ? 'Guardando...' : (convocatoria ? 'Actualizar' : 'Crear')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ConvocatoriaModal;