import React, { useState } from 'react';
import { 
  Sun, 
  Moon, 
  Edit2, 
  ChevronDown, 
  ChevronUp, 
  Droplet, 
  ShieldCheck, 
  Waves
} from 'lucide-react';

interface RutinaPageProps {
  userId?: string;
}

export const RutinaPage: React.FC <RutinaPageProps>= () => {
  // Estado para desplegar pasos
  const [openStepManana, setOpenStepManana] = useState<number | null>(null);
  const [openStepNoche, setOpenStepNoche] = useState<number | null>(null);

  const toggleManana = (index: number) => {
    setOpenStepManana(openStepManana === index ? null : index);
  };

  const toggleNoche = (index: number) => {
    setOpenStepNoche(openStepNoche === index ? null : index);
  };

  return (
    /* CONTENEDOR BLANCO CON GLASSMORPHISM (Igual que en PerfilPage) */
    <div className="max-w-5xl mx-auto p-6 sm:p-8 bg-white/80 backdrop-blur-md rounded-3xl shadow-sm border border-purple-100/70 space-y-8">
      {/* Fuente manuscrita */}
      <link 
        href="https://fonts.googleapis.com/css2?family=Caveat:wght@600;700&display=swap" 
        rel="stylesheet" 
      />

      {/* 1. CABECERA CON NOTA MANUSCRITA */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-purple-950 font-serif">Mi rutina</h1>
          <p className="text-xs sm:text-sm text-gray-600 mt-1 max-w-xl leading-relaxed">
            Una rutina simple y constante puede ayudarte a cuidar tu piel.<br />
            Adáptala según tus necesidades y puedes editarla cuando lo necesites.
          </p>
        </div>

        {/* Píldora manuscrita superior */}
        <div className="bg-purple-100/70 border border-purple-200/80 rounded-full px-4 py-2 flex items-center gap-2 text-purple-900 shadow-2xs self-end md:self-auto">
          <Sun className="w-4 h-4 text-purple-700" />
          <span 
            className="text-base sm:text-lg font-bold leading-none"
            style={{ fontFamily: "'Caveat', cursive" }}
          >
            Pequeños hábitos también suman ♡
          </span>
        </div>
      </div>

      {/* 2. RUTINA DE LA MAÑANA */}
      <div className="bg-emerald-50/60 border border-emerald-100/80 rounded-3xl p-5 sm:p-6 space-y-4 shadow-2xs">
        <div className="flex items-center justify-between pb-1">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-100/80 text-emerald-800 rounded-2xl">
              <Sun className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <h2 className="font-bold text-gray-900 text-base sm:text-lg">Rutina de la mañana</h2>
              <p className="text-xs text-gray-500">Prepara tu piel para el día.</p>
            </div>
          </div>

          <button className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-gray-50 text-gray-700 text-xs font-semibold rounded-xl border border-gray-200/80 shadow-2xs transition-colors cursor-pointer">
            <Edit2 className="w-3.5 h-3.5 text-gray-500" />
            <span>Editar rutina</span>
          </button>
        </div>

        {/* Lista de pasos Mañana */}
        <div className="space-y-3 pt-1">
          
          {/* Paso 1 */}
          <div className="bg-white/90 border border-gray-100 rounded-2xl p-4 shadow-2xs transition-all">
            <div 
              onClick={() => toggleManana(1)}
              className="flex items-center justify-between cursor-pointer"
            >
              <div className="flex items-center gap-3 sm:gap-4">
                <span className="w-7 h-7 flex items-center justify-center bg-purple-100 text-purple-800 font-bold text-xs rounded-full shrink-0">
                  1
                </span>
                <div className="w-7 h-7 flex items-center justify-center text-lg shrink-0">
                  🧴
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-sm">Limpieza suave</h3>
                  <p className="text-xs text-gray-500">Elimina impurezas, sudor y exceso de grasa sin irritar la piel.</p>
                </div>
              </div>
              <button className="text-gray-400 hover:text-gray-600">
                {openStepManana === 1 ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </button>
            </div>
            {openStepManana === 1 && (
              <div className="mt-3 pt-3 border-t border-gray-100 text-xs text-gray-600 leading-relaxed bg-emerald-50/40 p-3 rounded-xl">
                Aplica con agua tibia realizando movimientos circulares suaves durante 30 a 60 segundos.
              </div>
            )}
          </div>

          {/* Paso 2 */}
          <div className="bg-white/90 border border-gray-100 rounded-2xl p-4 shadow-2xs transition-all">
            <div 
              onClick={() => toggleManana(2)}
              className="flex items-center justify-between cursor-pointer"
            >
              <div className="flex items-center gap-3 sm:gap-4">
                <span className="w-7 h-7 flex items-center justify-center bg-purple-100 text-purple-800 font-bold text-xs rounded-full shrink-0">
                  2
                </span>
                <div className="w-7 h-7 flex items-center justify-center text-blue-500 shrink-0">
                  <Droplet className="w-5 h-5 fill-blue-100 stroke-blue-500" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-sm">Hidratación</h3>
                  <p className="text-xs text-gray-500">Ayuda a mantener la barrera de la piel y evita la resequedad.</p>
                </div>
              </div>
              <button className="text-gray-400 hover:text-gray-600">
                {openStepManana === 2 ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </button>
            </div>
            {openStepManana === 2 && (
              <div className="mt-3 pt-3 border-t border-gray-100 text-xs text-gray-600 leading-relaxed bg-blue-50/40 p-3 rounded-xl">
                Aplica una capa ligera sobre el rostro ligeramente húmedo para sellar la hidratación.
              </div>
            )}
          </div>

          {/* Paso 3 */}
          <div className="bg-white/90 border border-gray-100 rounded-2xl p-4 shadow-2xs transition-all">
            <div 
              onClick={() => toggleManana(3)}
              className="flex items-center justify-between cursor-pointer"
            >
              <div className="flex items-center gap-3 sm:gap-4">
                <span className="w-7 h-7 flex items-center justify-center bg-purple-100 text-purple-800 font-bold text-xs rounded-full shrink-0">
                  3
                </span>
                <div className="w-7 h-7 flex items-center justify-center text-amber-500 shrink-0">
                  <Sun className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-sm">Protector solar de amplio espectro FPS 30+</h3>
                  <p className="text-xs text-gray-500">Protege la piel de los rayos UV y ayuda a prevenir el daño solar.</p>
                </div>
              </div>
              <button className="text-gray-400 hover:text-gray-600">
                {openStepManana === 3 ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </button>
            </div>
            {openStepManana === 3 && (
              <div className="mt-3 pt-3 border-t border-gray-100 text-xs text-gray-600 leading-relaxed bg-amber-50/40 p-3 rounded-xl">
                Usa la regla de dos dedos para rostro y cuello. Reaplica cada 2 o 3 horas si estás expuesta al sol.
              </div>
            )}
          </div>

        </div>
      </div>

      {/* 3. RUTINA DE LA NOCHE */}
      <div className="bg-purple-50/60 border border-purple-100/80 rounded-3xl p-5 sm:p-6 space-y-4 shadow-2xs">
        <div className="flex items-center justify-between pb-1">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100/80 text-purple-900 rounded-2xl">
              <Moon className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <h2 className="font-bold text-gray-900 text-base sm:text-lg">Rutina de la noche</h2>
              <p className="text-xs text-gray-500">Favorece la recuperación de tu piel.</p>
            </div>
          </div>

          <button className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-gray-50 text-gray-700 text-xs font-semibold rounded-xl border border-gray-200/80 shadow-2xs transition-colors cursor-pointer">
            <Edit2 className="w-3.5 h-3.5 text-gray-500" />
            <span>Editar rutina</span>
          </button>
        </div>

        {/* Lista de pasos Noche */}
        <div className="space-y-3 pt-1">
          
          {/* Paso 1 */}
          <div className="bg-white/90 border border-gray-100 rounded-2xl p-4 shadow-2xs transition-all">
            <div 
              onClick={() => toggleNoche(1)}
              className="flex items-center justify-between cursor-pointer"
            >
              <div className="flex items-center gap-3 sm:gap-4">
                <span className="w-7 h-7 flex items-center justify-center bg-purple-100 text-purple-800 font-bold text-xs rounded-full shrink-0">
                  1
                </span>
                <div className="w-7 h-7 flex items-center justify-center text-lg shrink-0">
                  🧴
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-sm">Limpieza suave</h3>
                  <p className="text-xs text-gray-500">Elimina impurezas, sudor y restos del día sin irritar la piel.</p>
                </div>
              </div>
              <button className="text-gray-400 hover:text-gray-600">
                {openStepNoche === 1 ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </button>
            </div>
            {openStepNoche === 1 && (
              <div className="mt-3 pt-3 border-t border-gray-100 text-xs text-gray-600 leading-relaxed bg-purple-50/40 p-3 rounded-xl">
                Remueve eficazmente el protector solar y los residuos acumulados durante el día.
              </div>
            )}
          </div>

          {/* Paso 2 */}
          <div className="bg-white/90 border border-gray-100 rounded-2xl p-4 shadow-2xs transition-all">
            <div 
              onClick={() => toggleNoche(2)}
              className="flex items-center justify-between cursor-pointer"
            >
              <div className="flex items-center gap-3 sm:gap-4">
                <span className="w-7 h-7 flex items-center justify-center bg-purple-100 text-purple-800 font-bold text-xs rounded-full shrink-0">
                  2
                </span>
                <div className="w-7 h-7 flex items-center justify-center text-blue-500 shrink-0">
                  <Droplet className="w-5 h-5 fill-blue-100 stroke-blue-500" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-sm">Hidratación</h3>
                  <p className="text-xs text-gray-500">Ayuda a mantener la barrera de la piel y favorece su recuperación.</p>
                </div>
              </div>
              <button className="text-gray-400 hover:text-gray-600">
                {openStepNoche === 2 ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </button>
            </div>
            {openStepNoche === 2 && (
              <div className="mt-3 pt-3 border-t border-gray-100 text-xs text-gray-600 leading-relaxed bg-purple-50/40 p-3 rounded-xl">
                Aplica una cantidad generosa para reparar la hidratación mientras descansas.
              </div>
            )}
          </div>

        </div>
      </div>

      {/* 4. TARJETAS INFORMATIVAS INFERIORES */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-2">
        
        {/* Grasa o brotes */}
        <div className="bg-emerald-50/80 border border-emerald-100 rounded-3xl p-5 flex flex-col justify-between space-y-4">
          <div className="flex justify-between items-start">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100/90 flex items-center justify-center text-emerald-800">
              <Droplet className="w-5 h-5" />
            </div>
            <span className="text-emerald-700/30 text-2xl">🌿</span>
          </div>
          <div>
            <h3 className="font-bold text-gray-900 text-sm mb-2">Grasa o brotes</h3>
            <ul className="text-xs text-gray-600 space-y-1 list-disc list-inside">
              <li>Productos no comedogénicos.</li>
              <li>No manipular brotes.</li>
            </ul>
          </div>
        </div>

        {/* Seca o descamación */}
        <div className="bg-purple-50/80 border border-purple-100 rounded-3xl p-5 flex flex-col justify-between space-y-4">
          <div className="flex justify-between items-start">
            <div className="w-10 h-10 rounded-2xl bg-purple-100/90 flex items-center justify-center text-purple-800">
              <Waves className="w-5 h-5" />
            </div>
            <span className="text-purple-700/30 text-2xl">🍃</span>
          </div>
          <div>
            <h3 className="font-bold text-gray-900 text-sm mb-2">Seca o descamación</h3>
            <ul className="text-xs text-gray-600 space-y-1 list-disc list-inside">
              <li>Priorizar hidratación.</li>
              <li>Evitar limpieza abrasiva.</li>
            </ul>
          </div>
        </div>

        {/* Sensible o irritación */}
        <div className="bg-orange-50/80 border border-orange-100 rounded-3xl p-5 flex flex-col justify-between space-y-4">
          <div className="flex justify-between items-start">
            <div className="w-10 h-10 rounded-2xl bg-orange-100/90 flex items-center justify-center text-orange-800">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <span className="text-orange-700/30 text-2xl">♡</span>
          </div>
          <div>
            <h3 className="font-bold text-gray-900 text-sm mb-2">Sensible o irritación</h3>
            <ul className="text-xs text-gray-600 space-y-1 list-disc list-inside">
              <li>Sin fragancia.</li>
              <li>Dejar productos que irriten.</li>
            </ul>
          </div>
        </div>

      </div>

    </div>
  );
};