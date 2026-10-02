import React, { useState } from 'react';
import logoImg from '../assets/logo.png';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  userName: string;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, userName, onLogout }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const menuItems = [
    { id: 'inicio', label: 'Inicio', icon: '🏠' },
    { id: 'perfil', label: 'Mi Perfil', icon: '👤' },
    { id: 'rutina', label: 'Mi Rutina', icon: '📅' },
    { id: 'registro', label: 'Mi Registro', icon: '📋' },
    { id: 'evolucion', label: 'Mi Evolución', icon: '📈' },
    { id: 'identidad', label: 'Mi Identidad', icon: '💜' },
    { id: 'aprende', label: 'Aprende', icon: '📖' },
    { id: 'ajustes', label: 'Ajustes', icon: '⚙️' },
  ];

  const handleTabClick = (id: string) => {
    setActiveTab(id);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-emerald-950/90 backdrop-blur-md border-b border-emerald-800/50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* LOGO Y TÍTULO */}
          <div 
            className="flex items-center space-x-3 cursor-pointer group" 
            onClick={() => handleTabClick('inicio')}
          >
            {/* Contenedor iluminado para destacar la hoja de aloe vera */}
            <div className="w-10 h-10 rounded-2xl bg-emerald-900/60 border border-emerald-500/30 flex items-center justify-center p-1.5 shadow-inner group-hover:scale-105 transition-transform">
              <img 
                src={logoImg} 
                alt="Logo Aloe Vera" 
                className="w-full h-auto object-contain drop-shadow-sm"
              />
            </div>
            <span className="text-lg sm:text-xl font-bold text-emerald-50 font-serif tracking-tight group-hover:text-emerald-200 transition-colors">
              Mi piel, mi identidad
            </span>
          </div>

          {/* NAVEGACIÓN EN ESCRITORIO */}
          <nav className="hidden lg:flex items-center space-x-1">
            {menuItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleTabClick(item.id)}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-emerald-800/80 text-emerald-100 shadow-sm border border-emerald-600/50'
                      : 'text-emerald-200/80 hover:bg-emerald-900/50 hover:text-white'
                  }`}
                >
                  <span className="text-sm">{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* ÁREA DE USUARIO & SALIR (ESCRITORIO) */}
          <div className="hidden sm:flex items-center space-x-3">
            <div className="flex items-center space-x-2 bg-emerald-900/40 border border-emerald-800/60 px-3 py-1 rounded-full">
              <div className="w-7 h-7 rounded-full bg-purple-700 text-purple-100 flex items-center justify-center font-bold text-xs shadow-sm">
                {userName.charAt(0).toUpperCase()}
              </div>
              <span className="text-xs font-medium text-emerald-100">{userName}</span>
            </div>

            <button
              onClick={onLogout}
              title="Cerrar sesión"
              className="px-3 py-1.5 text-xs font-medium text-emerald-300 hover:text-red-300 hover:bg-red-900/30 rounded-xl transition-colors cursor-pointer border border-transparent hover:border-red-800/40"
            >
              Salir 🚪
            </button>
          </div>

          {/* BOTÓN MENÚ MÓVIL */}
          <div className="lg:hidden flex items-center space-x-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-emerald-200 hover:text-white rounded-xl bg-emerald-900/50 border border-emerald-700/50 cursor-pointer"
            >
              {mobileMenuOpen ? '✕' : '☰'}
            </button>
          </div>

        </div>
      </div>

      {/* MENÚ DESPLEGABLE EN MÓVIL */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-emerald-950 border-b border-emerald-800 px-4 pt-2 pb-4 space-y-1">
          <div className="flex items-center space-x-2 px-3 py-2 border-b border-emerald-900 mb-2">
            <div className="w-7 h-7 rounded-full bg-purple-700 text-purple-100 flex items-center justify-center font-bold text-xs">
              {userName.charAt(0).toUpperCase()}
            </div>
            <span className="text-sm font-medium text-emerald-100">{userName}</span>
          </div>

          <div className="grid grid-cols-2 gap-1">
            {menuItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleTabClick(item.id)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-emerald-800 text-emerald-100 font-bold'
                      : 'text-emerald-200 hover:bg-emerald-900/60'
                  }`}
                >
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          <button
            onClick={onLogout}
            className="w-full mt-3 flex items-center justify-center space-x-1 py-2 text-xs font-medium text-red-300 bg-red-950/40 border border-red-800/40 rounded-xl"
          >
            <span>Cerrar sesión 🚪</span>
          </button>
        </div>
      )}
    </header>
  );
};