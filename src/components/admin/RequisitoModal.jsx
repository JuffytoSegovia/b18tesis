// src/components/admin/RequisitoModal.jsx
import React, { useState, useEffect } from 'react';
import { X, Plus, Minus } from 'lucide-react';

const RequisitoModal = ({ requisito, convocatoriaId, etapaId, seccionId, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    codigo: '',
    titulo: '',
    descripcion: '',
    categoria: 'obligatorios',
    subcategoria: '',
    tipoDocumento: '',
    documentoRequerido: '',
    especificaciones: [''],
    observaciones: '',
    tieneModelo: false,
    urlModelo: '',
    tieneImagen: false,
    urlImagen: '',
    obligatorio: true,
    activo: true
  });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  // Categorías disponibles
  const categorias = [
    { value: 'condiciones_previas', label: 'Condiciones Previas' },
    { value: 'obligatorios', label: 'Requisitos Obligatorios' },
    { value: 'condicionales', label: 'Requisitos Condicionales' }
  ];

  // Subcategorías por categoría
  const subcategorias = {
    condiciones_previas: ['acceso', 'participacion'],
    obligatorios: ['constancia_ies', 'certificacion_educativa', 'acreditacion_rendimiento', 'condicion_socioeconomica'],
    condicionales: ['antecedentes', 'estudios_superiores', 'documentacion_adicional']
  };

  useEffect(() => {
    if (requisito) {
      setFormData({
        codigo: requisito.codigo || '',
        titulo: requisito.titulo || '',
        descripcion: requisito.descripcion || '',
        categoria: requisito.categoria || 'obligatorios',
        subcategoria: requisito.subcategoria || '',
        tipoDocumento: requisito.tipoDocumento || '',
        documentoRequerido: requisito.documentoRequerido || '',
        especificaciones: requisito.especificaciones || [''],
        observaciones: requisito.observaciones || '',
        tieneModelo: requisito.tieneModelo || false,
        urlModelo: requisito.urlModelo || '',
        tieneImagen: requisito.tieneImagen || false,
        urlImagen: requisito.urlImagen || '',
        obligatorio: requisito.obligatorio ?? true,
        activo: requisito.activo ?? true
      });
    }
  }, [requisito]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.codigo.trim()) {
      newErrors.codigo = 'El código es requerido';
    } else if (!/^REQ-\d{2}$/.test(formData.codigo.trim())) {
      newErrors.codigo = 'El código debe tener formato REQ-01';
    }

    if (!formData.titulo.trim()) {
      newErrors.titulo = 'El título es requerido';
    } else if (formData.titulo.trim().length < 5) {
      newErrors.titulo = 'El título debe tener al menos 5 caracteres';
    }

    if (!formData.descripcion.trim()) {
      newErrors.descripcion = 'La descripción es requerida';
    } else if (formData.descripcion.trim().length < 20) {
      newErrors.descripcion = 'La descripción debe tener al menos 20 caracteres';
    }

    if (!formData.subcategoria.trim()) {
      newErrors.subcategoria = 'La subcategoría es requerida';
    }

    // Validar especificaciones (al menos una no vacía)
    const especificacionesValidas = formData.especificaciones.filter(esp => esp.trim().length > 0);
    if (especificacionesValidas.length === 0) {
      newErrors.especificaciones = 'Debe agregar al menos una especificación';
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
      
      // Limpiar especificaciones vacías
      const especificacionesLimpias = formData.especificaciones.filter(esp => esp.trim().length > 0);
      
      await onSave({
        codigo: formData.codigo.trim(),
        titulo: formData.titulo.trim(),
        descripcion: formData.descripcion.trim(),
        categoria: formData.categoria,
        subcategoria: formData.subcategoria.trim(),
        tipoDocumento: formData.tipoDocumento.trim(),
        documentoRequerido: formData.documentoRequerido.trim(),
        especificaciones: especificacionesLimpias,
        observaciones: formData.observaciones.trim(),
        tieneModelo: formData.tieneModelo,
        urlModelo: formData.urlModelo.trim(),
        tieneImagen: formData.tieneImagen,
        urlImagen: formData.urlImagen.trim(),
        obligatorio: formData.obligatorio,
        activo: formData.activo
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

    // Limpiar error del campo
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }

    // Limpiar subcategoría si cambia la categoría
    if (field === 'categoria') {
      setFormData(prev => ({
        ...prev,
        subcategoria: ''
      }));
    }
  };

  const handleEspecificacionChange = (index, value) => {
    const nuevasEspecificaciones = [...formData.especificaciones];
    nuevasEspecificaciones[index] = value;
    setFormData(prev => ({
      ...prev,
      especificaciones: nuevasEspecificaciones
    }));

    if (errors.especificaciones) {
      setErrors(prev => ({
        ...prev,
        especificaciones: ''
      }));
    }
  };

  const agregarEspecificacion = () => {
    setFormData(prev => ({
      ...prev,
      especificaciones: [...prev.especificaciones, '']
    }));
  };

  const quitarEspecificacion = (index) => {
    if (formData.especificaciones.length > 1) {
      const nuevasEspecificaciones = formData.especificaciones.filter((_, i) => i !== index);
      setFormData(prev => ({
        ...prev,
        especificaciones: nuevasEspecificaciones
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
          <h3>{requisito ? 'Editar Requisito' : 'Nuevo Requisito'}</h3>
          <button 
            className="modal-close"
            onClick={onClose}
            disabled={saving}
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body">
          {/* Información básica */}
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Código *</label>
              <input
                type="text"
                className={`form-input ${errors.codigo ? 'error' : ''}`}
                value={formData.codigo}
                onChange={(e) => handleChange('codigo', e.target.value)}
                placeholder="REQ-01"
                disabled={saving}
              />
              {errors.codigo && <span className="field-error">{errors.codigo}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Categoría *</label>
              <select
                className="form-select"
                value={formData.categoria}
                onChange={(e) => handleChange('categoria', e.target.value)}
                disabled={saving}
              >
                {categorias.map(cat => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Título *</label>
            <input
              type="text"
              className={`form-input ${errors.titulo ? 'error' : ''}`}
              value={formData.titulo}
              onChange={(e) => handleChange('titulo', e.target.value)}
              placeholder="Constancia de Ingreso a IES"
              disabled={saving}
            />
            {errors.titulo && <span className="field-error">{errors.titulo}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">Descripción *</label>
            <textarea
              className={`form-textarea ${errors.descripcion ? 'error' : ''}`}
              value={formData.descripcion}
              onChange={(e) => handleChange('descripcion', e.target.value)}
              placeholder="Descripción detallada del requisito..."
              rows="3"
              disabled={saving}
            />
            {errors.descripcion && <span className="field-error">{errors.descripcion}</span>}
          </div>

          {/* Información del documento */}
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Subcategoría *</label>
              <select
                className={`form-select ${errors.subcategoria ? 'error' : ''}`}
                value={formData.subcategoria}
                onChange={(e) => handleChange('subcategoria', e.target.value)}
                disabled={saving}
              >
                <option value="">Seleccionar...</option>
                {subcategorias[formData.categoria]?.map(sub => (
                  <option key={sub} value={sub}>
                    {sub.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </option>
                ))}
              </select>
              {errors.subcategoria && <span className="field-error">{errors.subcategoria}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Tipo de Documento</label>
              <input
                type="text"
                className="form-input"
                value={formData.tipoDocumento}
                onChange={(e) => handleChange('tipoDocumento', e.target.value)}
                placeholder="Constancia oficial, Certificado, etc."
                disabled={saving}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Documento Requerido</label>
            <input
              type="text"
              className="form-input"
              value={formData.documentoRequerido}
              onChange={(e) => handleChange('documentoRequerido', e.target.value)}
              placeholder="Constancia de admisión, Certificado de estudios, etc."
              disabled={saving}
            />
          </div>

          {/* Especificaciones según bases del concurso */}
          <div className="form-group">
            <label className="form-label">Especificaciones según Bases *</label>
            {formData.especificaciones.map((especificacion, index) => (
              <div key={index} className="especificacion-row">
                <input
                  type="text"
                  className="form-input"
                  value={especificacion}
                  onChange={(e) => handleEspecificacionChange(index, e.target.value)}
                  placeholder="Especificación según bases del concurso"
                  disabled={saving}
                />
                <button
                  type="button"
                  className="btn-icon btn-danger"
                  onClick={() => quitarEspecificacion(index)}
                  disabled={formData.especificaciones.length === 1 || saving}
                >
                  <Minus size={16} />
                </button>
              </div>
            ))}
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={agregarEspecificacion}
              disabled={saving}
            >
              <Plus size={16} />
              Agregar Especificación
            </button>
            {errors.especificaciones && <span className="field-error">{errors.especificaciones}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">Observaciones</label>
            <textarea
              className="form-textarea"
              value={formData.observaciones}
              onChange={(e) => handleChange('observaciones', e.target.value)}
              placeholder="Observaciones adicionales (opcional)"
              rows="2"
              disabled={saving}
            />
          </div>

          {/* Modelos y ejemplos */}
          <div className="form-section">
            <h4>Modelos y Ejemplos</h4>
            
            <div className="form-row">
              <div className="form-group">
                <label className="checkbox-container">
                  <input
                    type="checkbox"
                    checked={formData.tieneModelo}
                    onChange={(e) => handleChange('tieneModelo', e.target.checked)}
                    disabled={saving}
                  />
                  <span className="checkbox-label">Tiene modelo de documento</span>
                </label>
                {formData.tieneModelo && (
                  <input
                    type="text"
                    className="form-input"
                    value={formData.urlModelo}
                    onChange={(e) => handleChange('urlModelo', e.target.value)}
                    placeholder="URL del modelo PDF"
                    disabled={saving}
                  />
                )}
              </div>

              <div className="form-group">
                <label className="checkbox-container">
                  <input
                    type="checkbox"
                    checked={formData.tieneImagen}
                    onChange={(e) => handleChange('tieneImagen', e.target.checked)}
                    disabled={saving}
                  />
                  <span className="checkbox-label">Tiene imagen de ejemplo</span>
                </label>
                {formData.tieneImagen && (
                  <input
                    type="text"
                    className="form-input"
                    value={formData.urlImagen}
                    onChange={(e) => handleChange('urlImagen', e.target.value)}
                    placeholder="URL de la imagen"
                    disabled={saving}
                  />
                )}
              </div>
            </div>
          </div>

          {/* Estado */}
          <div className="form-row">
            <div className="form-group">
              <label className="checkbox-container">
                <input
                  type="checkbox"
                  checked={formData.obligatorio}
                  onChange={(e) => handleChange('obligatorio', e.target.checked)}
                  disabled={saving}
                />
                <span className="checkbox-label">Requisito obligatorio</span>
              </label>
            </div>

            <div className="form-group">
              <label className="checkbox-container">
                <input
                  type="checkbox"
                  checked={formData.activo}
                  onChange={(e) => handleChange('activo', e.target.checked)}
                  disabled={saving}
                />
                <span className="checkbox-label">Requisito activo</span>
              </label>
            </div>
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
              {saving ? 'Guardando...' : (requisito ? 'Actualizar' : 'Crear')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RequisitoModal;