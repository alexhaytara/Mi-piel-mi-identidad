import React, { useEffect, useState } from 'react';
import { 
  Sun, 
  Moon, 
  ChevronDown, 
  ChevronUp, 
  Droplet, 
  ShieldCheck, 
  Waves,
  Sparkles,
  AlertCircle,
  Loader2,
  Smile,
  Calendar,
  Stethoscope,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  Check
} from 'lucide-react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../services/firebase'; // Ajusta la ruta según tu proyecto

interface RutinaPageProps {
  userId?: string;
}

// Estructura del Perfil General
interface PerfilUsuario {
  nombre?: string;
  condicion?: string;
  sensibilidad?: string;
  tipoPiel?: string;
  notas?: string;
}

// Estructura del Registro Diario
interface RegistroDiario {
  animo?: string;
  fecha?: string;
  fechaId?: string;
  intensidades?: {
    Brotes?: string;
    Descamación?: string;
    Descamacion?: string;
    Irritación?: string;
    Irritacion?: string;
  };
  noProductos?: boolean;
  rutina?: string;
  sentimientoPiel?: string;
}

// --------------------------------------------------------------------------
// DICCIONARIO DE TRATAMIENTOS Y RECOMENDACIONES EN EL FRONTEND
// --------------------------------------------------------------------------
interface RecomendacionDetalle {
  foco: string;
  mensajeEscucha: string;
  pasosRecomendados: string[];
  ingredientesClave: string[];
  evitarAbsolutamente: string[];
}

type TipoPielClave = 'seca' | 'mixta' | 'grasa' | 'sensible';

const RECOMENDACIONES_DERMATOLOGICAS: Record<TipoPielClave, Record<string, RecomendacionDetalle>> = {
  seca: {
    combinado: {
      foco: 'Reparación Intensiva de Barrera + Nutrición Oclusiva',
      mensajeEscucha: 'Entendemos lo incómodo que es sentir la piel tirante, descamada y con brotes al mismo tiempo. Al ser piel seca, la barrera lipídica se ha roto. Lo primordial hoy es reparar la barrera antes de tratar los brotes.',
      pasosRecomendados: [
        'Limpia con leche limpiadora o bálsamo sin sulfatos sólo con agua tibia.',
        'Aplica una crema rica en Ceramidas, Colesterol y Ácido Hialurónico sobre la piel húmeda.',
        'Pausa el uso de exfoliantes, exfoliantes físicos, ácidos y retinoides hasta que ceda la irritación.',
        'Usa protector solar con filtro físico (Óxido de Zinc) de acabado hidratante.'
      ],
      ingredientesClave: ['Ceramidas NP/EOP', 'Avena coloidal', 'Manteca de Karité', 'Escualano', 'Pantenol (Vitamina B5)'],
      evitarAbsolutamente: ['Ácido Salicílico en concentraciones altas', 'Alcohol desnaturalizado', 'Jabones en barra con pH alcalino', 'Fragancias/Perfumes']
    },
    brotes: {
      foco: 'Control de Imperfecciones sin Resecar',
      mensajeEscucha: 'Tus brotes en piel seca suelen deberse a una barrera deshidratada que acumula células muertas. Necesitamos tratar el brote con extrema suavidad.',
      pasosRecomendados: [
        'Limpia con limpiadores en crema o loción.',
        'Usa tratamiento focalizado puntual (spot treatment) suave solo sobre la espinilla.',
        'Hidrata profundamente con ceramidas para prevenir más descamación.'
      ],
      ingredientesClave: ['Niacinamida al 2-5%', 'Ácido Dicarboxílico / Azelaico al 10%', 'Ácido Hialurónico'],
      evitarAbsolutamente: ['Peróxido de Benzoilo al 10%', 'Alcohol tónico', 'Limpiadores en gel astringentes']
    },
    descamacion: {
      foco: 'Nutrición Profunda y Restauración de Lípidos',
      mensajeEscucha: 'Tu piel seca está pidiendo lípidos urgente. La descamación indica falta de humedad y grasas esenciales.',
      pasosRecomendados: [
        'Aplica cremas densas tipo bálsamo reparador.',
        'Realiza técnica de "slugging" de noche con una pequeña capa de vaselina pura o escualano.',
        'Evita lavar el rostro más de 2 veces al día.'
      ],
      ingredientesClave: ['Ceramidas', 'Escualano', 'Aceite de Jojoba', 'Glicerina'],
      evitarAbsolutamente: ['Exfoliantes granulares', 'Ácidos AHA/BHA', 'Agua muy caliente']
    },
    irritacion: {
      foco: 'Calmante e Hipoalergénico',
      mensajeEscucha: 'Sentimos la molestia de la irritación. Tu piel seca necesita calma inmediata y cero activos agresivos.',
      pasosRecomendados: [
        'Simplifica tu rutina al mínimo: Limpiador suave + Crema con Pantenol + Fotoprotector.',
        'Aplica compresas frías con agua termal o té de manzanilla frío.',
        'No pruebes productos nuevos durante este brote de sensibilidad.'
      ],
      ingredientesClave: ['Pantenol (5%)', 'Avena Coloidal', 'Centella Asiática (Cica)', 'Alantoína'],
      evitarAbsolutamente: ['Vitamina C pura (L-Ascórbico)', 'AHA/BHA', 'Perfumes/Aceites esenciales']
    }
  },
  mixta: {
    combinado: {
      foco: 'Equilibrio de Barrera Cutánea en Zonas T y Secas',
      mensajeEscucha: 'Manejar brotes, piel escamada e irritación en una piel mixta puede ser frustrante. Normalizaremos el sebo en la zona T sin deshidratar tus mejillas.',
      pasosRecomendados: [
        'Limpia con un gel suave de pH fisiológico (5.5).',
        'Aplica crema ligera/loción con ceramidas en mejillas y un gel fluido en la zona T.',
        'Usa el tratamiento para brotes únicamente donde existan espinillas activas.',
        'Evita tónicos con alcohol que empeoran la irritación.'
      ],
      ingredientesClave: ['Niacinamida (3-5%)', 'Ácido Azelaico', 'Glicerina', 'Centella Asiática'],
      evitarAbsolutamente: ['Jabones astringentes potentes', 'Exfoliación mecánica (cepillos/scrobs)', 'Alcohol desnaturalizado']
    },
    brotes: {
      foco: 'Regulación de Sebo y Poro Limpio',
      mensajeEscucha: 'Tus brotes están concentrados probablemente en la zona T. Trateremos las zonas inflamadas sin resecar el resto del rostro.',
      pasosRecomendados: [
        'Limpia mañana y noche con limpiador suave en gel.',
        'Trata solo las zonas con brotes.',
        'Mantén la hidratación fluida en todo el rostro.'
      ],
      ingredientesClave: ['Ácido Salicílico al 1%', 'Niacinamida', 'Té Verde'],
      evitarAbsolutamente: ['Aceites pesados comedogénicos', 'Crema ultra oclusiva en zona T']
    },
    descamacion: {
      foco: 'Hidratación Multicapa Ligera',
      mensajeEscucha: 'La descamación en piel mixta suele indicar deshidratación por uso excesivo de productos anti-acné.',
      pasosRecomendados: [
        'Suspende temporalmente los ácidos anti-acné.',
        'Aplica sueros de Ácido Hialurónico sobre piel húmeda.',
        'Refuerza con crema ligera rica en ceramidas.'
      ],
      ingredientesClave: ['Ácido Hialurónico varios pesos', 'Pantenol', 'Ceramidas ligeras'],
      evitarAbsolutamente: ['Tratamientos de acné alcohólicos', 'Exfoliantes de grano']
    },
    irritacion: {
      foco: 'Alivio Térmico y Antiinflamatorio',
      mensajeEscucha: 'Tu piel mixta está reaccionando. Calma la inflamación antes de retomar cualquier producto activo.',
      pasosRecomendados: [
        'Aplica agua termal fresca o gel de aloe puro sin alcohol.',
        'Protege con solar fluido sin fragancias.',
        'Suspende la doble limpieza o cepillos faciales.'
      ],
      ingredientesClave: ['Aloe Vera puro', 'Centella Asiática', 'Bisabolol'],
      evitarAbsolutamente: ['Tónicos matificantes', 'Ácido Glicólico', 'Vitamina C concentrada']
    }
  },
  grasa: {
    combinado: {
      foco: 'Reparación Oil-Free sin Comedogenicidad',
      mensajeEscucha: 'Tener piel grasa con descamación e irritación suele ser señal de "piel grasa deshidratada" por sobre-lavado o exceso de ácidos. Es momento de un respiro.',
      pasosRecomendados: [
        'Pausa de inmediato el Ácido Salicílico, Retinol o Peróxido de Benzoilo.',
        'Limpia con gel suave sin sulfatos (Syndet) que no deje tirantez.',
        'Hidrata con gel o emulsión acuosa "Oil-Free" rica en Pantenol y Niacinamida.',
        'Usa protector solar matificante de filtro mineral / toque seco.'
      ],
      ingredientesClave: ['Pantenol', 'Niacinamida (4%)', 'Ácido Hialurónico Gel', 'Gluconolactona (PHA)'],
      evitarAbsolutamente: ['Peróxido de benzoilo alto', 'Alcohol denat', 'Aceites vegetales comedogénicos', 'Frotar con toalla']
    },
    brotes: {
      foco: 'Desobstrucción y Control Antiinflamatorio',
      mensajeEscucha: 'Entendemos el deseo de eliminar el acné rápido, pero trataremos los brotes con activos respetuosos.',
      pasosRecomendados: [
        'Limpia dos veces al día con gel seborregulador suave.',
        'Aplica tratamiento focal en gel.',
        'Usa fotoprotector fluido sin grasas.'
      ],
      ingredientesClave: ['Ácido Salicílico 1-2%', 'Ácido Azelaico', 'Zinc PCA'],
      evitarAbsolutamente: ['Cremas ricas comedogénicas', 'Jabones en barra abrasivos']
    },
    descamacion: {
      foco: 'Rehidratación Acuosa y Restauración de Barrera',
      mensajeEscucha: 'Si tu piel grasa se descama, está deshidratada en agua. Necesitamos agua, no aceites.',
      pasosRecomendados: [
        'Pausa los exfoliantes.',
        'Aplica varias capas de suero hidratante acuoso.',
        'Sella con una emulsión ligera sin aceite.'
      ],
      ingredientesClave: ['Ácido Hialurónico', 'Sodio PCA', 'Glicerina'],
      evitarAbsolutamente: ['Slugging con vaselina gruesa', 'Aceite de Coco']
    },
    irritacion: {
      foco: 'Calmante Gelificado para Piel Sensibilizada',
      mensajeEscucha: 'La irritación en piel grasa necesita calma inmediata en texturas ligeras que no tapen tus poros.',
      pasosRecomendados: [
        'Usa geles dermatológicos calmantes.',
        'Evita maquillaje pesado por un par de días.',
        'Aplica compresa helada con té verde fresco.'
      ],
      ingredientesClave: ['Centella Asiática Gel', 'Madecassoside', 'Extracto de Té Verde'],
      evitarAbsolutamente: ['Ácidos AHA/BHA', 'Retinoides', 'Lociones con alcohol tónico']
    }
  },
  sensible: {
    combinado: {
      foco: 'Protocolo Cero Alérgenos y Reparación Cutánea',
      mensajeEscucha: 'Sabemos lo delicada y reactiva que es tu piel. Ante brotes, descamación e irritación simultáneas, entramos en modo "recuperación pura".',
      pasosRecomendados: [
        'Reduce tu rutina a 3 productos clave: Limpiador sin aclarado o gel neutro + Crema Cica/Reparadora + Protector Mineral.',
        'Cero activos exfoliantes, acido salicílico, retinol o aceites esenciales.',
        'Usa agua tibia o fresca (nunca caliente).',
        'Si sientes calor o ardor, aplica spray de agua termal y presiona con toques suaves.'
      ],
      ingredientesClave: ['Avena Coloidal', 'Agua Termal', 'Madecassoside', 'Neurosensina', 'Óxido de Zinc'],
      evitarAbsolutamente: ['Cualquier fragancia/perfume', 'Conservantes agresivos', 'Ácidos', 'Exfoliación física']
    },
    brotes: {
      foco: 'Tratamiento Piel Sensible con Brotes (Acné/Rosácea)',
      mensajeEscucha: 'Trataremos tus brotes con activos bien tolerados que calmen el enrojecimiento al mismo tiempo.',
      pasosRecomendados: [
        'Limpia con máxima delicadeza.',
        'Usa Ácido Azelaico como activo principal (ideal para sensibilidad y brotes).',
        'Sella con crema neutra.'
      ],
      ingredientesClave: ['Ácido Azelaico 10%', 'Niacinamida 2%', 'Ectoína'],
      evitarAbsolutamente: ['Peróxido de Benzoilo', 'Ácido Salicílico fuerte', 'Aceite de Árbol de Té']
    },
    descamacion: {
      foco: 'Restauración Calmante sin Alérgenos',
      mensajeEscucha: 'La descamación en piel sensible causa mucha tirantez. Nutriremos la piel con ingredientes ultra seguros.',
      pasosRecomendados: [
        'Aplica cremas formuladas para pieles atópicas o intolerantes.',
        'Aplica toques delicados sin frotar.',
        'Usa humidificador en tu habitación si el clima es seco.'
      ],
      ingredientesClave: ['Ceramidas puras', 'Pantenol 5%', 'Manteca de Karité refinada'],
      evitarAbsolutamente: ['Cremas con fragancias botánicas', 'Ácidos AHA']
    },
    irritacion: {
      foco: 'SOS Calmante e Inflamatorio',
      mensajeEscucha: 'Tu piel necesita descansar de todo estímulo externó. Nos enfocaremos en detener el ardor.',
      pasosRecomendados: [
        'Aplica bálsamos reparadores "Cica".',
        'Usa únicamente fotoprotector mineral con Dióxido de Titanio / Óxido de Zinc.',
        'Evita el sol directo e higiene con fricción.'
      ],
      ingredientesClave: ['Agua Termal', 'Calamina', 'Pantenol', 'Bisabolol'],
      evitarAbsolutamente: ['Perfumes', 'Alcohol', 'Filtros solares químicos reactivos']
    }
  }
};

export const RutinaPage: React.FC<RutinaPageProps> = ({ userId }) => {
  const [perfil, setPerfil] = useState<PerfilUsuario | null>(null);
  const [registroHoy, setRegistroHoy] = useState<RegistroDiario | null>(null);
  const [cargando, setCargando] = useState<boolean>(true);

  // Estado interactivo para mostrar la guía médica cuando es leve/moderada
  const [mostrarGuiaMedicaUser, setMostrarGuiaMedicaUser] = useState<boolean>(false);

  // Acordeones desplegables
  const [openStepManana, setOpenStepManana] = useState<number | null>(null);
  const [openStepNoche, setOpenStepNoche] = useState<number | null>(null);

  useEffect(() => {
    const cargarDatos = async () => {
      if (!userId) {
        setCargando(false);
        return;
      }

      try {
        // Generar la fecha de hoy en formato local YYYY-MM-DD
        const fechaLocal = new Date();
        const año = fechaLocal.getFullYear();
        const mes = String(fechaLocal.getMonth() + 1).padStart(2, '0');
        const dia = String(fechaLocal.getDate()).padStart(2, '0');
        const hoy = `${año}-${mes}-${dia}`;

        // 1. Obtener Perfil General
        const perfilRef = doc(db, 'perfiles', userId);
        const perfilSnap = await getDoc(perfilRef);

        if (perfilSnap.exists()) {
          setPerfil(perfilSnap.data() as PerfilUsuario);
        }

        // 2. Obtener Registro Diario de Hoy
        const diarioRef = doc(db, 'users', userId, 'registros_diarios', hoy);
        const diarioSnap = await getDoc(diarioRef);

        if (diarioSnap.exists()) {
          setRegistroHoy(diarioSnap.data() as RegistroDiario);
        }
      } catch (err) {
        console.error('Error al obtener datos de Firestore:', err);
      } finally {
        setCargando(false);
      }
    };

    cargarDatos();
  }, [userId]);

  const toggleManana = (index: number) => {
    setOpenStepManana(openStepManana === index ? null : index);
  };

  const toggleNoche = (index: number) => {
    setOpenStepNoche(openStepNoche === index ? null : index);
  };

  if (cargando) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-3">
        <Loader2 className="w-8 h-8 text-purple-700 animate-spin" />
        <p className="text-sm text-purple-900 font-medium">Sincronizando perfil y registro diario...</p>
      </div>
    );
  }

  // Normalización del Perfil
  const sensibilidadStr = (perfil?.sensibilidad || 'no').toLowerCase();
  const tipoPielRaw = (perfil?.tipoPiel || 'normal').toLowerCase();
  const esSensible = sensibilidadStr.includes('si') || sensibilidadStr.includes('sí') || sensibilidadStr.includes('alta') || sensibilidadStr.includes('a veces');

  // Mapear Tipo de Piel para el Diccionario Front-end
  let claveTipoPiel: TipoPielClave = 'mixta';
  if (esSensible) {
    claveTipoPiel = 'sensible';
  } else if (tipoPielRaw.includes('seca')) {
    claveTipoPiel = 'seca';
  } else if (tipoPielRaw.includes('grasa') || tipoPielRaw.includes('acne')) {
    claveTipoPiel = 'grasa';
  } else if (tipoPielRaw.includes('mixta')) {
    claveTipoPiel = 'mixta';
  }

  // Normalización de intensidades del Registro Diario
  const intensidades = registroHoy?.intensidades || {};
  const valorBrotes = intensidades.Brotes || 'Ninguno';
  const valorDescamacion = intensidades.Descamación || intensidades.Descamacion || 'Ninguno';
  const valorIrritacion = intensidades.Irritación || intensidades.Irritacion || 'Ninguno';

  const nivelBrotes = valorBrotes.toLowerCase();
  const nivelDescamacion = valorDescamacion.toLowerCase();
  const nivelIrritacion = valorIrritacion.toLowerCase();

  const tieneBrotesActivos = nivelBrotes !== 'ninguno' && nivelBrotes !== '';
  const tieneDescamacionActiva = nivelDescamacion !== 'ninguno' && nivelDescamacion !== '';
  const tieneIrritacionActiva = nivelIrritacion !== 'ninguno' && nivelIrritacion !== '';

  // EVALUACIÓN DE INTENSIDADES (Leve / Moderada / Intensa)
  const esIntensa = (val: string) => val.includes('intensa') || val.includes('alta') || val.includes('severo') || val.includes('severa');
  
  const hayAlgunaIntensa = esIntensa(nivelBrotes) || esIntensa(nivelDescamacion) || esIntensa(nivelIrritacion);

  // BANDERAS DE VERIFICACIÓN
  const tieneAlgunaCondicionActiva = tieneBrotesActivos || tieneDescamacionActiva || tieneIrritacionActiva;

  // Decisión de mostrar la guía médica:
  // Si hay alguna INTENSA, se muestra directo. Si es Leve/Moderada, depende de la respuesta del usuario.
  const debeMostrarGuiaMedica = hayAlgunaIntensa || mostrarGuiaMedicaUser;

  // Determinar la clave de recomendación actual según los síntomas activos
  let claveSintoma = 'combinado';
  const conteoSintomas = [tieneBrotesActivos, tieneDescamacionActiva, tieneIrritacionActiva].filter(Boolean).length;

  if (conteoSintomas >= 2) {
    claveSintoma = 'combinado';
  } else if (tieneBrotesActivos) {
    claveSintoma = 'brotes';
  } else if (tieneDescamacionActiva) {
    claveSintoma = 'descamacion';
  } else if (tieneIrritacionActiva) {
    claveSintoma = 'irritacion';
  }

  // Obtener la recomendación dinámicamente desde la memoria local
  const recomendacionActual: RecomendacionDetalle = 
    RECOMENDACIONES_DERMATOLOGICAS[claveTipoPiel]?.[claveSintoma] || 
    RECOMENDACIONES_DERMATOLOGICAS.mixta.combinado;

  return (
    <div className="max-w-5xl mx-auto p-6 sm:p-8 bg-white/80 backdrop-blur-md rounded-3xl shadow-sm border border-purple-100/70 space-y-8">
      <link 
        href="https://fonts.googleapis.com/css2?family=Caveat:wght@600;700&display=swap" 
        rel="stylesheet" 
      />

      {/* 1. CABECERA */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-purple-950 font-serif">Mi rutina personalizada</h1>
          <p className="text-xs sm:text-sm text-gray-600 mt-1 max-w-xl leading-relaxed">
            Adaptada automáticamente según tu tipo de piel y los registros de hoy.
          </p>
        </div>

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

      {/* 2. RESUMEN DEL DÍA */}
      <div className="bg-gradient-to-br from-purple-50/90 to-pink-50/50 border border-purple-100 rounded-2xl p-5 shadow-2xs space-y-4">
        <div className="flex items-center justify-between border-b border-purple-100/80 pb-3">
          <div className="flex items-center gap-2 text-purple-950">
            <Sparkles className="w-5 h-5 text-purple-700" />
            <h2 className="font-bold text-sm sm:text-base">Resumen del día de hoy</h2>
          </div>
          {registroHoy?.fecha && (
            <div className="flex items-center gap-1.5 text-xs text-purple-800 font-medium bg-purple-100/50 px-3 py-1 rounded-full">
              <Calendar className="w-3.5 h-3.5" />
              <span>{registroHoy.fecha}</span>
            </div>
          )}
        </div>

        {/* Métricas clave */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="bg-white/80 p-2.5 rounded-xl border border-purple-100">
            <span className="text-gray-500 block">Tipo de piel</span>
            <span className="font-semibold text-purple-950 capitalize">{tipoPielRaw}</span>
          </div>

          <div className="bg-white/80 p-2.5 rounded-xl border border-purple-100">
            <span className="text-gray-500 block">Estado de Ánimo</span>
            <div className="flex items-center gap-1 mt-0.5">
              <Smile className="w-3.5 h-3.5 text-purple-600" />
              <span className="font-semibold text-purple-950">{registroHoy?.animo || 'No registrado'}</span>
            </div>
          </div>

          <div className="bg-white/80 p-2.5 rounded-xl border border-purple-100">
            <span className="text-gray-500 block">Sensación de Piel</span>
            <span className="font-semibold text-purple-950">{registroHoy?.sentimientoPiel || 'Neutral'}</span>
          </div>

          <div className="bg-white/80 p-2.5 rounded-xl border border-purple-100">
            <span className="text-gray-500 block">Momento del día</span>
            <span className="font-semibold text-purple-950">{registroHoy?.rutina || 'Mañana y Noche'}</span>
          </div>
        </div>

        {/* Alerta de alergias/sensibilidad del perfil */}
        {(esSensible || perfil?.notas) && (
          <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 text-amber-900 text-xs p-3 rounded-xl">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <strong>Recomendación por alergias/sensibilidad:</strong>
              {perfil?.notas && <p className="mt-0.5 text-amber-800 font-medium">"{perfil.notas}"</p>}
              <p className="mt-1 text-amber-700">Aplica productos hipoalergénicos sin fragancias ni compuestos irritantes.</p>
            </div>
          </div>
        )}
      </div>

      {/* 3. RUTINA DE LA MAÑANA */}
      <div className="bg-emerald-50/60 border border-emerald-100/80 rounded-3xl p-5 sm:p-6 space-y-4 shadow-2xs">
        <div className="flex items-center justify-between pb-1">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-100/80 text-emerald-800 rounded-2xl">
              <Sun className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <h2 className="font-bold text-gray-900 text-base sm:text-lg">Rutina de la mañana</h2>
              <p className="text-xs text-gray-500">Limpieza y protección solar diurna.</p>
            </div>
          </div>
        </div>

        <div className="space-y-3 pt-1">
          <div className="bg-white/90 border border-gray-100 rounded-2xl p-4 shadow-2xs transition-all">
            <div onClick={() => toggleManana(1)} className="flex items-center justify-between cursor-pointer">
              <div className="flex items-center gap-3 sm:gap-4">
                <span className="w-7 h-7 flex items-center justify-center bg-purple-100 text-purple-800 font-bold text-xs rounded-full shrink-0">1</span>
                <div className="w-7 h-7 flex items-center justify-center text-lg shrink-0">🧴</div>
                <div>
                  <h3 className="font-bold text-gray-900 text-sm">
                    {esSensible ? 'Limpiador dermolimpiador suave (Sin Jabón)' : 'Limpiador hidratante ligero'}
                  </h3>
                  <p className="text-xs text-gray-500">Limpia impurezas sin alterar la barrera cutánea.</p>
                </div>
              </div>
              <button className="text-gray-400 hover:text-gray-600">
                {openStepManana === 1 ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </button>
            </div>
            {openStepManana === 1 && (
              <div className="mt-3 pt-3 border-t border-gray-100 text-xs text-gray-600 leading-relaxed bg-emerald-50/40 p-3 rounded-xl">
                Aplica con agua tibia haciendo masajes suaves. Al tener piel {tipoPielRaw}, evita limpiadores agresivos con sulfatos.
              </div>
            )}
          </div>

          <div className="bg-white/90 border border-gray-100 rounded-2xl p-4 shadow-2xs transition-all">
            <div onClick={() => toggleManana(2)} className="flex items-center justify-between cursor-pointer">
              <div className="flex items-center gap-3 sm:gap-4">
                <span className="w-7 h-7 flex items-center justify-center bg-purple-100 text-purple-800 font-bold text-xs rounded-full shrink-0">2</span>
                <div className="w-7 h-7 flex items-center justify-center text-blue-500 shrink-0">
                  <Droplet className="w-5 h-5 fill-blue-100 stroke-blue-500" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-sm">
                    {tieneDescamacionActiva ? 'Crema hidratante reparadora con ceramidas' : 'Crema hidratante fluida'}
                  </h3>
                  <p className="text-xs text-gray-500">Mantiene la hidratación a lo largo del día.</p>
                </div>
              </div>
              <button className="text-gray-400 hover:text-gray-600">
                {openStepManana === 2 ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </button>
            </div>
            {openStepManana === 2 && (
              <div className="mt-3 pt-3 border-t border-gray-100 text-xs text-gray-600 leading-relaxed bg-blue-50/40 p-3 rounded-xl">
                Aplica sobre el rostro húmedo para atrapar la hidratación y reparar la barrera cutánea.
              </div>
            )}
          </div>

          <div className="bg-white/90 border border-gray-100 rounded-2xl p-4 shadow-2xs transition-all">
            <div onClick={() => toggleManana(3)} className="flex items-center justify-between cursor-pointer">
              <div className="flex items-center gap-3 sm:gap-4">
                <span className="w-7 h-7 flex items-center justify-center bg-purple-100 text-purple-800 font-bold text-xs rounded-full shrink-0">3</span>
                <div className="w-7 h-7 flex items-center justify-center text-amber-500 shrink-0">
                  <Sun className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-sm">
                    {esSensible ? 'Protector solar mineral (Óxido de Zinc FPS 50+)' : 'Protector solar FPS 50+'}
                  </h3>
                  <p className="text-xs text-gray-500">Protege de la radiación UV y agresores ambientales.</p>
                </div>
              </div>
              <button className="text-gray-400 hover:text-gray-600">
                {openStepManana === 3 ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </button>
            </div>
            {openStepManana === 3 && (
              <div className="mt-3 pt-3 border-t border-gray-100 text-xs text-gray-600 leading-relaxed bg-amber-50/40 p-3 rounded-xl">
                Aplica la cantidad equivalente a dos dedos sobre rostro y cuello cada mañana.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 4. RUTINA DE LA NOCHE */}
      <div className="bg-purple-50/60 border border-purple-100/80 rounded-3xl p-5 sm:p-6 space-y-4 shadow-2xs">
        <div className="flex items-center justify-between pb-1">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100/80 text-purple-900 rounded-2xl">
              <Moon className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <h2 className="font-bold text-gray-900 text-base sm:text-lg">Rutina de la noche</h2>
              <p className="text-xs text-gray-500">Recuperación intensiva nocturna.</p>
            </div>
          </div>
        </div>

        <div className="space-y-3 pt-1">
          <div className="bg-white/90 border border-gray-100 rounded-2xl p-4 shadow-2xs transition-all">
            <div onClick={() => toggleNoche(1)} className="flex items-center justify-between cursor-pointer">
              <div className="flex items-center gap-3 sm:gap-4">
                <span className="w-7 h-7 flex items-center justify-center bg-purple-100 text-purple-800 font-bold text-xs rounded-full shrink-0">1</span>
                <div className="w-7 h-7 flex items-center justify-center text-lg shrink-0">🧴</div>
                <div>
                  <h3 className="font-bold text-gray-900 text-sm">Limpieza nocturna restauradora</h3>
                  <p className="text-xs text-gray-500">Retira los residuos de bloqueador acumulados en el día.</p>
                </div>
              </div>
              <button className="text-gray-400 hover:text-gray-600">
                {openStepNoche === 1 ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </button>
            </div>
            {openStepNoche === 1 && (
              <div className="mt-3 pt-3 border-t border-gray-100 text-xs text-gray-600 leading-relaxed bg-purple-50/40 p-3 rounded-xl">
                Seca dando pequeños toques suavemente con una toalla limpia.
              </div>
            )}
          </div>

          <div className="bg-white/90 border border-gray-100 rounded-2xl p-4 shadow-2xs transition-all">
            <div onClick={() => toggleNoche(2)} className="flex items-center justify-between cursor-pointer">
              <div className="flex items-center gap-3 sm:gap-4">
                <span className="w-7 h-7 flex items-center justify-center bg-purple-100 text-purple-800 font-bold text-xs rounded-full shrink-0">2</span>
                <div className="w-7 h-7 flex items-center justify-center text-blue-500 shrink-0">
                  <Droplet className="w-5 h-5 fill-blue-100 stroke-blue-500" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-sm">Bálsamo / Crema densa con Pantenol</h3>
                  <p className="text-xs text-gray-500">Ayuda a la regeneración celular mientras duermes.</p>
                </div>
              </div>
              <button className="text-gray-400 hover:text-gray-600">
                {openStepNoche === 2 ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </button>
            </div>
            {openStepNoche === 2 && (
              <div className="mt-3 pt-3 border-t border-gray-100 text-xs text-gray-600 leading-relaxed bg-purple-50/40 p-3 rounded-xl">
                Aplicar una capa ligeramente más densa para sellar la hidratación en la noche.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 5. TARJETAS DE INTENSIDAD SEGÚN EL REGISTRO DIARIO */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-2">
        {/* Brotes */}
        <div className={`rounded-3xl p-5 flex flex-col justify-between space-y-4 border transition-all ${
          tieneBrotesActivos 
            ? 'bg-emerald-100 border-emerald-300 ring-2 ring-emerald-300' 
            : 'bg-emerald-50/70 border-emerald-100 opacity-60'
        }`}>
          <div className="flex justify-between items-start">
            <div className="w-10 h-10 rounded-2xl bg-emerald-200/80 flex items-center justify-center text-emerald-900">
              <Droplet className="w-5 h-5" />
            </div>
            <span className="text-emerald-700/50 text-2xl">🌿</span>
          </div>
          <div>
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-gray-900 text-sm mb-1">Brotes</h3>
              <span className="text-[10px] bg-emerald-700 text-white px-2 py-0.5 rounded-full font-bold capitalize">
                {valorBrotes}
              </span>
            </div>
            <p className="text-xs text-gray-600 mt-1">Usa limpiadores no comedogénicos y evita manipular la zona.</p>
          </div>
        </div>

        {/* Descamación */}
        <div className={`rounded-3xl p-5 flex flex-col justify-between space-y-4 border transition-all ${
          tieneDescamacionActiva
            ? 'bg-purple-100 border-purple-300 ring-2 ring-purple-300' 
            : 'bg-purple-50/70 border-purple-100 opacity-60'
        }`}>
          <div className="flex justify-between items-start">
            <div className="w-10 h-10 rounded-2xl bg-purple-200/80 flex items-center justify-center text-purple-900">
              <Waves className="w-5 h-5" />
            </div>
            <span className="text-purple-700/50 text-2xl">🍃</span>
          </div>
          <div>
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-gray-900 text-sm mb-1">Descamación</h3>
              <span className="text-[10px] bg-purple-700 text-white px-2 py-0.5 rounded-full font-bold capitalize">
                {valorDescamacion}
              </span>
            </div>
            <p className="text-xs text-gray-600 mt-1">Prioriza cremas oclusivas rica en ceramidas.</p>
          </div>
        </div>

        {/* Irritación */}
        <div className={`rounded-3xl p-5 flex flex-col justify-between space-y-4 border transition-all ${
          tieneIrritacionActiva
            ? 'bg-orange-100 border-orange-300 ring-2 ring-orange-300' 
            : 'bg-orange-50/70 border-orange-100 opacity-60'
        }`}>
          <div className="flex justify-between items-start">
            <div className="w-10 h-10 rounded-2xl bg-orange-200/80 flex items-center justify-center text-orange-900">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <span className="text-orange-700/50 text-2xl">♡</span>
          </div>
          <div>
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-gray-900 text-sm mb-1">Irritación</h3>
              <span className="text-[10px] bg-orange-700 text-white px-2 py-0.5 rounded-full font-bold capitalize">
                {valorIrritacion}
              </span>
            </div>
            <p className="text-xs text-gray-600 mt-1">Evita perfumes, alcoholes y exfoliantes químicos abrasivos.</p>
          </div>
        </div>
      </div>

      {/* 6. GUÍA DE TRATAMIENTO Y EMPATÍA PERSONALIZADA (SOLO SI TIENE SÍNTOMAS ACTIVOS) */}
      {tieneAlgunaCondicionActiva && (
        <>
          <div className="bg-white border border-purple-200/80 rounded-3xl p-6 shadow-sm space-y-6">
            <div className="flex items-center gap-3 border-b border-purple-100 pb-4">
              <div className="p-2.5 bg-purple-100 text-purple-900 rounded-2xl">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <h2 className="font-bold text-gray-900 text-lg">Recomendaciones personalizadas de tratamiento</h2>
                <p className="text-xs text-purple-800 font-medium capitalize">
                  Para piel {tipoPielRaw} • Enfoque: {recomendacionActual.foco}
                </p>
              </div>
            </div>

            {/* Mensaje de Escucha y Empatía */}
            <div className="bg-purple-50/70 border-l-4 border-purple-600 p-4 rounded-r-2xl text-xs text-purple-950 leading-relaxed italic">
              "{recomendacionActual.mensajeEscucha}"
            </div>

            {/* Pasos a Seguir y Qué Evitar */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
              {/* Qué hacer hoy */}
              <div className="bg-emerald-50/50 border border-emerald-100 p-4 rounded-2xl space-y-2.5">
                <h3 className="font-bold text-emerald-950 flex items-center gap-1.5 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Acciones recomendadas hoy:
                </h3>
                <ul className="space-y-2 text-gray-700">
                  {recomendacionActual.pasosRecomendados.map((paso, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-emerald-600 font-bold">•</span>
                      <span>{paso}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Qué evitar */}
              <div className="bg-rose-50/50 border border-rose-100 p-4 rounded-2xl space-y-2.5">
                <h3 className="font-bold text-rose-950 flex items-center gap-1.5 text-sm">
                  <AlertTriangle className="w-4 h-4 text-rose-600" />
                  Evitar estrictamente por hoy:
                </h3>
                <ul className="space-y-2 text-gray-700">
                  {recomendacionActual.evitarAbsolutamente.map((evitar, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-rose-600 font-bold">•</span>
                      <span>{evitar}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Ingredientes Favorables */}
            <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 space-y-2">
              <span className="text-xs font-bold text-gray-800 block">Ingredientes estrella para buscar en tus productos:</span>
              <div className="flex flex-wrap gap-2">
                {recomendacionActual.ingredientesClave.map((ing, idx) => (
                  <span key={idx} className="bg-white border border-purple-200 text-purple-900 text-[11px] font-medium px-2.5 py-1 rounded-full shadow-2xs">
                    ✨ {ing}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* PREGUNTA AMENA SI ES LEVE / MODERADA */}
          {!hayAlgunaIntensa && !mostrarGuiaMedicaUser && (
            <div className="bg-purple-50/60 border border-purple-200/70 rounded-3xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-purple-100 text-purple-800 rounded-2xl shrink-0">
                  <HelpCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-purple-950 text-sm">¿Estás considerando consultar con un médico o dermatólogo?</h3>
                  <p className="text-xs text-purple-700">Podemos darte algunos tips amigables para preparar tu consulta si lo deseas.</p>
                </div>
              </div>

              <div className="flex gap-2 shrink-0">
                <button
                  onClick={() => setMostrarGuiaMedicaUser(true)}
                  className="bg-purple-700 hover:bg-purple-800 text-white text-xs font-semibold px-4 py-2 rounded-xl transition-all shadow-2xs flex items-center gap-1"
                >
                  <Check className="w-3.5 h-3.5" />
                  Sí, ver recomendaciones
                </button>
              </div>
            </div>
          )}

          {/* 7. SECCIÓN: ANTES DE IR AL MÉDICO (SE MUESTRA SI ES INTENSA O SI EL USUARIO RESPONDIÓ SÍ) */}
          {debeMostrarGuiaMedica && (
            <div className="bg-amber-50/70 border border-amber-200/90 rounded-3xl p-6 shadow-2xs space-y-4 animate-fadeIn">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-amber-100 text-amber-900 rounded-2xl">
                    <Stethoscope className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="font-bold text-amber-950 text-base">Antes de acudir al dermatólogo</h2>
                    <p className="text-xs text-amber-800">Cuidado complementario y señales de advertencia.</p>
                  </div>
                </div>

                {!hayAlgunaIntensa && (
                  <button 
                    onClick={() => setMostrarGuiaMedicaUser(false)}
                    className="text-xs text-amber-800 hover:text-amber-950 underline font-medium"
                  >
                    Ocultar esta guía
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="bg-white/90 p-4 rounded-2xl border border-amber-100 space-y-2">
                  <h3 className="font-bold text-amber-900">¿Qué preparar para tu consulta médica?</h3>
                  <ul className="list-disc list-inside space-y-1.5 text-gray-700 leading-relaxed">
                    <li>Lleva fotos claras de los momentos donde el brote o descamación estuvo más fuerte.</li>
                    <li>Anota los nombres exactos de los cosméticos o limpiadores que usaste los últimos 7 días.</li>
                    <li>Toma captura de tu historial diario en esta app para mostrárselo al especialista.</li>
                  </ul>
                </div>

                <div className="bg-rose-100/60 p-4 rounded-2xl border border-rose-200 space-y-2">
                  <h3 className="font-bold text-rose-950 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4 text-rose-600" />
                    ¿Cuándo ir a emergencias o cita prioritaria?
                  </h3>
                  <ul className="list-disc list-inside space-y-1.5 text-rose-900 leading-relaxed">
                    <li>Si sientes hinchazón repentina en párpados, labios o cuello.</li>
                    <li>Si aparece ardor extremo que no cede con agua fría.</li>
                    <li>Si hay secreción amarillenta o ampollas abiertas con fiebre.</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};