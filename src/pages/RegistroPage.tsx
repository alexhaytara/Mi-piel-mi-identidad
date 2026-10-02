import React, { useState, useEffect } from 'react';
import { Calendar, Trash2, Plus, Check, Edit3, Loader2, Save } from 'lucide-react';
import { db, auth } from '../services/firebase'; // Ajusta la ruta a tu archivo de configuración de Firebase
import { doc, getDoc, setDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';

export const RegistroPage: React.FC = () => {
  // Estado de carga/guardado
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(true);
  const [hasExistingLog, setHasExistingLog] = useState<boolean>(false);

  // Formulario estados
  const [signos, setSignos] = useState<string[]>([]);
  const [intensidades, setIntensidades] = useState<Record<string, string>>({});
  const [rutina, setRutina] = useState<string>('Noche');
  const [noProductos, setNoProductos] = useState<boolean>(false);
  const [productos, setProductos] = useState<string[]>(['']);
  const [animo, setAnimo] = useState<string>('Bien');
  const [sentimientoPiel, setSentimientoPiel] = useState<string>('Neutral');
  const [reflexion, setReflexion] = useState<string>('');

  // Identificador de fecha actual (ej: "2026-10-01")
  const todayObj = new Date();
  const todayId = todayObj.toISOString().split('T')[0];
  const todayDateFormatted = todayObj.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  // Cargar el registro del día si existe
  useEffect(() => {
    const fetchTodayLog = async () => {
      const user = auth.currentUser;
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const docRef = doc(db, 'users', user.uid, 'registros_diarios', todayId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setSignos(data.signos || []);
          setIntensidades(data.intensidades || {});
          setRutina(data.rutina || 'Noche');
          setNoProductos(data.noProductos || false);
          setProductos(data.productos || ['']);
          setAnimo(data.animo || 'Bien');
          setSentimientoPiel(data.sentimientoPiel || 'Neutral');
          setReflexion(data.reflexion || '');
          setHasExistingLog(true);
          setIsEditing(false); // Vista previa si ya existe
        }
      } catch (error) {
        console.error('Error al cargar el registro diario:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTodayLog();
  }, [todayId]);

  // Manejo de signos e intensidad
  const toggleSigno = (signo: string) => {
    if (!isEditing) return;

    if (signo === 'Ninguno') {
      setSignos(['Ninguno']);
      setIntensidades({});
      return;
    }

    let nuevosSignos = signos.filter((s) => s !== 'Ninguno');
    if (nuevosSignos.includes(signo)) {
      nuevosSignos = nuevosSignos.filter((s) => s !== signo);
      const newInt = { ...intensidades };
      delete newInt[signo];
      setIntensidades(newInt);
    } else {
      nuevosSignos.push(signo);
      setIntensidades({ ...intensidades, [signo]: 'Leve' });
    }
    setSignos(nuevosSignos);
  };

  const handleIntensidadChange = (signo: string, nivel: string) => {
    if (!isEditing) return;
    setIntensidades({ ...intensidades, [signo]: nivel });
  };

  // Manejo de productos
  const handleAddProducto = () => {
    if (!isEditing || noProductos) return;
    setProductos([...productos, '']);
  };

  const handleProductoChange = (index: number, val: string) => {
    if (!isEditing) return;
    const newProds = [...productos];
    newProds[index] = val;
    setProductos(newProds);
  };

  const handleRemoveProducto = (index: number) => {
    if (!isEditing) return;
    setProductos(productos.filter((_, i) => i !== index));
  };

  // Guardar en Firestore
  const handleSave = async () => {
    const user = auth.currentUser;
    if (!user) {
      alert('Debes iniciar sesión para guardar tu registro.');
      return;
    }

    setSaving(true);
    try {
      const docRef = doc(db, 'users', user.uid, 'registros_diarios', todayId);
      
      // Filtrar productos vacíos si no seleccionó "No utilicé productos"
      const productosFiltrados = noProductos 
        ? [] 
        : productos.map(p => p.trim()).filter(p => p.length > 0);

      const logData = {
        fechaId: todayId,
        fecha: todayDateFormatted,
        signos,
        intensidades,
        rutina,
        noProductos,
        productos: productosFiltrados,
        animo,
        sentimientoPiel,
        reflexion: reflexion.trim(),
        updatedAt: serverTimestamp(),
      };

      await setDoc(docRef, logData, { merge: true });

      setHasExistingLog(true);
      setIsEditing(false);
      alert('¡Registro diario guardado exitosamente!');
    } catch (error) {
      console.error('Error al guardar el registro:', error);
      alert('Ocurrió un error al guardar tu registro.');
    } finally {
      setSaving(false);
    }
  };

  // Eliminar el registro del día actual
  const handleDelete = async () => {
    const user = auth.currentUser;
    if (!user) return;

    if (!confirm('¿Estás seguro de que deseas eliminar el registro de hoy?')) return;

    setSaving(true);
    try {
      const docRef = doc(db, 'users', user.uid, 'registros_diarios', todayId);
      await deleteDoc(docRef);

      // Reiniciar formulario
      setSignos([]);
      setIntensidades({});
      setRutina('Noche');
      setNoProductos(false);
      setProductos(['']);
      setAnimo('Bien');
      setSentimientoPiel('Neutral');
      setReflexion('');
      setHasExistingLog(false);
      setIsEditing(true);

      alert('Registro eliminado correctamente.');
    } catch (error) {
      console.error('Error al eliminar:', error);
      alert('Error al eliminar el registro.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[350px] space-y-3">
        <Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
        <p className="text-xs text-gray-500 font-medium">Cargando tu registro de hoy...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6 sm:p-8 bg-white/80 backdrop-blur-md rounded-3xl shadow-sm border border-purple-100/70 space-y-8">
      
      {/* CABECERA */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-2 border-b border-purple-100/60">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-purple-950 font-serif">Mi registro</h1>
          <p className="text-xs sm:text-sm text-gray-600 mt-1">
            Registra cómo estuvo tu piel hoy. Es rápido y te ayudará a ver tu evolución.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-purple-50/80 px-4 py-2 rounded-2xl border border-purple-100/80 text-xs text-purple-900 font-semibold self-end md:self-auto shadow-2xs">
          <Calendar className="w-4 h-4 text-purple-700" />
          <span>Fecha automática: {todayDateFormatted}</span>
        </div>
      </div>

      {/* PASO 1: SIGNOS OBSERVADOS */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start pt-2">
        <div className="md:col-span-4 flex items-start gap-3">
          <span className="w-7 h-7 flex items-center justify-center bg-purple-100 text-purple-800 font-bold text-xs rounded-full shrink-0">
            1
          </span>
          <div>
            <h3 className="font-bold text-gray-900 text-sm">Signos observados</h3>
            <p className="text-xs text-gray-500">Selecciona los signos que notaste hoy en tu piel.</p>
          </div>
        </div>

        <div className="md:col-span-8 flex flex-wrap gap-3">
          {['Brotes', 'Descamación', 'Irritación', 'Ninguno'].map((item) => {
            const isSelected = signos.includes(item);
            return (
              <button
                key={item}
                type="button"
                disabled={!isEditing}
                onClick={() => toggleSigno(item)}
                className={`px-4 py-2.5 rounded-2xl text-xs font-semibold flex items-center gap-2.5 border transition-all shadow-2xs ${
                  !isEditing ? 'opacity-80 cursor-default' : 'cursor-pointer'
                } ${
                  isSelected
                    ? 'bg-emerald-100/90 border-emerald-400/80 text-emerald-950 ring-2 ring-emerald-500/20'
                    : 'bg-white/90 border-gray-200/90 text-gray-700 hover:border-purple-300 hover:bg-purple-50/30'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-md border flex items-center justify-center transition-all ${
                    isSelected ? 'bg-emerald-700 border-emerald-700 text-white' : 'border-gray-300 bg-gray-50'
                  }`}
                >
                  {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                </div>
                <span>{item}</span>
              </button>
            );
          })}
        </div>
      </div>

      <hr className="border-purple-50" />

      {/* PASO 2: INTENSIDAD PERCIBIDA */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
        <div className="md:col-span-4 flex items-start gap-3">
          <span className="w-7 h-7 flex items-center justify-center bg-purple-100 text-purple-800 font-bold text-xs rounded-full shrink-0">
            2
          </span>
          <div>
            <h3 className="font-bold text-gray-900 text-sm">Intensidad percibida</h3>
            <p className="text-xs text-gray-500">Indica la intensidad de cada signo seleccionado.</p>
          </div>
        </div>

        <div className="md:col-span-8 bg-purple-50/40 border border-purple-100/80 rounded-2xl p-4 space-y-3.5">
          {signos.filter((s) => s !== 'Ninguno').length === 0 ? (
            <p className="text-xs text-gray-400 italic">Solo aparece si se selecciona un signo en el paso 1.</p>
          ) : (
            signos
              .filter((s) => s !== 'Ninguno')
              .map((signo) => (
                <div key={signo} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 bg-white/80 p-3 rounded-xl border border-purple-100/60 shadow-2xs">
                  <span className="font-bold text-xs text-purple-950 min-w-[90px]">{signo}</span>
                  <div className="flex gap-2">
                    {['Leve', 'Moderada', 'Intensa'].map((nivel) => {
                      const active = intensidades[signo] === nivel;
                      return (
                        <button
                          key={nivel}
                          type="button"
                          disabled={!isEditing}
                          onClick={() => handleIntensidadChange(signo, nivel)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-semibold border flex items-center gap-1.5 transition-all ${
                            !isEditing ? 'opacity-80 cursor-default' : 'cursor-pointer'
                          } ${
                            active
                              ? 'bg-emerald-100/90 border-emerald-400 text-emerald-950 ring-2 ring-emerald-500/20'
                              : 'bg-white border-gray-200/90 text-gray-600 hover:border-purple-300 hover:bg-purple-50/30'
                          }`}
                        >
                          <div
                            className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                              active ? 'border-emerald-700 bg-emerald-700' : 'border-gray-300 bg-gray-50'
                            }`}
                          >
                            {active && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                          </div>
                          <span>{nivel}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))
          )}
        </div>
      </div>

      <hr className="border-purple-50" />

      {/* PASO 3: RUTINA REALIZADA */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
        <div className="md:col-span-4 flex items-start gap-3">
          <span className="w-7 h-7 flex items-center justify-center bg-purple-100 text-purple-800 font-bold text-xs rounded-full shrink-0">
            3
          </span>
          <div>
            <h3 className="font-bold text-gray-900 text-sm">Rutina realizada</h3>
            <p className="text-xs text-gray-500">¿Qué parte de tu rutina realizaste hoy?</p>
          </div>
        </div>

        <div className="md:col-span-8 flex flex-wrap gap-3">
          {['Mañana', 'Noche', 'Ambas', 'Ninguna'].map((item) => {
            const isSelected = rutina === item;
            return (
              <button
                key={item}
                type="button"
                disabled={!isEditing}
                onClick={() => setRutina(item)}
                className={`px-4 py-2.5 rounded-2xl text-xs font-semibold flex items-center gap-2.5 border transition-all shadow-2xs ${
                  !isEditing ? 'opacity-80 cursor-default' : 'cursor-pointer'
                } ${
                  isSelected
                    ? 'bg-emerald-100/90 border-emerald-400/80 text-emerald-950 ring-2 ring-emerald-500/20'
                    : 'bg-white/90 border-gray-200/90 text-gray-700 hover:border-purple-300 hover:bg-purple-50/30'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-md border flex items-center justify-center ${
                    isSelected ? 'bg-emerald-700 border-emerald-700 text-white' : 'border-gray-300 bg-gray-50'
                  }`}
                >
                  {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                </div>
                <span>{item}</span>
              </button>
            );
          })}
        </div>
      </div>

      <hr className="border-purple-50" />

      {/* PASO 4: PRODUCTOS UTILIZADOS */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
        <div className="md:col-span-4 flex items-start gap-3">
          <span className="w-7 h-7 flex items-center justify-center bg-purple-100 text-purple-800 font-bold text-xs rounded-full shrink-0">
            4
          </span>
          <div>
            <h3 className="font-bold text-gray-900 text-sm">Productos utilizados</h3>
            <p className="text-xs text-gray-500">Añade los productos que usaste hoy (en caso de haberlos usado).</p>
          </div>
        </div>

        <div className="md:col-span-8 space-y-3">
          {!noProductos &&
            productos.map((prod, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <input
                  type="text"
                  disabled={!isEditing}
                  value={prod}
                  onChange={(e) => handleProductoChange(idx, e.target.value)}
                  placeholder="Nombre del producto..."
                  className="flex-1 px-4 py-2.5 border border-gray-200/90 rounded-2xl text-xs focus:ring-2 focus:ring-purple-400 focus:outline-none bg-white/90 shadow-2xs disabled:bg-gray-50 disabled:text-gray-500"
                />
                {isEditing && (
                  <button
                    type="button"
                    onClick={() => handleRemoveProducto(idx)}
                    className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}

          {isEditing && (
            <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
              <button
                type="button"
                onClick={handleAddProducto}
                disabled={noProductos}
                className={`px-4 py-2.5 bg-purple-100/80 hover:bg-purple-200 text-purple-900 text-xs font-semibold rounded-2xl flex items-center gap-1.5 transition-colors cursor-pointer border border-purple-200/60 shadow-2xs ${
                  noProductos ? 'opacity-40 cursor-not-allowed' : ''
                }`}
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Añadir producto</span>
              </button>

              <label className="flex items-center gap-2 px-3.5 py-2 bg-gray-50 rounded-xl border border-gray-200/80 text-xs font-medium text-gray-700 cursor-pointer hover:bg-purple-50/50">
                <input
                  type="checkbox"
                  checked={noProductos}
                  onChange={(e) => setNoProductos(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 text-purple-700 focus:ring-purple-400"
                />
                <span>No utilicé productos</span>
              </label>
            </div>
          )}
        </div>
      </div>

      <hr className="border-purple-50" />

      {/* PASO 5: ESTADO DE ÁNIMO GENERAL */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
        <div className="md:col-span-4 flex items-start gap-3">
          <span className="w-7 h-7 flex items-center justify-center bg-purple-100 text-purple-800 font-bold text-xs rounded-full shrink-0">
            5
          </span>
          <div>
            <h3 className="font-bold text-gray-900 text-sm">Estado de ánimo general</h3>
            <p className="text-xs text-gray-500">¿Cómo describirías tu estado de ánimo hoy?</p>
          </div>
        </div>

        <div className="md:col-span-8 flex flex-wrap gap-2.5">
          {['Muy mal', 'Mal', 'Neutral', 'Bien', 'Muy bien'].map((item) => {
            const active = animo === item;
            return (
              <button
                key={item}
                type="button"
                disabled={!isEditing}
                onClick={() => setAnimo(item)}
                className={`px-3.5 py-2 rounded-2xl text-xs font-semibold border flex items-center gap-2 transition-all shadow-2xs ${
                  !isEditing ? 'opacity-80 cursor-default' : 'cursor-pointer'
                } ${
                  active
                    ? 'bg-emerald-100/90 border-emerald-400/80 text-emerald-950 ring-2 ring-emerald-500/20'
                    : 'bg-white/90 border-gray-200/90 text-gray-700 hover:border-purple-300 hover:bg-purple-50/30'
                }`}
              >
                <div
                  className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                    active ? 'border-emerald-700 bg-emerald-700' : 'border-gray-300 bg-gray-50'
                  }`}
                >
                  {active && <Check className="w-2.5 h-2.5 text-white stroke-[3]" />}
                </div>
                <span>{item}</span>
              </button>
            );
          })}
        </div>
      </div>

      <hr className="border-purple-50" />

      {/* PASO 6: SENTIMIENTO RESPECTO A LA PIEL */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
        <div className="md:col-span-4 flex items-start gap-3">
          <span className="w-7 h-7 flex items-center justify-center bg-purple-100 text-purple-800 font-bold text-xs rounded-full shrink-0">
            6
          </span>
          <div>
            <h3 className="font-bold text-gray-900 text-sm">¿Cómo te sentiste hoy respecto a tu piel?</h3>
          </div>
        </div>

        <div className="md:col-span-8 flex flex-wrap gap-2.5">
          {['Muy incómodo/a', 'Incómodo/a', 'Neutral', 'Cómodo/a', 'Muy cómodo/a'].map((item) => {
            const active = sentimientoPiel === item;
            return (
              <button
                key={item}
                type="button"
                disabled={!isEditing}
                onClick={() => setSentimientoPiel(item)}
                className={`px-3.5 py-2 rounded-2xl text-xs font-semibold border flex items-center gap-2 transition-all shadow-2xs ${
                  !isEditing ? 'opacity-80 cursor-default' : 'cursor-pointer'
                } ${
                  active
                    ? 'bg-emerald-100/90 border-emerald-400/80 text-emerald-950 ring-2 ring-emerald-500/20'
                    : 'bg-white/90 border-gray-200/90 text-gray-700 hover:border-purple-300 hover:bg-purple-50/30'
                }`}
              >
                <div
                  className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                    active ? 'border-emerald-700 bg-emerald-700' : 'border-gray-300 bg-gray-50'
                  }`}
                >
                  {active && <Check className="w-2.5 h-2.5 text-white stroke-[3]" />}
                </div>
                <span>{item}</span>
              </button>
            );
          })}
        </div>
      </div>

      <hr className="border-purple-50" />

      {/* PASO 7: REFLEXIÓN OPCIONAL */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
        <div className="md:col-span-4 flex items-start gap-3">
          <span className="w-7 h-7 flex items-center justify-center bg-purple-100 text-purple-800 font-bold text-xs rounded-full shrink-0">
            7
          </span>
          <div>
            <h3 className="font-bold text-gray-900 text-sm">
              ¿Qué influyó en cómo te sentiste hoy respecto a tu piel?
            </h3>
            <p className="text-xs text-gray-400">(Opcional)</p>
          </div>
        </div>

        <div className="md:col-span-8 space-y-1">
          <textarea
            rows={3}
            maxLength={500}
            disabled={!isEditing}
            value={reflexion}
            onChange={(e) => setReflexion(e.target.value)}
            placeholder="Escribe detalles o pensamientos del día..."
            className="w-full p-3.5 border border-gray-200/90 rounded-2xl focus:ring-2 focus:ring-purple-400 focus:outline-none text-xs text-gray-700 bg-white/90 leading-relaxed shadow-2xs disabled:bg-gray-50 disabled:text-gray-500"
          />
          <div className="text-right text-[11px] text-gray-400">
            {reflexion.length}/500
          </div>
        </div>
      </div>

      {/* BOTONES DE ACCIÓN INFERIORES */}
      <div className="pt-4 flex flex-col sm:flex-row gap-3 items-center justify-between border-t border-purple-100/60">
        {isEditing ? (
          <button
            type="button"
            disabled={saving}
            onClick={handleSave}
            className="w-full sm:w-auto px-8 py-3.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-2xl transition-colors shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {saving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4 stroke-[2.5]" />
            )}
            <span>{saving ? 'Guardando...' : 'Guardar registro'}</span>
          </button>
        ) : (
          <div className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-4 py-2.5 rounded-2xl border border-emerald-200 flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />
            <span>Registro de hoy guardado</span>
          </div>
        )}

        <div className="flex gap-2 w-full sm:w-auto">
          {!isEditing && (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="flex-1 sm:flex-initial px-6 py-3.5 bg-purple-100/70 hover:bg-purple-200/80 text-purple-900 font-bold text-xs rounded-2xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer border border-purple-200/50"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Editar</span>
            </button>
          )}

          {hasExistingLog && (
            <button
              type="button"
              disabled={saving}
              onClick={handleDelete}
              className="flex-1 sm:flex-initial px-6 py-3.5 bg-white border border-rose-200 hover:bg-rose-50 text-rose-600 font-bold text-xs rounded-2xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Eliminar</span>
            </button>
          )}
        </div>
      </div>

    </div>
  );
};