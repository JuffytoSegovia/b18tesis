// src/components/admin/SeccionModal.jsx
import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const SeccionModal = ({ seccion, convocatoriaId, etapaId, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    icono: '',
    tipoContenido: '',
    activa: true
  });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  // Secciones predefinidas comunes
  const seccionesPredefinidas = [
    { nombre: 'Requisitos de Postulación', icono: '📄', tipoContenido: 'requisitos' },
    { nombre: 'Procedimiento de Postulación', icono: '📋', tipoContenido: 'procedimiento' },
    { nombre: 'Cronograma', icono: '📅', tipoContenido: 'cronograma' },
    { nombre: 'IES Elegibles', icono: '🏛️', tipoContenido: 'ies' },
    { nombre: 'Criterios de Puntaje', icono: '📊', tipoContenido: 'criterios' },
    { nombre: 'Documentación Adicional', icono: '📎', tipoContenido: 'documentos' },
    { nombre: 'Información General', icono: 'ℹ️', tipoContenido: 'informacion' },
    { nombre: 'Preguntas Frecuentes', icono: '❓', tipoContenido: 'faq' },
    { nombre: 'Resultados', icono: '🏆', tipoContenido: 'resultados' },
    { nombre: 'Recursos', icono: '📚', tipoContenido: 'recursos' }
  ];

  // Iconos comunes para selección rápida
  const iconosComunes = [
    '📄', '📋', '📅', '🏛️', '📊', '📎', 'ℹ️', '❓', '🏆', '📚',
    '🎯', '💡', '⚡', '🔔', '📌', '📝', '📈', '🎓', '💼', '🌟'
  ];

  useEffect(() => {
    if (seccion) {
      setFormData({
        nombre: seccion.nombre || '',
        icono: seccion.icono || '',
        tipoContenido: seccion.tipoContenido || '',
        activa: seccion.activa ?? true
      });
    }
  }, [seccion]);

  const validateForm = () => {
    const newErrors = {};

    // Validar nombre
    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es requerido';
    } else if (formData.nombre.trim().length < 3) {
      newErrors.nombre = 'El nombre debe tener al menos 3 caracteres';
    }

    // Validar icono
    if (!formData.icono.trim()) {
      newErrors.icono = 'El icono es requerido';
    }

    // Validar tipo de contenido
    if (!formData.tipoContenido.trim()) {
      newErrors.tipoContenido = 'El tipo de contenido es requerido';
    } else if (formData.tipoContenido.trim().length < 2) {
      newErrors.tipoContenido = 'El tipo de contenido debe tener al menos 2 caracteres';
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
        icono: formData.icono.trim(),
        tipoContenido: formData.tipoContenido.trim().toLowerCase().replace(/\s+/g, '_'),
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

  const handleSeccionPredefinida = (seccionPredefinida) => {
    setFormData(prev => ({
      ...prev,
      nombre: seccionPredefinida.nombre,
      icono: seccionPredefinida.icono,
      tipoContenido: seccionPredefinida.tipoContenido
    }));
    
    // Limpiar errores
    setErrors({});
  };

  const handleIconoClick = (icono) => {
    setFormData(prev => ({
      ...prev,
      icono: icono
    }));
    
    if (errors.icono) {
      setErrors(prev => ({
        ...prev,
        icono: ''
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
      <div className="modal modal-large">
        <div className="modal-header">
          <h3>{seccion ? 'Editar Sección' : 'Nueva Sección'}</h3>
          <button 
            className="modal-close"
            onClick={onClose}
            disabled={saving}
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body">
          {/* Secciones predefinidas (solo para nuevas secciones) */}
          {!seccion && (
            <div className="form-group">
              <label className="form-label">
                Secciones Predefinidas (opcional)
              </label>
              <div className="predefined-sections">
                {seccionesPredefinidas.map((seccionPred, index) => (
                  <button
                    key={index}
                    type="button"
                    className="predefined-section-btn"
                    onClick={() => handleSeccionPredefinida(seccionPred)}
                  >
                    <span className="section-icon">{seccionPred.icono}</span>
                    <span className="section-name">{seccionPred.nombre}</span>
                  </button>
                ))}
              </div>
              <small className="form-help">
                Haz clic en una sección predefinida para usar sus valores
              </small>
            </div>
          )}

          <div className="form-group">
            <label className="form-label">
              Nombre de la Sección *
            </label>
            <input
              type="text"
              className={`form-input ${errors.nombre ? 'error' : ''}`}
              value={formData.nombre}
              onChange={(e) => handleChange('nombre', e.target.value)}
              placeholder="Ej: Requisitos de Postulación"
              disabled={saving}
            />
            {errors.nombre && <span className="field-error">{errors.nombre}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">
              Icono *
            </label>
            <input
              type="text"
              className={`form-input ${errors.icono ? 'error' : ''}`}
              value={formData.icono}
              onChange={(e) => handleChange('icono', e.target.value)}
              placeholder="Ej: 📄"
              disabled={saving}
            />
            <div className="iconos-comunes">
              {iconosComunes.map((icono, index) => (
                <button
                  key={index}
                  type="button"
                  className={`icono-btn ${formData.icono === icono ? 'selected' : ''}`}
                  onClick={() => handleIconoClick(icono)}
                >
                  {icono}
                </button>
              ))}
            </div>
            {errors.icono && <span className="field-error">{errors.icono}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">
              Tipo de Contenido *
            </label>
            <input
              type="text"
              className={`form-input ${errors.tipoContenido ? 'error' : ''}`}
              value={formData.tipoContenido}
              onChange={(e) => handleChange('tipoContenido', e.target.value)}
              placeholder="Ej: requisitos, cronograma, criterios"
              disabled={saving}
            />
            <small className="form-help">
              Identificador único para el tipo de contenido (se usará para normalizar datos)
            </small>
            {errors.tipoContenido && <span className="field-error">{errors.tipoContenido}</span>}
          </div>

          <div className="form-group">
            <label className="checkbox-container">
              <input
                type="checkbox"
                checked={formData.activa}
                onChange={(e) => handleChange('activa', e.target.checked)}
                disabled={saving}
              />
              <span className="checkbox-label">Sección activa</span>
            </label>
            <small className="form-help">
              Las secciones activas aparecen en la navegación de usuarios
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
              {saving ? 'Guardando...' : (seccion ? 'Actualizar' : 'Crear')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SeccionModal;