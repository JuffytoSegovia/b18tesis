// src/components/user/RequisitosList.jsx
import React from 'react';

const RequisitosList = ({ convocatoriaId, etapaId }) => {
  // Mock data - esto será reemplazado por datos de Firebase
  const requisitos = [
    {
      id: '1',
      titulo: 'Documento de Identidad',
      descripcion: 'DNI vigente del postulante. Debe estar en buen estado y legible.',
      icono: '🆔',
      categoria: 'documentos_basicos'
    },
    {
      id: '2',
      titulo: 'Certificado de Estudios',
      descripcion: 'Certificado oficial de estudios secundarios completos con promedio mínimo.',
      icono: '🎓',
      categoria: 'documentos_academicos'
    },
    {
      id: '3',
      titulo: 'Declaración Socioeconómica',
      descripcion: 'Formulario completo con información familiar y económica actualizada.',
      icono: '📋',
      categoria: 'documentos_socioeconomicos'
    },
    {
      id: '4',
      titulo: 'Comprobante de Domicilio',
      descripcion: 'Recibo de servicios públicos o documento que acredite domicilio actual.',
      icono: '🏠',
      categoria: 'documentos_basicos'
    }
  ];

  return (
    <div className="seccion-content">
      <h2>Requisitos de Postulación</h2>
      <p className="ultima-actualizacion">📅 Última actualización: 15 de mayo, 2025</p>
      
      <div className="documentos-section">
        <h3>Documentos Requeridos</h3>
        
        <div className="requisitos-grid">
          {requisitos.map((requisito) => (
            <div key={requisito.id} className="requisito-card">
              <div className="requisito-header">
                <span className="requisito-icono">{requisito.icono}</span>
                <h4 className="requisito-titulo">{requisito.titulo}</h4>
              </div>
              <p className="requisito-descripcion">{requisito.descripcion}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RequisitosList;