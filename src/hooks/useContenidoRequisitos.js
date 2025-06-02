// src/hooks/useContenidoRequisitos.js
import { useState, useEffect } from 'react';
import { 
  collection, 
  doc, 
  addDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  query, 
  where,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../services/firebase';

// Hook para manejar contenido de requisitos
export const useContenidoRequisitos = (convocatoriaId, etapaId, seccionId) => {
  const [requisitos, setRequisitos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadRequisitos = async () => {
    if (!convocatoriaId || !etapaId || !seccionId) {
      setRequisitos([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      // Quitar orderBy para evitar el error del índice
      const q = query(
        collection(db, 'contenido_requisitos'),
        where('convocatoriaId', '==', convocatoriaId),
        where('etapaId', '==', etapaId),
        where('seccionId', '==', seccionId)
      );
      
      const querySnapshot = await getDocs(q);
      
      const data = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        fechaCreacion: doc.data().fechaCreacion?.toDate() || new Date(),
        fechaActualizacion: doc.data().fechaActualizacion?.toDate() || new Date()
      }));
      
      // Ordenar en el cliente
      const dataOrdenada = data.sort((a, b) => (a.orden || 0) - (b.orden || 0));
      setRequisitos(dataOrdenada);
    } catch (err) {
      console.error('Error cargando requisitos:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const createRequisito = async (requisitoData) => {
    try {
      setError(null);
      
      const docRef = await addDoc(collection(db, 'contenido_requisitos'), {
        ...requisitoData,
        convocatoriaId,
        etapaId,
        seccionId,
        fechaCreacion: serverTimestamp(),
        fechaActualizacion: serverTimestamp()
      });
      
      const newRequisito = {
        id: docRef.id,
        ...requisitoData,
        convocatoriaId,
        etapaId,
        seccionId,
        fechaCreacion: new Date(),
        fechaActualizacion: new Date()
      };
      
      setRequisitos(prev => [...prev, newRequisito].sort((a, b) => (a.orden || 0) - (b.orden || 0)));
      return newRequisito;
    } catch (err) {
      console.error('Error creando requisito:', err);
      setError(err.message);
      throw err;
    }
  };

  const updateRequisito = async (requisitoId, requisitoData) => {
    try {
      setError(null);
      
      const docRef = doc(db, 'contenido_requisitos', requisitoId);
      await updateDoc(docRef, {
        ...requisitoData,
        fechaActualizacion: serverTimestamp()
      });
      
      setRequisitos(prev => 
        prev.map(req => 
          req.id === requisitoId 
            ? { ...req, ...requisitoData, fechaActualizacion: new Date() }
            : req
        ).sort((a, b) => (a.orden || 0) - (b.orden || 0))
      );
      
      return { id: requisitoId, ...requisitoData };
    } catch (err) {
      console.error('Error actualizando requisito:', err);
      setError(err.message);
      throw err;
    }
  };

  const deleteRequisito = async (requisitoId) => {
    try {
      setError(null);
      
      const docRef = doc(db, 'contenido_requisitos', requisitoId);
      await deleteDoc(docRef);
      
      setRequisitos(prev => prev.filter(req => req.id !== requisitoId));
      return true;
    } catch (err) {
      console.error('Error eliminando requisito:', err);
      setError(err.message);
      throw err;
    }
  };

  useEffect(() => {
    loadRequisitos();
  }, [convocatoriaId, etapaId, seccionId]);

  return {
    requisitos,
    loading,
    error,
    createRequisito,
    updateRequisito,
    deleteRequisito,
    reloadRequisitos: loadRequisitos
  };
};