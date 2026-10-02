import React, { useState } from 'react';
import { ArrowLeft, BookOpen, CheckCircle, Sparkles } from 'lucide-react';

// Importación de imágenes
import inicio01 from '../assets/inicio01.png';
import inicio02 from '../assets/inicio02.png';
import inicio03 from '../assets/inicio03.png';
import inicio04 from '../assets/inicio04.png';
import inicio05 from '../assets/inicio05.png';

export const AprendePage: React.FC = () => {
  // Estado para controlar qué tarjeta se está leyendo en detalle (null = vista general)
  const [activeArticleId, setActiveArticleId] = useState<string | null>(null);

  // Estado para el filtro de temas en la lista principal
  const [selectedTopic, setSelectedTopic] = useState('todos');

  // Estado para el acordeón de Mitos y Realidades
  const [openMito, setOpenMito] = useState<number | null>(null);

  // Base de datos de contenido de las Tarjetas
  const cards = [
    {
      id: 'barrera',
      topic: 'barrera',
      title: 'Tu barrera cutánea',
      subtitle: 'Ayuda a proteger la piel y conservar su hidratación.',
      bg: 'bg-[#FFF7ED]',
      img: inicio01,
      contenido: {
        introduccion: 'La barrera cutánea es la capa más externa de la piel. Funciona como un escudo protector que mantiene el agua adentro y los irritantes externos afuera.',
        puntosClave: [
          'Evita la pérdida de agua transepidérmica.',
          'Protege contra bacterias, contaminación y agresores ambientales.',
          'Si está dañada, la piel se nota enrojecida, tirante o arde al aplicar productos básicos.'
        ],
        consejos: [
          'Usa limpiadores suaves con pH fisiológico.',
          'Evita exfoliarte en exceso o usar agua muy caliente.',
          'Busca ingredientes como ceramidas, ácido hialurónico y glicerina.'
        ]
      }
    },
    {
      id: 'brotes',
      topic: 'brotes',
      title: 'Brotes: más que apariencia',
      subtitle: 'Observarlos no significa juzgar tu valor personal.',
      bg: 'bg-[#F2F8F2]',
      img: inicio02,
      contenido: {
        introduccion: 'Los brotes u oclusiones en los poros son respuestas biológicas normales a cambios hormonales, estrés, acumulación de grasa o células muertas.',
        puntosClave: [
          'Un brote no refleja falta de higiene personal.',
          'Es una condición temporal que casi todas las personas experimentan.',
          'Manipular o apretar los brotes incrementa la inflamación y el riesgo de marcas.'
        ],
        consejos: [
          'Mantén una rutina de limpieza constante por la mañana y noche.',
          'Opta por productos etiquetados como "no comedogénicos".',
          'Ten paciencia: la piel tarda de 28 a 30 días en renovarse.'
        ]
      }
    },
    {
      id: 'resequedad',
      topic: 'resequedad',
      title: 'Resequedad y descamación',
      subtitle: 'Identifica cambios y consulta orientación confiable.',
      bg: 'bg-[#FAF5FF]',
      img: inicio03,
      contenido: {
        introduccion: 'La resequedad ocurre cuando la piel pierde sus aceites naturales o carece de humedad suficiente, provocando sensación de tirantez o pequeñas escamas.',
        puntosClave: [
          'Diferencia entre piel seca (tipo de piel) y piel deshidratada (estado temporal).',
          'El clima frío o el uso de calefacción aceleran la pérdida de humedad.',
          'La tirantez es la primera señal de que necesitas reforzar la hidratación.'
        ],
        consejos: [
          'Aplica tu crema hidratante con la piel ligeramente húmeda.',
          'Prefiere texturas en crema rica si tu piel es muy seca.',
          'Añade un humectante de ambiente en tu habitación si el clima es seco.'
        ]
      }
    },
    {
      id: 'sensibilidad',
      topic: 'sensibilidad',
      title: 'Sensibilidad e irritación',
      subtitle: 'Presta atención a molestias y productos que irritan.',
      bg: 'bg-[#F0FDF4]',
      img: inicio04,
      contenido: {
        introduccion: 'La piel sensible reacciona fácilmente frente a estímulos que otras pieles toleran sin problema, manifestando picazón, ardor o enrojecimiento.',
        puntosClave: [
          'Suele deberse a una barrera cutánea debilitada o reactividad genética.',
          'Las fragancias y alcoholes denat son desencadenantes comunes.',
          'Probar muchos productos nuevos al mismo tiempo dificulta detectar qué te irrita.'
        ],
        consejos: [
          'Realiza siempre una prueba de parche en el antebrazo antes de usar un producto nuevo.',
          'Elige fórmulas simplificadas y sin perfume.',
          'Aplica ingredientes calmantes como centella asiática, alantoína o avena coloidal.'
        ]
      }
    },
  ];

  // Mitos y Realidades
  const mitos = [
    {
      id: 0,
      pregunta: '¿La piel grasa necesita hidratación?',
      respuesta: 'Sí, todas las pieles necesitan hidratación. La piel grasa puede estar deshidratada y producir aún más grasa para compensar la falta de agua.'
    },
    {
      id: 1,
      pregunta: '¿Más productos significa mejor cuidado?',
      respuesta: 'Una rutina simple evita pasos innecesarios. Más productos no garantiza mejores resultados e incluso puede causar irritación.'
    },
    {
      id: 2,
      pregunta: '¿La piel debe verse perfecta para estar sana?',
      respuesta: 'No. Las texturas, poros visibles, pequeñas rojeces o variaciones de tono son completamente normales y forman parte de una piel viva y sana.'
    }
  ];

  // Obtener la tarjeta seleccionada actualmente
  const activeArticle = cards.find(c => c.id === activeArticleId);

  const filteredCards = selectedTopic === 'todos' 
    ? cards 
    : cards.filter(c => c.topic === selectedTopic);

  // =========================================================
  // VISTA 2: DETALLE DEL ARTÍCULO / LEER MÁS
  // =========================================================
  if (activeArticle) {
    return (
      <div className="max-w-4xl mx-auto space-y-6 pb-12">
        {/* Botón de regreso */}
        <button
          onClick={() => setActiveArticleId(null)}
          className="flex items-center gap-2 px-4 py-2 bg-white/90 hover:bg-white text-purple-900 text-xs font-bold rounded-2xl border border-purple-100 shadow-2xs transition-all cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver a Conoce tu piel</span>
        </button>

        {/* Tarjeta detallada de lectura */}
        <div className={`${activeArticle.bg} border border-purple-100/80 rounded-3xl p-6 sm:p-10 space-y-8 shadow-sm relative overflow-hidden`}>
          
          {/* Header del artículo con imagen */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 border-b border-black/5 pb-6">
            <div className="space-y-2 text-center sm:text-left flex-1">
              <span className="text-xs font-extrabold uppercase tracking-widest text-purple-800 bg-white/80 px-3 py-1 rounded-full border border-purple-100">
                Guía educativa
              </span>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 font-serif leading-tight">
                {activeArticle.title}
              </h1>
              <p className="text-sm sm:text-base text-gray-700 font-medium leading-relaxed">
                {activeArticle.subtitle}
              </p>
            </div>

            <div className="w-36 h-36 shrink-0 flex items-center justify-center bg-white/60 rounded-2xl p-2 border border-white/80 shadow-2xs">
              <img
                src={activeArticle.img}
                alt={activeArticle.title}
                className="max-h-full max-w-full object-contain"
              />
            </div>
          </div>

          {/* Contenido principal */}
          <div className="space-y-6 text-gray-800 text-sm leading-relaxed">
            
            {/* 1. Introducción */}
            <div className="bg-white/80 p-5 rounded-2xl border border-white/90 shadow-2xs">
              <h2 className="font-bold text-purple-950 text-base mb-2 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-purple-700" />
                <span>¿Qué debes saber?</span>
              </h2>
              <p>{activeArticle.contenido.introduccion}</p>
            </div>

            {/* 2. Puntos Clave */}
            <div className="space-y-3">
              <h3 className="font-bold text-gray-900 text-base">Aspectos fundamentales:</h3>
              <div className="grid grid-cols-1 gap-2.5">
                {activeArticle.contenido.puntosClave.map((punto, idx) => (
                  <div key={idx} className="flex items-start gap-3 bg-white/60 p-3.5 rounded-xl border border-black/5">
                    <Sparkles className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                    <span className="font-medium text-gray-700">{punto}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 3. Consejos prácticos */}
            <div className="bg-emerald-50/80 border border-emerald-200/70 p-5 rounded-2xl space-y-3">
              <h3 className="font-bold text-emerald-950 text-base flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-700" />
                <span>Recomendaciones de cuidado:</span>
              </h3>
              <ul className="space-y-2 list-disc list-inside text-emerald-900 font-medium pl-1">
                {activeArticle.contenido.consejos.map((consejo, idx) => (
                  <li key={idx}>{consejo}</li>
                ))}
              </ul>
            </div>

          </div>

          {/* Footer del artículo */}
          <div className="pt-4 border-t border-black/5 flex justify-between items-center text-xs text-gray-500">
            <span>Mi piel, mi identidad — Guía de autocuidado</span>
            <button
              onClick={() => setActiveArticleId(null)}
              className="text-purple-800 font-bold hover:underline cursor-pointer"
            >
              Cerrar artículo ↑
            </button>
          </div>

        </div>
      </div>
    );
  }

  // =========================================================
  // VISTA 1: LISTADO GENERAL DE CONOCE TU PIEL
  // =========================================================
  return (
    <div className="space-y-6 pb-8">
      {/* Fuente manuscrita */}
      <link href="https://fonts.googleapis.com/css2?family=Caveat:wght@600;700&display=swap" rel="stylesheet" />

      <section className="bg-white/80 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-purple-100/70 shadow-sm space-y-8">
        
        {/* Header de la sección */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <span className="text-3xl sm:text-4xl">📖</span>
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 font-serif">
                Conoce tu piel
              </h2>
              <p className="text-xs sm:text-sm text-gray-600 mt-0.5">
                Información breve para cuidar y comprender tu piel.
              </p>
            </div>
          </div>

          {/* Banner aloe vera superior */}
          <div className="bg-purple-50/80 border border-purple-100 rounded-2xl p-3 sm:p-4 max-w-sm flex items-center gap-3">
            <span className="text-2xl text-emerald-600">🌿</span>
            <p className="text-xs text-purple-950 leading-relaxed font-medium">
              Aprender sobre tu piel te ayuda a tomar decisiones informadas y a cuidarla con más confianza.
            </p>
          </div>
        </div>

        {/* Filtros de temas */}
        <div className="flex flex-wrap items-center gap-2 pt-2">
          {[
            { id: 'todos', label: 'Todos los temas' },
            { id: 'barrera', label: 'Barrera cutánea' },
            { id: 'brotes', label: 'Brotes' },
            { id: 'resequedad', label: 'Resequedad' },
            { id: 'sensibilidad', label: 'Sensibilidad' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedTopic(cat.id)}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                selectedTopic === cat.id
                  ? 'bg-purple-700 text-white shadow-sm'
                  : 'bg-gray-100 text-gray-600 hover:bg-purple-50 hover:text-purple-800 border border-gray-200/60'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Tarjetas informativas con navegación interna al hacer clic en "Leer más" */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 pt-2">
          {filteredCards.map((card) => (
            <div
              key={card.id}
              className={`${card.bg} rounded-3xl p-5 flex flex-col justify-between space-y-4 border border-black/5 hover:shadow-md transition-shadow`}
            >
              <div className="h-32 flex items-center justify-center w-full">
                <img
                  src={card.img}
                  alt={card.title}
                  className="max-h-full max-w-full object-contain"
                />
              </div>

              <div className="space-y-1.5 text-left">
                <h3 className="font-bold text-gray-900 text-base leading-snug">
                  {card.title}
                </h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  {card.subtitle}
                </p>
              </div>

              {/* Botón que abre el artículo individual de la tarjeta */}
              <button
                onClick={() => setActiveArticleId(card.id)}
                className="w-full bg-purple-200/80 hover:bg-purple-300/80 text-purple-900 text-xs font-semibold py-2 px-3 rounded-xl transition-colors flex items-center justify-center gap-1 cursor-pointer mt-2"
              >
                <span>Leer más</span>
                <span>→</span>
              </button>
            </div>
          ))}
        </div>

        {/* Bloque Mitos y Ayuda Médica */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-4 items-start">
          
          {/* Columna Izquierda: Mitos y Realidades */}
          <div className="lg:col-span-7 bg-gray-50/70 border border-gray-200/60 rounded-3xl p-5 sm:p-6 space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-xl text-purple-700">💡</span>
              <h3 className="font-bold text-gray-900 text-lg">Mitos y realidades</h3>
            </div>

            <div className="space-y-2.5">
              {mitos.map((m) => {
                const isOpen = openMito === m.id;
                return (
                  <div
                    key={m.id}
                    className="bg-white border border-gray-200/80 rounded-2xl overflow-hidden transition-all shadow-2xs"
                  >
                    <button
                      onClick={() => setOpenMito(isOpen ? null : m.id)}
                      className="w-full text-left p-3.5 sm:p-4 flex items-center justify-between gap-3 font-semibold text-xs sm:text-sm text-purple-950 hover:bg-purple-50/50 cursor-pointer"
                    >
                      <span>{m.pregunta}</span>
                      <span className="text-purple-700 font-bold text-base transition-transform duration-200">
                        {isOpen ? '▲' : '▼'}
                      </span>
                    </button>

                    {isOpen && (
                      <div className="px-4 pb-4 pt-1 text-xs text-gray-600 border-t border-purple-50 leading-relaxed bg-purple-50/30">
                        {m.respuesta}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Columna Derecha: Orientación médica y fuentes */}
          <div className="lg:col-span-5 space-y-4">
            
            {/* Cuándo pedir ayuda */}
            <div className="bg-[#EBF7F1] border border-emerald-200/60 rounded-3xl p-5 flex items-center justify-between gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
                  <span className="text-emerald-600 text-base">💚</span>
                  <span>Cuándo pedir ayuda</span>
                </div>
                <p className="text-xs text-gray-700 leading-relaxed">
                  Si las molestias persisten, empeoran o te preocupan, consulta a un profesional de salud.
                </p>
              </div>

              <div className="w-24 sm:w-28 shrink-0">
                <img
                  src={inicio05}
                  alt="Doctora orientación médica"
                  className="w-full h-auto object-contain rounded-2xl"
                />
              </div>
            </div>

            {/* Fuentes consultadas */}
            <div className="bg-gray-50/70 border border-gray-200/60 rounded-3xl p-4 sm:p-5 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-gray-800">
                <span>📖</span>
                <span>Fuentes consultadas</span>
              </div>
              <p className="text-[11px] text-gray-500">
                Contenido basado en información de fuentes confiables:
              </p>

              <div className="flex flex-wrap gap-2 pt-1">
                <a
                  href="https://www.aad.org"
                  target="_blank"
                  rel="noreferrer"
                  className="bg-white border border-gray-200 hover:border-purple-300 rounded-xl px-3 py-1.5 text-[11px] font-medium text-purple-900 flex items-center gap-1.5 transition-colors shadow-2xs"
                >
                  <span>↗</span>
                  <span>Academia Americana de Dermatología</span>
                </a>

                <a
                  href="https://www.healthychildren.org"
                  target="_blank"
                  rel="noreferrer"
                  className="bg-white border border-gray-200 hover:border-purple-300 rounded-xl px-3 py-1.5 text-[11px] font-medium text-purple-900 flex items-center gap-1.5 transition-colors shadow-2xs"
                >
                  <span>↗</span>
                  <span>HealthyChildren</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};