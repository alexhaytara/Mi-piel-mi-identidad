// src/pages/PerfilPage.tsx
import React, { useState, useEffect } from 'react';
import { guardarPerfil, obtenerPerfil } from '../services/dbService';

interface PerfilPageProps {
  userId: string;
  setUserName?: (name: string) => void;
}

export const PerfilPage: React.FC<PerfilPageProps> = ({ userId, setUserName }) => {
  const [nombre, setNombre] = useState('');
  const [tipoPiel, setTipoPiel] = useState('mixta');
  const [condicion, setCondicion] = useState('leve');
  const [sensibilidad, setSensibilidad] = useState('no');
  const [notas, setNotas] = useState('');

  // Estados de control de la interfaz
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [mensajeExito, setMensajeExito] = useState(false);

  // Obtener la fecha de hoy en formato YYYY-MM-DD
  const obtenerFechaHoy = () => new Date().toISOString().split('T')[0];

  // 1. Cargar el perfil existente desde Firebase Firestore
  useEffect(() => {
    const cargarDatosPerfil = async () => {
      try {
        const datos = await obtenerPerfil(userId);
        if (datos) {
          if (datos.nombre) setNombre(datos.nombre);
          if (datos.tipoPiel) setTipoPiel(datos.tipoPiel);
          if (datos.condicion) setCondicion(datos.condicion);
          if (datos.sensibilidad) setSensibilidad(datos.sensibilidad);
          if (datos.notas) setNotas(datos.notas);
        }
      } catch (error) {
        console.error("Error al cargar perfil:", error);
      } finally {
        setCargando(false);
      }
    };

    if (userId) cargarDatosPerfil();
  }, [userId]);

  // 2. Guardar en Firebase Firestore
  const handleGuardar = async () => {
    setGuardando(true);
    setMensajeExito(false);
    const fechaHoy = obtenerFechaHoy();

    try {
      await guardarPerfil(userId, {
        nombre,
        tipoPiel,
        condicion,
        sensibilidad,
        notas,
        fechaActualizacion: fechaHoy,
      });

      if (setUserName && nombre) {
        setUserName(nombre);
      }

      setMensajeExito(true);
      setTimeout(() => setMensajeExito(false), 3500);
    } catch (error) {
      console.error("Error al guardar perfil:", error);
      alert("Ocurrió un error al guardar tu perfil en Firebase.");
    } finally {
      setGuardando(false);
    }
  };

  if (cargando) {
    return (
      <div className="flex justify-center items-center py-16">
        <p className="text-sm font-semibold text-purple-900 animate-pulse font-serif">
          Cargando tu perfil de piel... 🌿
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 sm:p-8 bg-white/80 backdrop-blur-md rounded-3xl shadow-sm border border-purple-100/60 space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-purple-900 font-serif">Mi Perfil</h2>
        <p className="text-sm text-gray-500 mt-1">
          Define tus preferencias personales y las características de tu piel para adaptar tus recomendaciones.
        </p>
      </div>

      <div className="space-y-6">
        
        {/* Nombre Preferido */}
        <div className="p-4 bg-purple-50/50 rounded-2xl border border-purple-100/80">
          <label className="block text-sm font-bold text-gray-800 mb-2">
            👤 ¿Cómo te gusta que te llamemos en la app?
          </label>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Ej. Isa, María, Alex..."
            className="w-full p-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-400 focus:outline-none text-sm bg-white"
          />
        </div>

        {/* 1. Tipo de piel */}
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-3">
            1. ¿Cómo notas habitualmente tu piel?
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { id: 'seca', label: 'Seca' },
              { id: 'mixta', label: 'Mixta' },
              { id: 'grasa', label: 'Tendencia a grasa' },
              { id: 'sensible', label: 'Sensibilidad alta' }
            ].map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setTipoPiel(item.id)}
                className={`py-3 px-4 rounded-xl text-sm font-medium border text-center transition-all cursor-pointer ${
                  tipoPiel === item.id
                    ? 'bg-purple-700 text-white border-purple-700 shadow-sm'
                    : 'bg-white/90 border-gray-200 text-gray-700 hover:bg-purple-50'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* 2. Tendencia / imperfecciones */}
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-3">
            2. ¿Qué frecuencia/tendencia notas?
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { id: 'ninguno', label: 'Poca' },
              { id: 'leve', label: 'Ocasional' },
              { id: 'moderado', label: 'Frecuente' },
              { id: 'severo', label: 'Constante' }
            ].map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setCondicion(item.id)}
                className={`py-3 px-4 rounded-xl text-sm font-medium border text-center transition-all cursor-pointer ${
                  condicion === item.id
                    ? 'bg-purple-700 text-white border-purple-700 shadow-sm'
                    : 'bg-white/90 border-gray-200 text-gray-700 hover:bg-purple-50'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* 3. Reacción a productos */}
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-3">
            3. ¿Sueles tener reacciones a productos o picazón/enrojecimiento?
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { id: 'si', label: 'Sí' },
              { id: 'no', label: 'No' },
              { id: 'a veces', label: 'En zonas específicas' }
            ].map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setSensibilidad(item.id)}
                className={`py-3 px-4 rounded-xl text-sm font-medium border text-center transition-all cursor-pointer ${
                  sensibilidad === item.id
                    ? 'bg-purple-700 text-white border-purple-700 shadow-sm'
                    : 'bg-white/90 border-gray-200 text-gray-700 hover:bg-purple-50'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* 4. Notas / Comentarios */}
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">
            📝 Comentarios u observaciones adicionales
          </label>
          <textarea
            value={notas}
            onChange={(e) => setNotas(e.target.value)}
            rows={3}
            placeholder="Escribe si sigues algún tratamiento médico, alergias o detalles relevantes..."
            className="w-full p-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-400 focus:outline-none text-sm bg-white"
          />
        </div>

        {/* Mensaje de confirmación al guardar */}
        {mensajeExito && (
          <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm rounded-xl text-center font-medium">
            ¡Perfil actualizado y guardado correctamente! ✨
          </div>
        )}

        {/* Botón de Guardado */}
        <button
          type="button"
          onClick={handleGuardar}
          disabled={guardando}
          className="w-full bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white font-medium py-3.5 rounded-xl transition-colors shadow-sm cursor-pointer text-sm"
        >
          {guardando ? 'Guardando cambios...' : 'Guardar perfil'}
        </button>

      </div>
    </div>
  );
};