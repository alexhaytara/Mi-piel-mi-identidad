// src/pages/AjustesPage.tsx
import React, { useState } from 'react';
import { ShieldCheck, Lock, LogOut, Trash2, Loader2, Info } from 'lucide-react';
import { auth, db } from '../services/firebase';
import { deleteUser } from 'firebase/auth';
import { doc, deleteDoc } from 'firebase/firestore';

interface AjustesPageProps {
  onLogout?: () => void;
  userId?: string;
}

export const AjustesPage: React.FC<AjustesPageProps> = ({ onLogout, userId }) => {
  const [cargandoEliminacion, setCargandoEliminacion] = useState(false);

  // Función para eliminar la cuenta y los datos del usuario en Firebase
  const handleEliminarCuenta = async () => {
    const usuarioActual = auth.currentUser;
    if (!usuarioActual) return;

    const confirmacion = confirm(
      '¿Estás seguro/a de que deseas eliminar tu cuenta y todos tus datos (estado de ánimo, productos y reflexiones)? Esta acción no se puede deshacer.'
    );

    if (!confirmacion) return;

    setCargandoEliminacion(true);

    try {
      const uid = userId || usuarioActual.uid;

      // Borrar documento del usuario en Firestore (si existe)
      try {
        await deleteDoc(doc(db, 'usuarios', uid));
      } catch (err) {
        console.warn('No se pudo eliminar el documento en Firestore:', err);
      }

      // Eliminar usuario de Firebase Auth
      await deleteUser(usuarioActual);

      alert('Tu cuenta y todos tus datos han sido eliminados correctamente.');
      if (onLogout) onLogout();
    } catch (error: any) {
      console.error('Error al eliminar la cuenta:', error);

      if (error.code === 'auth/requires-recent-login') {
        alert(
          'Por razones de seguridad, debes volver a iniciar sesión antes de eliminar tu cuenta.'
        );
        if (onLogout) onLogout();
      } else {
        alert('Ocurrió un error al eliminar tu cuenta. Por favor, inténtalo de nuevo.');
      }
    } finally {
      setCargandoEliminacion(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 sm:p-8 bg-white/80 backdrop-blur-md rounded-3xl shadow-sm border border-purple-100/70 space-y-8 pb-12">
      
      {/* CABECERA */}
      <div className="border-b border-purple-100/60 pb-3">
        <h1 className="text-2xl sm:text-3xl font-bold text-purple-950 font-serif">
          Ajustes y Configuración
        </h1>
        <p className="text-xs sm:text-sm text-gray-600 mt-1">
          Gestiona las preferencias y conoce la política de privacidad de tu cuenta.
        </p>
      </div>

      <div className="space-y-5">
        
        {/* 1. INFORMACIÓN SOBRE PRIVACIDAD Y DATOS RECOPILADOS */}
        <div className="bg-purple-50/40 border border-purple-100/80 rounded-2xl p-5 space-y-3">
          <div className="flex items-center gap-3 border-b border-purple-100/60 pb-3">
            <div className="w-9 h-9 rounded-xl bg-purple-100 flex items-center justify-center text-purple-800 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-gray-900 text-sm sm:text-base">
                Protección de tu privacidad y datos
              </h2>
              <p className="text-xs text-gray-500">¿Qué información guardamos y cómo la protegemos?</p>
            </div>
          </div>

          <div className="text-xs sm:text-sm text-gray-700 leading-relaxed space-y-2 pt-1">
            <p>
              Guardamos únicamente información sobre tu <span className="font-semibold text-purple-900">perfil, estado de ánimo, productos de tu rutina y reflexiones</span> para darte una experiencia personalizada.
            </p>
            <div className="flex items-start gap-2 bg-purple-100/50 p-3 rounded-xl border border-purple-200/50">
              <Info className="w-4 h-4 text-purple-800 shrink-0 mt-0.5" />
              <p className="text-xs text-purple-950">
                Esta página web <strong>nunca solicitará tu nombre completo, colegio, ubicación ni fotografías</strong>, protegiendo tu identidad en todo momento.
              </p>
            </div>
          </div>
        </div>

        {/* 2. ESPACIO PRIVADO Y SIN FOROS PÚBLICOS */}
        <div className="bg-white/90 border border-purple-100/80 rounded-2xl p-5 space-y-3 shadow-2xs">
          <div className="flex items-center gap-3 border-b border-purple-100/60 pb-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-800 shrink-0">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-gray-900 text-sm sm:text-base">
                Espacio 100% privado
              </h2>
              <p className="text-xs text-gray-500">Tu información es solo para ti</p>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-gray-700 leading-relaxed pt-1">
            La información de cada usuario es estrictamente personal. No existen perfiles públicos ni foros para comentar o interactuar sobre otras personas, garantizando un entorno seguro y libre de conflictos.
          </p>
        </div>

        {/* 3. SECCIÓN DE ACCIONES (CERRAR SESIÓN Y ELIMINAR CUENTA) */}
        <div className="pt-4 border-t border-purple-100/60 flex flex-col sm:flex-row gap-3 justify-between items-center">
          <button
            type="button"
            onClick={onLogout}
            disabled={cargandoEliminacion}
            className="w-full sm:w-auto px-6 py-3 bg-purple-100 hover:bg-purple-200 text-purple-950 font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer border border-purple-200/60"
          >
            <LogOut className="w-4 h-4" />
            <span>Cerrar sesión</span>
          </button>

          <button
            type="button"
            onClick={handleEliminarCuenta}
            disabled={cargandoEliminacion}
            className="w-full sm:w-auto px-6 py-3 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer border border-rose-200/80 disabled:opacity-50"
          >
            {cargandoEliminacion ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Trash2 className="w-4 h-4" />
            )}
            <span>
              {cargandoEliminacion ? 'Eliminando...' : 'Eliminar mi cuenta y mis datos'}
            </span>
          </button>
        </div>

      </div>

    </div>
  );
};