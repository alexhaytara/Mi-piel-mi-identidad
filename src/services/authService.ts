// src/services/authService.ts
import { auth } from './firebase';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
} from 'firebase/auth';
import type { User } from 'firebase/auth';

// Registrar usuario nuevo
export const registrarUsuario = async (email: string, pass: string) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
  return userCredential.user;
};

// Iniciar sesión
export const iniciarSesion = async (email: string, pass: string) => {
  const userCredential = await signInWithEmailAndPassword(auth, email, pass);
  return userCredential.user;
};

// Cerrar sesión
export const cerrarSesion = async () => {
  await signOut(auth);
};

// Escuchar cambios de estado (Saber si hay un usuario logueado)
export const suscribirEstadoAuth = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};