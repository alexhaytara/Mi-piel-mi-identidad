// src/pages/IdentidadPage.tsx
import React, { useState, useEffect } from 'react';
import { Save, Edit2, Trash2 } from 'lucide-react';
import identidadImg from '../assets/identidad01.jpeg';
import {
  guardarRespuestaIdentidad,
  obtenerRespuestasIdentidad,
} from '../services/dbService';

interface PreguntaIdentidad {
  id: number;
  pregunta: string;
  respuesta: string;
  editando: boolean;
}

interface IdentidadPageProps {
  userId: string;
}

const PREGUNTAS_INICIALES = [
  {
    id: 1,
    pregunta: 'Escribe tres cualidades tuyas que no dependan de tu apariencia.',
  },
  {
    id: 2,
    pregunta: 'Menciona dos intereses o actividades que te representen y explica por qué.',
  },
  {
    id: 3,
    pregunta: 'Describe un momento en el que te hayas sentido orgulloso/a de ti por algo distinto a tu apariencia.',
  },
  {
    id: 4,
    pregunta: '¿Qué le dirías a una amistad que se siente insegura por su piel?',
  },
  {
    id: 5,
    pregunta: 'Completa: Mi piel es una parte de mí, pero mi identidad también se construye con...',
  },
];

export const IdentidadPage: React.FC<IdentidadPageProps> = ({ userId }) => {
  const [preguntas, setPreguntas] = useState<PreguntaIdentidad[]>([]);
  const [cargando, setCargando] = useState<boolean>(true);

  // 1. Cargar las respuestas desde Firestore al entrar
  useEffect(() => {
    let cancelado = false;

    const cargarRespuestasBD = async () => {
      if (!userId) {
        setCargando(false);
        return;
      }

      setCargando(true);
      try {
        const mapaRespuestas = await obtenerRespuestasIdentidad(userId);

        if (!cancelado) {
          const listaConstruida: PreguntaIdentidad[] = PREGUNTAS_INICIALES.map((item) => {
            const respuestaGuardada = mapaRespuestas[item.id] || '';
            return {
              id: item.id,
              pregunta: item.pregunta,
              respuesta: respuestaGuardada,
              // Si ya tiene una respuesta guardada, se muestra en modo lectura; si está vacía, en modo edición.
              editando: respuestaGuardada.trim() === '',
            };
          });

          setPreguntas(listaConstruida);
        }
      } catch (error) {
        console.error('Error al cargar respuestas de identidad:', error);
      } finally {
        if (!cancelado) {
          setCargando(false);
        }
      }
    };

    cargarRespuestasBD();

    return () => {
      cancelado = true;
    };
  }, [userId]);

  // Manejador del cambio de texto
  const handleTextChange = (id: number, text: string) => {
    setPreguntas((prev) =>
      prev.map((item) => (item.id === id ? { ...item, respuesta: text } : item))
    );
  };

  // 2. Guardar respuesta en Firebase
  const handleGuardar = async (id: number) => {
    const preguntaActual = preguntas.find((p) => p.id === id);
    if (!preguntaActual) return;

    try {
      // Guardar en Firestore
      await guardarRespuestaIdentidad(userId, id, preguntaActual.respuesta);

      // Cambiar estado local a modo lectura
      setPreguntas((prev) =>
        prev.map((item) => (item.id === id ? { ...item, editando: false } : item))
      );
    } catch (error) {
      console.error('Error al guardar la respuesta:', error);
    }
  };

  // Activar modo edición
  const handleEditar = (id: number) => {
    setPreguntas((prev) =>
      prev.map((item) => (item.id === id ? { ...item, editando: true } : item))
    );
  };

  // 3. Eliminar (limpiar respuesta) en Firebase
  const handleEliminar = async (id: number) => {
    try {
      // Guardar cadena vacía en Firestore
      await guardarRespuestaIdentidad(userId, id, '');

      // Limpiar texto local y habilitar edición
      setPreguntas((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, respuesta: '', editando: true } : item
        )
      );
    } catch (error) {
      console.error('Error al eliminar la respuesta:', error);
    }
  };

  if (cargando) {
    return (
      <div className="flex flex-col justify-center items-center py-24 space-y-3">
        <div className="w-8 h-8 border-3 border-purple-200 border-t-purple-800 rounded-full animate-spin" />
        <p className="text-sm font-semibold text-purple-900 animate-pulse font-serif">
          Cargando tu reflexión... 🌿
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* BANNER SUPERIOR CON IMAGEN IDENTIDAD01.JPEG */}
      <div className="bg-emerald-50/40 border border-purple-100/60 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row justify-between items-center gap-6 relative overflow-hidden shadow-2xs">
        <div className="max-w-xl space-y-3 z-10">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-purple-950 font-serif leading-tight">
            Puedes cuidar tu piel y aceptarte mientras atraviesas cambios
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
            Tu piel forma parte de tu historia, pero hay muchas más cosas que te hacen ser tú.
            Aquí puedes reflexionar sobre lo que te define, más allá de tu apariencia.
          </p>
        </div>

        <div className="relative shrink-0 flex justify-center items-center w-36 h-36 sm:w-44 sm:h-44">
          <img
            src={identidadImg}
            alt="Identidad"
            className="w-full h-full object-contain drop-shadow-sm rounded-2xl"
          />
        </div>
      </div>

      {/* LISTA DE PREGUNTAS REFLEXIVAS */}
      <div className="space-y-4">
        {preguntas.map((item) => (
          <div
            key={item.id}
            className="bg-white/90 border border-purple-100/80 rounded-2xl p-5 sm:p-6 shadow-2xs transition-all hover:border-purple-200"
          >
            <div className="flex flex-col sm:flex-row items-start gap-4 justify-between">
              
              {/* NÚMERO Y PREGUNTA CON TEXTAREA */}
              <div className="flex gap-3.5 items-start flex-1 w-full">
                <span className="w-8 h-8 rounded-full bg-purple-200/70 text-purple-900 font-bold text-sm flex items-center justify-center shrink-0 mt-0.5">
                  {item.id}
                </span>

                <div className="space-y-3 flex-1 w-full">
                  <h2 className="font-bold text-gray-900 text-sm sm:text-base leading-snug">
                    {item.pregunta}
                  </h2>

                  <textarea
                    rows={3}
                    disabled={!item.editando}
                    value={item.respuesta}
                    onChange={(e) => handleTextChange(item.id, e.target.value)}
                    placeholder="Escribe aquí tu respuesta..."
                    className={`w-full p-3.5 text-xs sm:text-sm rounded-xl border transition-all resize-none outline-none ${
                      item.editando
                        ? 'bg-gray-50/60 border-gray-200 text-gray-800 focus:bg-white focus:border-purple-300 focus:ring-2 focus:ring-purple-100'
                        : 'bg-gray-100/50 border-transparent text-gray-600 cursor-not-allowed'
                    }`}
                  />
                </div>
              </div>

              {/* BOTONES LATERALES DE ACCIÓN */}
              <div className="flex sm:flex-col gap-2 w-full sm:w-28 shrink-0 justify-end sm:justify-start pt-2 sm:pt-0">
                <button
                  type="button"
                  onClick={() => handleGuardar(item.id)}
                  disabled={!item.editando}
                  className={`w-full py-1.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    item.editando
                      ? 'bg-emerald-200/70 hover:bg-emerald-300/80 text-emerald-950 border border-emerald-300/60'
                      : 'bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed'
                  }`}
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Guardar</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleEditar(item.id)}
                  disabled={item.editando}
                  className={`w-full py-1.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    !item.editando
                      ? 'bg-purple-100 hover:bg-purple-200 text-purple-900 border border-purple-200'
                      : 'bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed'
                  }`}
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Editar</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleEliminar(item.id)}
                  className="w-full py-1.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 bg-rose-100/70 hover:bg-rose-200/80 text-rose-900 border border-rose-200/80 transition-all cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Eliminar</span>
                </button>
              </div>

            </div>
          </div>
        ))}
      </div>
    </div>
  );
};