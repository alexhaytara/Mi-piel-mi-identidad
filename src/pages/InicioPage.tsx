import React, { useState } from 'react';
import { 
  Calendar, 
  CheckCircle2, 
  ArrowRight, 
  Lightbulb, 
  Sparkles, 
  Sun, 
  Moon, 
  BookOpen, 
  Heart,
  ChevronRight
} from 'lucide-react';

interface InicioPageProps {
  userName?: string;
  setActiveTab: (tab: string) => void;
}

export const InicioPage: React.FC<InicioPageProps> = ({ userName, setActiveTab }) => {
  // Estado para la pestaña de rutina diaria en el Inicio (Mañana / Noche)
  const [momentoRutina, setMomentoRutina] = useState<'manana' | 'noche'>('manana');

  // Estado para las casillas de la rutina de hoy
  const [pasosCompletados, setPasosCompletados] = useState<Record<string, boolean>>({
    limpieza: false,
    hidratacion: false,
    proteccion: false,
  });

  const togglePaso = (key: string) => {
    setPasosCompletados((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="space-y-6 pb-12 max-w-6xl mx-auto">
      {/* Fuente manuscrita */}
      <link 
        href="https://fonts.googleapis.com/css2?family=Caveat:wght@600;700&display=swap" 
        rel="stylesheet" 
      />

      {/* 1. SALUDO DE BIENVENIDA Y ACCIONES RÁPIDAS */}
      <div className="bg-purple-100/60 border border-purple-200/70 rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-2xs space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative z-10">
          <div className="flex items-center gap-4">
            {/* Avatar por defecto */}
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-purple-300/80 border-2 border-white shadow-2xs flex items-center justify-center text-2xl font-serif text-purple-950 font-bold shrink-0">
              {userName ? userName.charAt(0).toUpperCase() : 'U'}
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-purple-950 font-serif flex items-center gap-2">
                Hola, {userName || 'Isa'} <span className="animate-pulse">✨</span>
              </h1>
              <p className="text-xs sm:text-sm text-purple-900/80 font-medium mt-0.5">
                Hoy puedes cuidarte sin exigirte perfección.
              </p>
            </div>
          </div>

          {/* Frase en estilo pincel / manuscrita */}
          <div 
            className="text-purple-900/90 font-bold text-xl sm:text-2xl rotate-1 self-end md:self-auto"
            style={{ fontFamily: "'Caveat', cursive" }}
          >
            "Una piel sana también vive en una mente tranquila. ♡"
          </div>
        </div>

        {/* Botones de acción rápida */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 relative z-10">
          <button
            type="button"
            onClick={() => setActiveTab('registro')}
            className="py-3 px-4 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs sm:text-sm rounded-2xl shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>✏️</span>
            <span>Registrar mi día</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('rutina')}
            className="py-3 px-4 bg-purple-200/80 hover:bg-purple-300/80 text-purple-950 font-bold text-xs sm:text-sm rounded-2xl border border-purple-300/60 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>🗓️</span>
            <span>Ver mi rutina</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('aprende')}
            className="py-3 px-4 bg-white/90 hover:bg-white text-gray-800 font-bold text-xs sm:text-sm rounded-2xl border border-gray-200/80 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
          >
            <span>📖</span>
            <span>Conocer mi piel</span>
          </button>
        </div>
      </div>

      {/* 2. GRID PRINCIPAL CON RETO, RUTINA Y REGISTRO */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* COLUMNA IZQUIERDA: Rutina de Hoy + Tip del Día */}
        <div className="lg:col-span-6 space-y-6">
          
          {/* Bloque: Mi rutina de hoy */}
          <div className="bg-white/90 border border-purple-100/80 rounded-3xl p-5 sm:p-6 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-purple-50 pb-3">
              <h2 className="font-bold text-purple-950 text-base sm:text-lg font-serif">
                Mi rutina de hoy
              </h2>

              {/* Selector Mañana / Noche */}
              <div className="flex bg-purple-50 p-1 rounded-xl border border-purple-100">
                <button
                  type="button"
                  onClick={() => setMomentoRutina('manana')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                    momentoRutina === 'manana'
                      ? 'bg-white text-purple-950 shadow-2xs'
                      : 'text-gray-500 hover:text-purple-900'
                  }`}
                >
                  <Sun className="w-3.5 h-3.5 text-amber-500" />
                  <span>Mañana</span>
                </button>
                <button
                  type="button"
                  onClick={() => setMomentoRutina('noche')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                    momentoRutina === 'noche'
                      ? 'bg-white text-purple-950 shadow-2xs'
                      : 'text-gray-500 hover:text-purple-900'
                  }`}
                >
                  <Moon className="w-3.5 h-3.5 text-indigo-500" />
                  <span>Noche</span>
                </button>
              </div>
            </div>

            {/* Checklist de pasos */}
            <div className="space-y-2.5 pt-1">
              {[
                { key: 'limpieza', title: 'Limpieza suave' },
                { key: 'hidratacion', title: 'Hidratación' },
                { key: 'proteccion', title: momentoRutina === 'manana' ? 'Protección solar' : 'Reparación de la barrera' },
              ].map((paso) => {
                const checked = pasosCompletados[paso.key];
                return (
                  <label
                    key={paso.key}
                    onClick={() => togglePaso(paso.key)}
                    className={`flex items-center justify-between p-3 rounded-2xl border transition-all cursor-pointer ${
                      checked
                        ? 'bg-emerald-50/80 border-emerald-200 text-emerald-950'
                        : 'bg-gray-50/50 border-gray-200/80 text-gray-700 hover:bg-purple-50/40'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => {}}
                        className="w-4 h-4 rounded text-purple-700 focus:ring-purple-400"
                      />
                      <span className="text-xs sm:text-sm font-semibold">{paso.title}</span>
                    </div>
                    {checked && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                  </label>
                );
              })}
            </div>

            {/* Botón de confirmar rutina */}
            <button
              type="button"
              onClick={() => setActiveTab('registro')}
              className="w-full py-2.5 bg-purple-200/80 hover:bg-purple-300 text-purple-950 font-bold text-xs rounded-2xl transition-colors cursor-pointer border border-purple-300/50 mt-2"
            >
              Usar en mi registro
            </button>
          </div>

          {/* Bloque: Tip del día */}
          <div className="bg-amber-50/70 border border-amber-200/70 rounded-3xl p-5 flex items-center gap-4 shadow-2xs">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-700 shrink-0">
              <Lightbulb className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-xs sm:text-sm">Tip del día</h3>
              <p className="text-xs text-gray-700 mt-0.5 leading-relaxed font-medium">
                Tu identidad también incluye tus gustos, vínculos y cualidades.
              </p>
            </div>
          </div>

        </div>

        {/* COLUMNA DERECHA: Reto, Último Registro y Aprende */}
        <div className="lg:col-span-6 space-y-6">
          
          {/* Bloque: Reto de autocuidado */}
          <div className="bg-purple-50/70 border border-purple-100 rounded-3xl p-5 sm:p-6 shadow-2xs space-y-3">
            <div className="flex items-center gap-2 text-purple-950 font-bold text-sm">
              <Heart className="w-4 h-4 text-purple-700 fill-purple-200" />
              <span>Reto de autocuidado</span>
            </div>

            <p className="text-xs sm:text-sm text-gray-800 font-semibold leading-relaxed">
              Hoy escribe una cualidad tuya que no dependa de tu apariencia.
            </p>

            <button
              type="button"
              onClick={() => setActiveTab('identidad')}
              className="px-4 py-2 bg-purple-100 hover:bg-purple-200 text-purple-900 font-bold text-xs rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer border border-purple-200/60"
            >
              <span>Ir a Mi identidad</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Bloque: Mi último registro */}
          <div className="bg-white/90 border border-purple-100/80 rounded-3xl p-5 sm:p-6 shadow-2xs space-y-3">
            <div className="flex items-center justify-between border-b border-purple-50 pb-2">
              <h3 className="font-bold text-gray-900 text-sm">Mi último registro</h3>
              <span className="text-[11px] font-semibold text-purple-800 bg-purple-50 px-2.5 py-0.5 rounded-md">
                30/09
              </span>
            </div>

            <p className="text-xs text-gray-600 font-medium leading-relaxed">
              Ánimo: <strong className="text-gray-800">Bien</strong> · Respecto a mi piel: <strong className="text-gray-800">Cómodo/a</strong>
            </p>

            <button
              type="button"
              onClick={() => setActiveTab('evolucion')}
              className="w-full py-2 bg-purple-50 hover:bg-purple-100 text-purple-900 font-bold text-xs rounded-xl transition-colors cursor-pointer border border-purple-100/80"
            >
              Ver historial
            </button>
          </div>

          {/* Bloque: Aprende en un minuto */}
          <div className="bg-white/90 border border-purple-100/80 rounded-3xl p-5 sm:p-6 shadow-2xs space-y-3">
            <div className="flex items-center gap-2 text-gray-900 font-bold text-sm">
              <BookOpen className="w-4 h-4 text-purple-700" />
              <span>Aprende en un minuto</span>
            </div>

            <div className="space-y-2">
              <button
                type="button"
                onClick={() => setActiveTab('aprende')}
                className="w-full p-3 bg-purple-50/50 hover:bg-purple-100/60 border border-purple-100 rounded-2xl flex items-center justify-between text-xs font-semibold text-purple-950 transition-colors cursor-pointer"
              >
                <span>💡 Mitos del skincare</span>
                <ChevronRight className="w-4 h-4 text-purple-700" />
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('aprende')}
                className="w-full p-3 bg-purple-50/50 hover:bg-purple-100/60 border border-purple-100 rounded-2xl flex items-center justify-between text-xs font-semibold text-purple-950 transition-colors cursor-pointer"
              >
                <span>💧 Tu barrera cutánea</span>
                <ChevronRight className="w-4 h-4 text-purple-700" />
              </button>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};