// src/hooks/useFirestore.js
import { useState, useEffect } from 'react';
import { convocatoriaService, etapaService, seccionService } from '../services/firestoreServices';

// Hook para manejar convocatorias
export const useConvocatorias = () => {
  const [convocatorias, setConvocatorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadConvocatorias = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await convocatoriaService.getAll();
      setConvocatorias(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const createConvocatoria = async (convocatoriaData) => {
    try {
      setError(null);
      const newConvocatoria = await convocatoriaService.create(convocatoriaData);
      setConvocatorias(prev => [newConvocatoria, ...prev]);
      return newConvocatoria;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const updateConvocatoria = async (id, convocatoriaData) => {
    try {
      setError(null);
      const updatedConvocatoria = await convocatoriaService.update(id, convocatoriaData);
      setConvocatorias(prev => 
        prev.map(conv => conv.id === id ? { ...conv, ...updatedConvocatoria } : conv)
      );
      return updatedConvocatoria;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const deleteConvocatoria = async (id) => {
    try {
      setError(null);
      await convocatoriaService.delete(id);
      setConvocatorias(prev => prev.filter(conv => conv.id !== id));
      return true;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  useEffect(() => {
    loadConvocatorias();
  }, []);

  return {
    convocatorias,
    loading,
    error,
    createConvocatoria,
    updateConvocatoria,
    deleteConvocatoria,
    reloadConvocatorias: loadConvocatorias
  };
};

// Hook para convocatorias activas (dropdown usuario)
export const useActiveConvocatorias = () => {
  const [activeConvocatorias, setActiveConvocatorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadActiveConvocatorias = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await convocatoriaService.getActive();
      setActiveConvocatorias(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadActiveConvocatorias();
  }, []);

  return {
    activeConvocatorias,
    loading,
    error,
    reloadActiveConvocatorias: loadActiveConvocatorias
  };
};

// Hook para manejar etapas
export const useEtapas = (convocatoriaId) => {
  const [etapas, setEtapas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadEtapas = async () => {
    if (!convocatoriaId) {
      setEtapas([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await etapaService.getByConvocatoria(convocatoriaId);
      setEtapas(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const createEtapa = async (etapaData) => {
    try {
      setError(null);
      const newEtapa = await etapaService.create(convocatoriaId, etapaData);
      setEtapas(prev => [...prev, newEtapa].sort((a, b) => a.orden - b.orden));
      return newEtapa;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const updateEtapa = async (etapaId, etapaData) => {
    try {
      setError(null);
      const updatedEtapa = await etapaService.update(convocatoriaId, etapaId, etapaData);
      setEtapas(prev => 
        prev.map(etapa => etapa.id === etapaId ? { ...etapa, ...updatedEtapa } : etapa)
      );
      return updatedEtapa;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const deleteEtapa = async (etapaId) => {
    try {
      setError(null);
      await etapaService.delete(convocatoriaId, etapaId);
      setEtapas(prev => prev.filter(etapa => etapa.id !== etapaId));
      return true;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  useEffect(() => {
    loadEtapas();
  }, [convocatoriaId]);

  return {
    etapas,
    loading,
    error,
    createEtapa,
    updateEtapa,
    deleteEtapa,
    reloadEtapas: loadEtapas
  };
};

// Hook para manejar secciones
export const useSecciones = (convocatoriaId, etapaId) => {
  const [secciones, setSecciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadSecciones = async () => {
    if (!convocatoriaId || !etapaId) {
      setSecciones([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await seccionService.getByEtapa(convocatoriaId, etapaId);
      setSecciones(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const createSeccion = async (seccionData) => {
    try {
      setError(null);
      const newSeccion = await seccionService.create(convocatoriaId, etapaId, seccionData);
      setSecciones(prev => [...prev, newSeccion].sort((a, b) => a.orden - b.orden));
      return newSeccion;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const updateSeccion = async (seccionId, seccionData) => {
    try {
      setError(null);
      const updatedSeccion = await seccionService.update(convocatoriaId, etapaId, seccionId, seccionData);
      setSecciones(prev => 
        prev.map(seccion => seccion.id === seccionId ? { ...seccion, ...updatedSeccion } : seccion)
      );
      return updatedSeccion;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const deleteSeccion = async (seccionId) => {
    try {
      setError(null);
      await seccionService.delete(convocatoriaId, etapaId, seccionId);
      setSecciones(prev => prev.filter(seccion => seccion.id !== seccionId));
      return true;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  useEffect(() => {
    loadSecciones();
  }, [convocatoriaId, etapaId]);

  return {
    secciones,
    loading,
    error,
    createSeccion,
    updateSeccion,
    deleteSeccion,
    reloadSecciones: loadSecciones
  };
};