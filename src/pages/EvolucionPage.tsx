// src/pages/EvolucionPage.tsx
import React, { useState, useEffect, useMemo } from 'react';
import { Info, FileText, Calendar } from 'lucide-react';
import { obtenerHistorial } from '../services/dbService';

export interface RegistroHistorial {
  id: string;
  fecha: string;
  signos: string[];
  animo: 'Muy bien' | 'Bien' | 'Neutral' | 'Mal' | 'Muy mal' | null;
  comodidad: 'Muy cómodo/a' | 'Cómodo/a' | 'Neutral' | 'Incómodo/a' | 'Muy incómodo/a' | null;
}

interface EvolucionPageProps {
  userId: string;
  registrosExistentes?: RegistroHistorial[];
}

const NIVELES_ANIMO = ['Muy mal', 'Mal', 'Neutral', 'Bien', 'Muy bien'] as const;
const NIVELES_COMODIDAD = [
  'Muy incómodo/a',
  'Incómodo/a',
  'Neutral',
  'Cómodo/a',
  'Muy cómodo/a',
] as const;

export const EvolucionPage: React.FC<EvolucionPageProps> = ({
  userId,
  registrosExistentes = [],
}) => {
  const [registros, setRegistros] = useState<RegistroHistorial[]>(registrosExistentes);
  const [cargando, setCargando] = useState<boolean>(true);
  const [filtroTiempo, setFiltroTiempo] = useState<'7dias' | '30dias' | 'todo'>('7dias');

  // Consulta Firestore cada vez que entra a la pestaña
  useEffect(() => {
    let cancelado = false;

    const cargarRegistrosBD = async () => {
      if (!userId) {
        setCargando(false);
        return;
      }

      setCargando(true);
      try {
        const datosBD = await obtenerHistorial(userId);

        if (!cancelado && Array.isArray(datosBD)) {
          const registrosMapeados: RegistroHistorial[] = datosBD.map((item, index) => {
            
            // 1. Normalización Estado de Ánimo
            let animoNormalizado: RegistroHistorial['animo'] = null;
            if (item.animo) {
              const a = item.animo.toString().toLowerCase();
              if (a.includes('muy bien')) animoNormalizado = 'Muy bien';
              else if (a.includes('muy mal')) animoNormalizado = 'Muy mal';
              else if (a.includes('bien')) animoNormalizado = 'Bien';
              else if (a.includes('mal')) animoNormalizado = 'Mal';
              else if (a.includes('neutral')) animoNormalizado = 'Neutral';
            }

            // 2. Normalización Comodidad desde 'sentimientoPiel' o 'comodidad'
            let comodidadNormalizada: RegistroHistorial['comodidad'] = null;
            const valorSentimiento = item.sentimientoPiel || item.comodidad;
            if (valorSentimiento) {
              const c = valorSentimiento.toString().toLowerCase();
              if (c.includes('muy cómodo') || c.includes('muy comodo')) comodidadNormalizada = 'Muy cómodo/a';
              else if (c.includes('muy incómodo') || c.includes('muy incomodo')) comodidadNormalizada = 'Muy incómodo/a';
              else if (c.includes('cómodo') || c.includes('comodo')) comodidadNormalizada = 'Cómodo/a';
              else if (c.includes('incómodo') || c.includes('incomodo')) comodidadNormalizada = 'Incómodo/a';
              else if (c.includes('neutral')) comodidadNormalizada = 'Neutral';
            }

            // 3. Normalización de Fecha
            let fechaTexto = item.fecha || item.fechaID || '';
            if (fechaTexto.includes('-') && fechaTexto.length === 10) {
              const [ano, mes, dia] = fechaTexto.split('-');
              fechaTexto = `${dia}/${mes}/${ano}`;
            }

            return {
              id: item.id || `reg-${index}`,
              fecha: fechaTexto || 'Sin fecha',
              signos: Array.isArray(item.signos) ? item.signos : [],
              animo: animoNormalizado,
              comodidad: comodidadNormalizada,
            };
          });

          // Ordenar cronológicamente del más reciente al más antiguo
          setRegistros(registrosMapeados.reverse());
        }
      } catch (error) {
        console.error('Error al consultar la evolución desde la base de datos:', error);
      } finally {
        if (!cancelado) {
          setCargando(false);
        }
      }
    };

    cargarRegistrosBD();

    return () => {
      cancelado = true;
    };
  }, [userId]);

  const hoyFecha = useMemo(() => {
    return new Date().toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  }, []);

  const historialFiltrado = useMemo(() => {
    if (!registros || registros.length === 0) return [];
    if (filtroTiempo === 'todo') return registros;

    const limiteDias = filtroTiempo === '7dias' ? 7 : 30;
    return registros.slice(0, limiteDias);
  }, [registros, filtroTiempo]);

  const frecuenciaSignos = useMemo(() => {
    const conteo = { Brotes: 0, Descamación: 0, Irritación: 0 };

    historialFiltrado.forEach((reg) => {
      if (Array.isArray(reg.signos)) {
        reg.signos.forEach((s) => {
          if (s in conteo) {
            conteo[s as keyof typeof conteo] += 1;
          }
        });
      }
    });

    return conteo;
  }, [historialFiltrado]);

  const maxFrecuencia = useMemo(() => {
    const max = Math.max(...Object.values(frecuenciaSignos));
    return max > 0 ? max : 1;
  }, [frecuenciaSignos]);

  const generarPuntosGrafico = (tipo: 'animo' | 'comodidad') => {
    const registrosValidos = [...historialFiltrado]
      .reverse()
      .filter((item) => (tipo === 'animo' ? item.animo !== null : item.comodidad !== null));

    if (registrosValidos.length === 0) {
      return { polyline: null, dots: [] };
    }

    const total = registrosValidos.length;

    const dots = registrosValidos.map((item, index) => {
      const x = total === 1 ? 50 : (index / (total - 1)) * 100;

      const nivel =
        tipo === 'animo'
          ? NIVELES_ANIMO.indexOf(item.animo as typeof NIVELES_ANIMO[number])
          : NIVELES_COMODIDAD.indexOf(item.comodidad as typeof NIVELES_COMODIDAD[number]);

      const nivelValido = nivel !== -1 ? nivel : 2;
      const y = 45 - nivelValido * 10;

      return {
        x,
        y,
        fechaVisual: item.fecha.length > 5 ? item.fecha.slice(0, 5) : item.fecha,
        valor: tipo === 'animo' ? item.animo : item.comodidad,
      };
    });

    const polyline = dots.length > 1 ? dots.map((d) => `${d.x},${d.y}`).join(' ') : null;

    return { polyline, dots };
  };

  const animoData = useMemo(() => generarPuntosGrafico('animo'), [historialFiltrado]);
  const comodidadData = useMemo(() => generarPuntosGrafico('comodidad'), [historialFiltrado]);

  if (cargando) {
    return (
      <div className="flex flex-col justify-center items-center py-24 space-y-3">
        <div className="w-8 h-8 border-3 border-purple-200 border-t-purple-800 rounded-full animate-spin" />
        <p className="text-sm font-semibold text-purple-900 animate-pulse font-serif">
          Cargando tu evolución... 🌿
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6 sm:p-8 bg-white/80 backdrop-blur-md rounded-3xl shadow-sm border border-purple-100/70 space-y-8">
      {/* 1. CABECERA CON FILTROS */}
      <div className="bg-purple-50/50 border border-purple-100/80 rounded-3xl p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-purple-950 font-serif">
            Mi evolución
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 mt-1">
            Visualiza tus registros para identificar patrones y ver cómo te has sentido.
          </p>
        </div>

        <div className="flex flex-col items-end gap-1.5 self-end sm:self-auto">
          <div className="flex bg-white/90 p-1 rounded-2xl border border-purple-200/80 shadow-2xs">
            {(['7dias', '30dias', 'todo'] as const).map((tipo) => (
              <button
                key={tipo}
                type="button"
                onClick={() => setFiltroTiempo(tipo)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  filtroTiempo === tipo
                    ? 'bg-emerald-100/90 text-emerald-950 shadow-2xs border border-emerald-300'
                    : 'text-gray-600 hover:text-purple-900'
                }`}
              >
                {tipo === '7dias' ? '7 días' : tipo === '30dias' ? '30 días' : 'Todo'}
              </button>
            ))}
          </div>
          <span className="text-[11px] font-semibold text-gray-500">
            Días registrados en este periodo:{' '}
            <strong className="text-purple-900">{historialFiltrado.length}</strong>
          </span>
        </div>
      </div>

      {/* 2. FRECUENCIA DE SIGNOS */}
      <div className="bg-white/90 border border-gray-100 rounded-3xl p-6 space-y-4 shadow-2xs">
        <div className="flex justify-between items-center border-b border-gray-100 pb-3">
          <h2 className="font-bold text-gray-900 text-sm sm:text-base">Frecuencia de signos</h2>
          <span className="text-[11px] text-gray-400 italic">Conteo de días presentados</span>
        </div>

        <div className="h-72 flex items-end justify-around pt-8 pb-4 px-6 bg-purple-50/20 rounded-2xl border border-purple-50 relative">
          <div className="absolute left-3 top-3 bottom-8 flex flex-col justify-between text-[10px] text-gray-400 font-medium">
            <span>{maxFrecuencia}</span>
            <span>{Math.round(maxFrecuencia / 2)}</span>
            <span>0</span>
          </div>

          {[
            { key: 'Brotes', color: 'purple', cant: frecuenciaSignos.Brotes },
            { key: 'Descamación', color: 'emerald', cant: frecuenciaSignos.Descamación },
            { key: 'Irritación', color: 'purple', cant: frecuenciaSignos.Irritación },
          ].map(({ key, color, cant }) => {
            const porcentajeAltura = cant === 0 ? 0 : (cant / maxFrecuencia) * 100;
            const isPurple = color === 'purple';

            return (
              <div key={key} className="flex flex-col items-center gap-3 group w-20">
                <span
                  className={`text-xs font-bold px-2 py-0.5 rounded-md ${
                    cant === 0
                      ? 'text-gray-400 bg-gray-100'
                      : isPurple
                      ? 'text-purple-900 bg-purple-100'
                      : 'text-emerald-900 bg-emerald-100'
                  }`}
                >
                  {cant}
                </span>

                <div className="w-10 h-48 flex items-end bg-gray-50/50 rounded-t-xl overflow-hidden">
                  <div
                    style={{ height: `${porcentajeAltura}%` }}
                    className={`w-full rounded-t-xl transition-all duration-300 shadow-2xs ${
                      cant === 0
                        ? 'bg-transparent'
                        : isPurple
                        ? 'bg-purple-300/80 group-hover:bg-purple-400'
                        : 'bg-emerald-300/80 group-hover:bg-emerald-400'
                    }`}
                  />
                </div>
                <span className="text-xs font-semibold text-gray-600">{key}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. ESTADO DE ÁNIMO */}
      <div className="bg-white/90 border border-gray-100 rounded-3xl p-6 space-y-4 shadow-2xs">
        <div className="flex justify-between items-center border-b border-gray-100 pb-3">
          <h2 className="font-bold text-gray-900 text-sm sm:text-base">Estado de ánimo general</h2>
          <span className="text-[11px] text-gray-400 italic">Evolución por fecha registrada</span>
        </div>

        {animoData.dots.length === 0 ? (
          <div className="p-8 text-center bg-gray-50/50 rounded-2xl border border-dashed border-gray-200 text-xs text-gray-400">
            Sin registros de estado de ánimo en este periodo.
          </div>
        ) : (
          <div className="relative p-6 bg-emerald-50/20 rounded-2xl border border-emerald-50 flex flex-col justify-between h-80">
            <div className="absolute left-4 top-6 bottom-12 flex flex-col justify-between text-[10px] text-gray-400 font-medium">
              {[...NIVELES_ANIMO].reverse().map((nivel) => (
                <span key={nivel}>{nivel}</span>
              ))}
            </div>

            <div className="ml-20 mr-4 h-60 relative">
              <svg
                className="w-full h-full overflow-visible"
                preserveAspectRatio="none"
                viewBox="0 0 100 50"
              >
                {[5, 15, 25, 35, 45].map((y) => (
                  <line
                    key={y}
                    x1="0"
                    y1={y}
                    x2="100"
                    y2={y}
                    stroke="#d1d5db"
                    strokeDasharray="2"
                    strokeWidth="0.3"
                  />
                ))}

                {animoData.polyline && (
                  <polyline
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    points={animoData.polyline}
                  />
                )}

                {animoData.dots.map((dot, idx) => (
                  <circle key={idx} cx={dot.x} cy={dot.y} r="1.8" fill="#047857" />
                ))}
              </svg>
            </div>

            <div className="ml-20 mr-4 flex justify-between text-[10px] sm:text-[11px] text-gray-500 font-medium">
              {animoData.dots.map((d, i) => (
                <span key={i}>{d.fechaVisual}</span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 4. COMODIDAD CON MI PIEL */}
      <div className="bg-white/90 border border-gray-100 rounded-3xl p-6 space-y-4 shadow-2xs">
        <div className="flex justify-between items-center border-b border-gray-100 pb-3">
          <h2 className="font-bold text-gray-900 text-sm sm:text-base">
            Comodidad respecto a mi piel
          </h2>
          <span className="text-[11px] text-gray-400 italic">Evolución por fecha registrada</span>
        </div>

        {comodidadData.dots.length === 0 ? (
          <div className="p-8 text-center bg-gray-50/50 rounded-2xl border border-dashed border-gray-200 text-xs text-gray-400">
            Sin registros de comodidad en este periodo.
          </div>
        ) : (
          <div className="relative p-6 bg-purple-50/20 rounded-2xl border border-purple-50 flex flex-col justify-between h-80">
            <div className="absolute left-4 top-6 bottom-12 flex flex-col justify-between text-[10px] text-gray-400 font-medium">
              {[...NIVELES_COMODIDAD].reverse().map((nivel) => (
                <span key={nivel}>{nivel}</span>
              ))}
            </div>

            <div className="ml-24 mr-4 h-60 relative">
              <svg
                className="w-full h-full overflow-visible"
                preserveAspectRatio="none"
                viewBox="0 0 100 50"
              >
                {[5, 15, 25, 35, 45].map((y) => (
                  <line
                    key={y}
                    x1="0"
                    y1={y}
                    x2="100"
                    y2={y}
                    stroke="#d1d5db"
                    strokeDasharray="2"
                    strokeWidth="0.3"
                  />
                ))}

                {comodidadData.polyline && (
                  <polyline
                    fill="none"
                    stroke="#8b5cf6"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    points={comodidadData.polyline}
                  />
                )}

                {comodidadData.dots.map((dot, idx) => (
                  <circle key={idx} cx={dot.x} cy={dot.y} r="1.8" fill="#6b21a8" />
                ))}
              </svg>
            </div>

            <div className="ml-24 mr-4 flex justify-between text-[10px] sm:text-[11px] text-gray-500 font-medium">
              {comodidadData.dots.map((d, i) => (
                <span key={i}>{d.fechaVisual}</span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 5. TABLA DE HISTORIAL */}
      <div className="bg-white/90 border border-gray-100 rounded-3xl p-6 space-y-4 shadow-2xs">
        <div className="flex justify-between items-center border-b border-gray-100 pb-3">
          <h2 className="font-bold text-gray-900 text-sm sm:text-base">Historial de registros</h2>
          <span className="text-[11px] text-purple-900 bg-purple-50 px-3 py-1 rounded-full font-semibold border border-purple-100 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-purple-700" />
            <span>Resumen de actividades diarias</span>
          </span>
        </div>

        {historialFiltrado.length === 0 ? (
          <div className="p-8 text-center bg-gray-50/50 rounded-2xl space-y-2 border border-dashed border-gray-200">
            <FileText className="w-8 h-8 text-gray-400 mx-auto" />
            <p className="text-sm font-bold text-gray-700">
              Aún no tienes registros en este periodo.
            </p>
            <p className="text-xs text-gray-500">Puedes comenzar agregando uno en Mi registro.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[500px]">
              <thead>
                <tr className="border-b border-purple-100 text-[11px] font-bold text-purple-900 uppercase tracking-wider bg-purple-50/50">
                  <th className="p-3.5 rounded-l-xl">Fecha</th>
                  <th className="p-3.5">Signos observados</th>
                  <th className="p-3.5">Estado de ánimo</th>
                  <th className="p-3.5 rounded-r-xl">Comodidad</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-xs text-gray-700">
                {historialFiltrado.map((row) => {
                  const esHoy = row.fecha === hoyFecha;
                  const signosTexto =
                    Array.isArray(row.signos) && row.signos.length > 0
                      ? row.signos.join(', ')
                      : 'Ninguno';

                  return (
                    <tr key={row.id} className="hover:bg-purple-50/30 transition-colors">
                      <td className="p-3.5 font-semibold text-gray-900 flex items-center gap-2">
                        <span>{row.fecha}</span>
                        {esHoy && (
                          <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md font-bold">
                            Hoy
                          </span>
                        )}
                      </td>
                      <td className="p-3.5 font-medium">{signosTexto}</td>
                      <td className="p-3.5">{row.animo ?? 'Sin registro'}</td>
                      <td className="p-3.5">{row.comodidad ?? 'Sin registro'}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 6. NOTA EXPLICATIVA */}
      <div className="bg-purple-50/60 border border-purple-100 rounded-2xl p-4 flex items-start gap-3 text-xs text-purple-950 leading-relaxed shadow-2xs">
        <Info className="w-5 h-5 text-purple-700 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p>
            • <strong>Días sin registro = sin datos:</strong> no inferir mejora o empeoramiento.
          </p>
          <p>
            • Estos registros muestran tus observaciones; no demuestran que un producto haya causado
            un cambio en tu piel o en tus emociones.
          </p>
        </div>
      </div>
    </div>
  );
};