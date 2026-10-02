// src/components/LoginModal.tsx
import React, { useState } from 'react';
import portadaImg from '../assets/imagenportada01.png';
import fondoImg from '../assets/fondo.jpg';
import { registrarUsuario, iniciarSesion } from '../services/authService';
import { guardarPerfil } from '../services/dbService';

interface LoginModalProps {
  onLoginSuccess?: (name: string) => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ onLoginSuccess }) => {
  const [authStep, setAuthStep] = useState<'welcome' | 'login' | 'register'>('welcome');
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [cargando, setCargando] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setError(null);
    setCargando(true);

    try {
      if (authStep === 'register') {
        // 1. Crear usuario en Firebase Auth
        const user = await registrarUsuario(email, password);
        
        // 2. Si ingresó un nombre preferido, guardamos su perfil inicial en Firestore
        const nombreFinal = nombre.trim() || email.split('@')[0];
        await guardarPerfil(user.uid, {
          nombre: nombreFinal,
          tipoPiel: 'No especificado',
          condicion: 'No especificada',
          sensibilidad: 'Media',
        });

        if (onLoginSuccess) onLoginSuccess(nombreFinal);
      } else {
        // 1. Iniciar sesión en Firebase Auth
        const userCredential = await iniciarSesion(email, password);
        const user = userCredential.user;
        
        const nombreMostrar = user.displayName || nombre || email.split('@')[0];
        if (onLoginSuccess) onLoginSuccess(nombreMostrar);
      }
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/email-already-in-use') {
        setError('El correo electrónico ya está registrado.');
      } else if (
        err.code === 'auth/wrong-password' || 
        err.code === 'auth/user-not-found' || 
        err.code === 'auth/invalid-credential'
      ) {
        setError('Correo o contraseña incorrectos.');
      } else if (err.code === 'auth/weak-password') {
        setError('La contraseña debe tener al menos 6 caracteres.');
      } else {
        setError('Ocurrió un error al autenticar. Intenta de nuevo.');
      }
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden flex flex-col justify-between p-4 sm:p-8 lg:p-12">
      {/* Fuente estilo pincel */}
      <link 
        href="https://fonts.googleapis.com/css2?family=Caveat:wght@600;700&display=swap" 
        rel="stylesheet" 
      />

      {/* 1. Fondo suave y desenfocado */}
      <div 
        className="fixed inset-0 -z-10 bg-cover bg-center scale-105 filter blur-xl opacity-25 transition-all duration-700"
        style={{ backgroundImage: `url(${fondoImg})` }}
      />
      <div className="fixed inset-0 -z-10 bg-purple-950/5 pointer-events-none" />

      {/* 2. VISTA LANDING (PORTADA RESPONSIVE) */}
      {authStep === 'welcome' && (
        <>
          <header className="max-w-6xl mx-auto w-full flex items-center justify-center lg:justify-between pb-4 sm:pb-6 relative z-10">
            <span className="text-xl font-bold text-purple-950 font-serif tracking-tight">
              Mi piel, mi identidad
            </span>
          </header>

          <main className="max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center my-auto py-4 sm:py-8 relative z-10">
            
            {/* Columna Izquierda */}
            <div className="space-y-6 text-center lg:text-left max-w-xl mx-auto lg:mx-0 w-full flex flex-col items-center lg:items-start">
              <h1 className="text-3xl sm:text-5xl lg:text-5xl xl:text-6xl font-serif font-bold text-gray-900 leading-tight">
                Cuida tu piel,<br />
                Reconoce todo<br />
                lo que eres.
              </h1>

              <p className="text-gray-700 text-sm sm:text-base lg:text-lg leading-relaxed font-medium max-w-md lg:max-w-none">
                Una herramienta para conocer tus necesidades, registrar tu experiencia y reflexionar sobre tu identidad.
              </p>

              {/* Botones */}
              <div className="pt-2 space-y-3 w-full sm:max-w-xs mx-auto lg:mx-0">
                <button
                  onClick={() => {
                    setAuthStep('register');
                    setError(null);
                  }}
                  className="w-full bg-purple-700 hover:bg-purple-800 text-white font-medium py-3.5 px-6 rounded-2xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 group text-base cursor-pointer"
                >
                  <span>Crear mi perfil</span>
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </button>

                <button
                  onClick={() => {
                    setAuthStep('login');
                    setError(null);
                  }}
                  className="w-full bg-white/80 backdrop-blur-md hover:bg-white text-purple-900 font-medium py-3.5 px-6 rounded-2xl border border-purple-200/80 shadow-sm transition-all text-base cursor-pointer"
                >
                  Iniciar Sesión
                </button>
              </div>
            </div>

            {/* Columna Derecha */}
            <div className="hidden lg:flex justify-center items-center w-full">
              <div className="relative max-w-lg w-full flex items-center justify-center p-6">
                
                <div 
                  className="absolute -top-3 right-2 z-20 text-purple-900 font-bold text-2xl drop-shadow-sm rotate-3 select-none pointer-events-none whitespace-nowrap"
                  style={{ fontFamily: "'Caveat', cursive" }}
                >
                  "Tu piel forma parte de tu historia"
                </div>

                <img
                  src={portadaImg}
                  alt="Cuida tu piel, reconoce todo lo que eres"
                  className="w-full h-auto object-contain drop-shadow-md"
                />

                <div 
                  className="absolute -bottom-4 left-2 z-20 text-purple-900 font-bold text-2xl drop-shadow-sm -rotate-3 select-none pointer-events-none whitespace-nowrap"
                  style={{ fontFamily: "'Caveat', cursive" }}
                >
                  "Recuerda lo que eres"
                </div>

              </div>
            </div>

          </main>

          <footer className="max-w-6xl mx-auto w-full text-center text-xs text-gray-500 pt-4 sm:pt-6 relative z-10">
            Mi piel, mi identidad &copy; {new Date().getFullYear()}
          </footer>
        </>
      )}

      {/* 3. FORMULARIOS DE AUTENTICACIÓN */}
      {(authStep === 'login' || authStep === 'register') && (
        <div className="my-auto flex items-center justify-center w-full relative z-10 py-6">
          <div className="bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl max-w-md w-full p-6 sm:p-8 border border-purple-100/80 space-y-6">
            <button 
              onClick={() => {
                setAuthStep('welcome');
                setError(null);
              }}
              className="text-xs text-purple-700 hover:underline flex items-center gap-1 font-medium cursor-pointer"
            >
              ← Volver al inicio
            </button>

            <div className="text-center">
              <h2 className="text-2xl font-bold text-purple-900 font-serif">
                {authStep === 'register' ? 'Crear mi perfil' : 'Iniciar Sesión'}
              </h2>
              <p className="text-xs text-purple-600 mt-1">
                Mi piel, mi identidad
              </p>
            </div>

            {/* Mensaje de error si falla Firebase */}
            {error && (
              <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs p-3 rounded-xl text-center">
                {error}
              </div>
            )}

            <div className="flex bg-purple-50/80 p-1 rounded-xl border border-purple-100">
              <button
                type="button"
                onClick={() => {
                  setAuthStep('login');
                  setError(null);
                }}
                className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
                  authStep === 'login' ? 'bg-white text-purple-900 shadow-sm' : 'text-gray-500'
                }`}
              >
                Iniciar sesión
              </button>
              <button
                type="button"
                onClick={() => {
                  setAuthStep('register');
                  setError(null);
                }}
                className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
                  authStep === 'register' ? 'bg-white text-purple-900 shadow-sm' : 'text-gray-500'
                }`}
              >
                Crear cuenta
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {authStep === 'register' && (
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Nombre preferido</label>
                  <input
                    type="text"
                    placeholder="Ej. Isa"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-400 focus:outline-none text-sm bg-white/80"
                    required
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Correo electrónico</label>
                <input
                  type="email"
                  placeholder="tu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-400 focus:outline-none text-sm bg-white/80"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Contraseña</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-400 focus:outline-none text-sm bg-white/80"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={cargando}
                className="w-full bg-purple-700 hover:bg-purple-800 disabled:opacity-50 text-white font-medium py-3.5 rounded-xl transition-colors shadow-md text-sm cursor-pointer"
              >
                {cargando 
                  ? 'Procesando...' 
                  : authStep === 'register' ? 'Crear mi cuenta' : 'Entrar a la app'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};