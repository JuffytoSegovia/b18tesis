// src/services/firestoreServices.js
import { 
  collection, 
  doc, 
  addDoc, 
  getDocs, 
  getDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy, 
  where,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from './firebase';

// ===== CONVOCATORIAS =====

export const convocatoriaService = {
  // Crear nueva convocatoria
  async create(convocatoriaData) {
    try {
      const docRef = await addDoc(collection(db, 'convocatorias'), {
        ...convocatoriaData,
        fechaCreacion: serverTimestamp(),
        fechaActualizacion: serverTimestamp()
      });
      
      return { 
        id: docRef.id, 
        ...convocatoriaData,
        fechaCreacion: new Date(),
        fechaActualizacion: new Date()
      };
    } catch (error) {
      console.error('Error creando convocatoria:', error);
      throw new Error('No se pudo crear la convocatoria');
    }
  },

  // Obtener todas las convocatorias
  async getAll() {
    try {
      const q = query(collection(db, 'convocatorias'), orderBy('ano', 'desc'));
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        fechaCreacion: doc.data().fechaCreacion?.toDate() || new Date(),
        fechaActualizacion: doc.data().fechaActualizacion?.toDate() || new Date()
      }));
    } catch (error) {
      console.error('Error obteniendo convocatorias:', error);
      throw new Error('No se pudieron cargar las convocatorias');
    }
  },

  // Obtener convocatorias activas (para dropdown usuario)
  async getActive() {
    try {
      const q = query(
        collection(db, 'convocatorias'), 
        where('activa', '==', true),
        orderBy('ano', 'desc')
      );
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        fechaCreacion: doc.data().fechaCreacion?.toDate() || new Date(),
        fechaActualizacion: doc.data().fechaActualizacion?.toDate() || new Date()
      }));
    } catch (error) {
      console.error('Error obteniendo convocatorias activas:', error);
      throw new Error('No se pudieron cargar las convocatorias activas');
    }
  },

  // Obtener una convocatoria por ID
  async getById(id) {
    try {
      const docRef = doc(db, 'convocatorias', id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...docSnap.data(),
          fechaCreacion: docSnap.data().fechaCreacion?.toDate() || new Date(),
          fechaActualizacion: docSnap.data().fechaActualizacion?.toDate() || new Date()
        };
      } else {
        throw new Error('Convocatoria no encontrada');
      }
    } catch (error) {
      console.error('Error obteniendo convocatoria:', error);
      throw new Error('No se pudo cargar la convocatoria');
    }
  },

  // Actualizar convocatoria
  async update(id, convocatoriaData) {
    try {
      const docRef = doc(db, 'convocatorias', id);
      await updateDoc(docRef, {
        ...convocatoriaData,
        fechaActualizacion: serverTimestamp()
      });
      
      return {
        id,
        ...convocatoriaData,
        fechaActualizacion: new Date()
      };
    } catch (error) {
      console.error('Error actualizando convocatoria:', error);
      throw new Error('No se pudo actualizar la convocatoria');
    }
  },

  // Eliminar convocatoria
  async delete(id) {
    try {
      const docRef = doc(db, 'convocatorias', id);
      await deleteDoc(docRef);
      return true;
    } catch (error) {
      console.error('Error eliminando convocatoria:', error);
      throw new Error('No se pudo eliminar la convocatoria');
    }
  }
};

// ===== ETAPAS =====

export const etapaService = {
  // Crear nueva etapa
  async create(convocatoriaId, etapaData) {
    try {
      const docRef = await addDoc(
        collection(db, 'convocatorias', convocatoriaId, 'etapas'), 
        {
          ...etapaData,
          convocatoriaId,
          fechaCreacion: serverTimestamp(),
          fechaActualizacion: serverTimestamp()
        }
      );
      
      return { 
        id: docRef.id, 
        ...etapaData,
        convocatoriaId,
        fechaCreacion: new Date(),
        fechaActualizacion: new Date()
      };
    } catch (error) {
      console.error('Error creando etapa:', error);
      throw new Error('No se pudo crear la etapa');
    }
  },

  // Obtener etapas de una convocatoria
  async getByConvocatoria(convocatoriaId) {
    try {
      const q = query(
        collection(db, 'convocatorias', convocatoriaId, 'etapas'),
        orderBy('orden', 'asc')
      );
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        fechaCreacion: doc.data().fechaCreacion?.toDate() || new Date(),
        fechaActualizacion: doc.data().fechaActualizacion?.toDate() || new Date()
      }));
    } catch (error) {
      console.error('Error obteniendo etapas:', error);
      throw new Error('No se pudieron cargar las etapas');
    }
  },

  // Actualizar etapa
  async update(convocatoriaId, etapaId, etapaData) {
    try {
      const docRef = doc(db, 'convocatorias', convocatoriaId, 'etapas', etapaId);
      await updateDoc(docRef, {
        ...etapaData,
        fechaActualizacion: serverTimestamp()
      });
      
      return {
        id: etapaId,
        ...etapaData,
        fechaActualizacion: new Date()
      };
    } catch (error) {
      console.error('Error actualizando etapa:', error);
      throw new Error('No se pudo actualizar la etapa');
    }
  },

  // Eliminar etapa
  async delete(convocatoriaId, etapaId) {
    try {
      const docRef = doc(db, 'convocatorias', convocatoriaId, 'etapas', etapaId);
      await deleteDoc(docRef);
      return true;
    } catch (error) {
      console.error('Error eliminando etapa:', error);
      throw new Error('No se pudo eliminar la etapa');
    }
  }
};

// ===== SECCIONES =====

export const seccionService = {
  // Crear nueva sección
  async create(convocatoriaId, etapaId, seccionData) {
    try {
      const docRef = await addDoc(
        collection(db, 'convocatorias', convocatoriaId, 'etapas', etapaId, 'secciones'), 
        {
          ...seccionData,
          convocatoriaId,
          etapaId,
          fechaCreacion: serverTimestamp(),
          fechaActualizacion: serverTimestamp()
        }
      );
      
      return { 
        id: docRef.id, 
        ...seccionData,
        convocatoriaId,
        etapaId,
        fechaCreacion: new Date(),
        fechaActualizacion: new Date()
      };
    } catch (error) {
      console.error('Error creando sección:', error);
      throw new Error('No se pudo crear la sección');
    }
  },

  // Obtener secciones de una etapa
  async getByEtapa(convocatoriaId, etapaId) {
    try {
      const q = query(
        collection(db, 'convocatorias', convocatoriaId, 'etapas', etapaId, 'secciones'),
        orderBy('orden', 'asc')
      );
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        fechaCreacion: doc.data().fechaCreacion?.toDate() || new Date(),
        fechaActualizacion: doc.data().fechaActualizacion?.toDate() || new Date()
      }));
    } catch (error) {
      console.error('Error obteniendo secciones:', error);
      throw new Error('No se pudieron cargar las secciones');
    }
  },

  // Actualizar sección
  async update(convocatoriaId, etapaId, seccionId, seccionData) {
    try {
      const docRef = doc(db, 'convocatorias', convocatoriaId, 'etapas', etapaId, 'secciones', seccionId);
      await updateDoc(docRef, {
        ...seccionData,
        fechaActualizacion: serverTimestamp()
      });
      
      return {
        id: seccionId,
        ...seccionData,
        fechaActualizacion: new Date()
      };
    } catch (error) {
      console.error('Error actualizando sección:', error);
      throw new Error('No se pudo actualizar la sección');
    }
  },

  // Eliminar sección
  async delete(convocatoriaId, etapaId, seccionId) {
    try {
      const docRef = doc(db, 'convocatorias', convocatoriaId, 'etapas', etapaId, 'secciones', seccionId);
      await deleteDoc(docRef);
      return true;
    } catch (error) {
      console.error('Error eliminando sección:', error);
      throw new Error('No se pudo eliminar la sección');
    }
  }
};