// src/App.tsx
import React, { useState, useEffect } from 'react';
import type { User } from 'firebase/auth';
import fondoImg from './assets/fondo.jpg';
import { Navbar } from './components/Navbar';
import { LoginModal } from './pages/LoginModal';
import { InicioPage } from './pages/InicioPage';
import { PerfilPage } from './pages/PerfilPage';
import { RutinaPage } from './pages/RutinaPage';
import { RegistroPage } from './pages/RegistroPage';
import { EvolucionPage } from './pages/EvolucionPage';
import { IdentidadPage } from './pages/IdentidadPage';
import { AprendePage } from './pages/AprendePage';
import { AjustesPage } from './pages/AjustesPage';

// Importamos los servicios de Firebase y Base de datos
import { suscribirEstadoAuth, cerrarSesion } from './services/authService';
import { obtenerPerfil } from './services/dbService';

export function App() {
  const [user, setUser] = useState<User | null>(null);
  const [userName, setUserName] = useState('');
  const [cargandoAuth, setCargandoAuth] = useState(true);
  const [activeTab, setActiveTab] = useState('inicio');

  // Escuchar el estado de autenticación de Firebase
  useEffect(() => {
    const unsub = suscribirEstadoAuth(async (usuarioActual) => {
      setUser(usuarioActual);

      if (usuarioActual) {
        // Intentar obtener el nombre guardado en su perfil de Firestore
        const perfil = await obtenerPerfil(usuarioActual.uid);
        if (perfil?.nombre) {
          setUserName(perfil.nombre);
        } else if (usuarioActual.email) {
          setUserName(usuarioActual.email.split('@')[0]);
        }
      } else {
        setUserName('');
      }

      setCargandoAuth(false);
    });

    return () => unsub();
  }, []);

  const handleLogout = async () => {
    await cerrarSesion();
    setActiveTab('inicio');
  };

  // Pantalla de carga mientras Firebase verifica si hay sesión iniciada
  if (cargandoAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-purple-50">
        <p className="text-sm font-semibold text-purple-900 animate-pulse font-serif">
          Cargando tu espacio personal... 🌿
        </p>
      </div>
    );
  }

  // Si no hay sesión iniciada en Firebase, mostramos tu LoginModal
  if (!user) {
    return <LoginModal />;
  }

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden flex flex-col justify-between">
      
      {/* Keyframes de animación para la flotación de burbujas */}
      <style>{`
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-25px) scale(1.08); }
        }
        @keyframes float-reverse {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(25px) scale(0.92); }
        }
        .animate-float-1 { animation: float-slow 11s ease-in-out infinite; }
        .animate-float-2 { animation: float-reverse 13s ease-in-out infinite; }
        .animate-float-3 { animation: float-slow 15s ease-in-out infinite; }
      `}</style>

      {/* 1. Imagen de fondo tenue */}
      <div 
        className="fixed inset-0 -z-10 bg-cover bg-center scale-105 filter blur-xs opacity-15 transition-all duration-700 pointer-events-none"
        style={{ backgroundImage: `url(${fondoImg})` }}
      />
      
      {/* 2. Capa de tinte púrpura suave */}
      <div className="fixed inset-0 -z-10 bg-purple-950/5 pointer-events-none" />

      {/* 3. BURBUJAS DE COLORES SUAVES */}
      <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden select-none">
        {/* Verde Aloe - Arriba Izquierda */}
        <div className="absolute -left-20 -top-10 w-96 h-96 bg-emerald-300/30 rounded-full filter blur-3xl animate-float-1" />
        
        {/* Púrpura / Lavanda - Arriba Derecha */}
        <div className="absolute -right-20 top-10 w-[28rem] h-[28rem] bg-purple-300/35 rounded-full filter blur-3xl animate-float-2" />
        
        {/* Rosado Cálido - Centro Izquierda */}
        <div className="absolute -left-20 top-[42%] w-80 h-80 bg-rose-200/35 rounded-full filter blur-3xl animate-float-3" />
        
        {/* Menta Aqua - Centro Derecha */}
        <div className="absolute -right-20 top-[58%] w-96 h-96 bg-teal-200/30 rounded-full filter blur-3xl animate-float-1" />
        
        {/* Lavanda Pastel - Abajo Centro */}
        <div className="absolute left-1/3 -bottom-10 w-[30rem] h-[30rem] bg-purple-200/30 rounded-full filter blur-3xl animate-float-2" />
      </div>

      {/* 4. CONTENIDO PRINCIPAL DE LA APP */}
      <div className="relative z-10 flex flex-col min-h-screen justify-between w-full">
        <Navbar 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          userName={userName}
          onLogout={handleLogout}
        />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
          {activeTab === 'inicio' && <InicioPage userName={userName} setActiveTab={setActiveTab} />}
          {activeTab === 'perfil' && <PerfilPage userId={user.uid} setUserName={setUserName} />}
          {activeTab === 'rutina' && <RutinaPage userId={user.uid} />}
          {activeTab === 'registro' && <RegistroPage userId={user.uid} />}
          {activeTab === 'evolucion' && <EvolucionPage userId={user.uid} />}
          {activeTab === 'identidad' && <IdentidadPage userId={user.uid} />}
          {activeTab === 'aprende' && <AprendePage />}
          {activeTab === 'ajustes' && <AjustesPage userId={user.uid} onLogout={handleLogout} />}
        </main>

        <footer className="w-full text-center py-4 text-xs text-emerald-900/60 font-medium">
          Mi piel, mi identidad &copy; {new Date().getFullYear()} — Cuida tu piel con amor y paciencia 🌿
        </footer>
      </div>

    </div>
  );
}

export default App;