// src/services/dbService.ts
import { db } from './firebase';
import { 
  doc, 
  setDoc, 
  getDoc, 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where 
} from 'firebase/firestore';

// ==========================================
// 1. PERFIL Y AJUSTES
// ==========================================
export interface PerfilData {
  nombre: string;
  tipoPiel: string;
  condicion: string;
  sensibilidad: string;
  notificaciones?: boolean;
}

export const guardarPerfil = async (userId: string, data: PerfilData) => {
  const ref = doc(db, 'perfiles', userId);
  await setDoc(ref, { ...data, updatedAt: new Date().toISOString() }, { merge: true });
};

export const obtenerPerfil = async (userId: string): Promise<PerfilData | null> => {
  const ref = doc(db, 'perfiles', userId);
  const snap = await getDoc(ref);
  return snap.exists() ? (snap.data() as PerfilData) : null;
};

// ==========================================
// 2. REGISTRO DIARIO Y EVOLUCIÓN
// ==========================================
export interface RegistroDiario {
  id?: string;
  fecha: string;
  fechaID?: string;
  signos?: string[];
  intensidades?: Record<string, string>;
  productos?: string[];
  rutina?: string;
  animo?: string;
  sentimientoPiel?: string;
  comodidad?: string;
  reflexion?: string;
  noProductos?: boolean;
  updatedAt?: any;
}

export const guardarRegistroDiario = async (userId: string, registro: Omit<RegistroDiario, 'id'>) => {
  // Guarda directamente en la subcolección del usuario
  const fechaDoc = registro.fechaID || new Date().toISOString().split('T')[0];
  const ref = doc(db, 'users', userId, 'registros_diarios', fechaDoc);
  await setDoc(ref, {
    ...registro,
    updatedAt: new Date().toISOString(),
  }, { merge: true });
};

export const obtenerHistorial = async (userId: string): Promise<RegistroDiario[]> => {
  try {
    // Consulta la SUBCOLECCIÓN real de Firestore: users/{userId}/registros_diarios
    const ref = collection(db, 'users', userId, 'registros_diarios');
    const snap = await getDocs(ref);
    
    return snap.docs.map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data(),
    })) as RegistroDiario[];
  } catch (error) {
    console.error('Error al obtener el historial de la subcolección:', error);
    return [];
  }
};

// ==========================================
// 3. IDENTIDAD
// ==========================================
export const guardarRespuestaIdentidad = async (userId: string, preguntaId: number, respuesta: string) => {
  const docId = `${userId}_${preguntaId}`;
  const ref = doc(db, 'respuestas_identidad', docId);
  await setDoc(ref, {
    userId,
    preguntaId,
    respuesta,
    updatedAt: new Date().toISOString(),
  });
};

export const obtenerRespuestasIdentidad = async (userId: string): Promise<Record<number, string>> => {
  const ref = collection(db, 'respuestas_identidad');
  const q = query(ref, where('userId', '==', userId));
  const snap = await getDocs(q);
  
  const mapa: Record<number, string> = {};
  snap.docs.forEach((docSnap) => {
    const data = docSnap.data();
    mapa[data.preguntaId] = data.respuesta;
  });
  
  return mapa;
};