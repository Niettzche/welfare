import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import logo from '../assets/logo.png';
import { useLanguage } from '../i18n/context.js';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const location = useLocation();
  const isAcademy = location.pathname === '/parenting-academy';
  const isRegister = location.pathname === '/register';
  const { language, toggleLanguage, t } = useLanguage();

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setIsMenuOpen(false);
      }
    };
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className={`fixed w-full z-50 top-0 h-16 flex items-center justify-between px-4 md:px-8 transition-all duration-500 bg-white/80 backdrop-blur-xl border-b border-slate-100 ${
      isAcademy 
        ? 'shadow-[0_4px_30px_rgba(168,85,247,0.05)] border-purple-50' 
        : 'shadow-[0_4px_30px_rgba(0,0,0,0.03)]'
    }`}>
      <Link to="/" className="flex items-center shrink-0 cursor-pointer hover:opacity-80 transition-opacity gap-3">
        <img src={logo} alt="Welfare School Logo" className="h-10 w-auto" />
        {isAcademy ? (
          <div className="hidden md:flex items-center gap-3 animate-fade-in-up">
             <div className="h-4 w-px bg-slate-300"></div>
             <span className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600 tracking-tight">
               {t('header.parentingAcademy')}
             </span>
          </div>
        ) : isRegister ? (
          <div className="hidden md:flex items-center gap-3 animate-fade-in-up">
             <div className="h-4 w-px bg-slate-300"></div>
             <span className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-cyan-600 tracking-tight">
               {t('header.register')}
             </span>
          </div>
        ) : (
          <div className="hidden md:flex items-center gap-3 animate-fade-in-up">
             <div className="h-4 w-px bg-slate-300"></div>
             <span className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-cyan-600 tracking-tight">
               {t('header.community')}
             </span>
          </div>
        )}
      </Link>

      {/* Search bar removed for cleaner, unified header style */}
      <div className="flex-1"></div> 

      <div className="flex items-center">
        <button
          type="button"
          aria-label={t('header.changeLanguage')}
          className="hidden sm:inline-flex items-center gap-2 mr-3 px-3 py-2 rounded-full border border-slate-200 bg-white/70 text-slate-700 hover:text-welfare-blue hover:border-welfare-blue/40 transition-colors shadow-sm"
          onClick={toggleLanguage}
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5h12M9 3v2m1.048 14.5A18.022 18.022 0 0016.5 9.5M7 19h8m-4 0v-3m0 3H7m4 0h4M12 9.5a18.02 18.02 0 01-3.452 10" />
          </svg>
          <span className="text-xs font-bold tracking-wide">
            <span className={language === 'es' ? 'text-slate-900' : 'text-slate-400'}>ES</span>
            <span className="mx-1 text-slate-400">/</span>
            <span className={language === 'en' ? 'text-slate-900' : 'text-slate-400'}>EN</span>
          </span>
        </button>
        {!isAcademy && (
          <div className="hidden lg:flex items-center mr-4 text-xs text-slate-500">
            <span className="mr-1">{t('header.developedBy')}</span>
            <a href="https://mastercreators.work/" target="_blank" rel="noopener noreferrer" className="font-semibold text-slate-600 hover:text-welfare-blue underline">
              Master Creators
            </a>
            <span className="mx-2 text-slate-300">|</span>
            <a href="mailto:contacto@mastercreators.work" className="hover:text-welfare-blue underline">
              contacto@mastercreators.work
            </a>
          </div>
        )}

        <div className="relative" ref={menuRef}>
          <button
            type="button"
            onClick={() => setIsMenuOpen(v => !v)}
            aria-haspopup="menu"
            aria-expanded={isMenuOpen}
            className={`inline-flex items-center justify-center h-10 w-10 text-slate-700 transition-colors ${isAcademy ? 'hover:text-purple-600 bg-purple-50 rounded-full' : 'hover:text-welfare-blue'}`}
          >
            <span className="sr-only">Open menu</span>
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          {/* Mobile/Mega Menu Overlay */}
          <div
            className={`fixed inset-0 top-16 z-40 transition-all duration-300 ${
              isMenuOpen ? 'visible' : 'invisible delay-300'
            }`}
          >
            {/* Backdrop */}
            <div 
              className={`absolute inset-0 bg-slate-900/20 backdrop-blur-sm transition-opacity duration-300 ${
                isMenuOpen ? 'opacity-100' : 'opacity-0'
              }`}
              onClick={() => setIsMenuOpen(false)}
            />

            {/* Menu Panel */}
            <div 
              className={`relative bg-white w-full border-b border-slate-100 shadow-xl transition-all duration-300 ease-out transform origin-top ${
                isMenuOpen ? 'translate-y-0 opacity-100' : '-translate-y-8 opacity-0'
              }`}
            >
              <div className="max-h-[80vh] overflow-y-auto">
                <div className="max-w-7xl mx-auto px-6 py-8">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
                    {/* Navigation Links */}
                    <div className="space-y-4">
                      <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-4">{t('header.menu')}</h3>

                      <Link
                        to="/"
                        onClick={() => setIsMenuOpen(false)}
                        className="group flex items-center justify-between p-3 -mx-3 rounded-xl hover:bg-slate-50 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <div className="h-10 w-10 rounded-lg bg-slate-50 text-slate-700 flex items-center justify-center group-hover:bg-slate-900 group-hover:text-white transition-colors shadow-sm">
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                            </svg>
                          </div>
                          <div>
                            <div className="text-base font-semibold text-slate-900 group-hover:text-slate-900 transition-colors">{t('header.directory')}</div>
                            <div className="text-xs text-slate-500 mt-0.5">{t('header.directoryDesc')}</div>
                          </div>
                        </div>
                        <svg className="h-4 w-4 text-slate-300 group-hover:text-slate-900 group-hover:translate-x-1 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>

                      <Link
                        to="/register"
                        onClick={() => setIsMenuOpen(false)}
                        className="group flex items-center justify-between p-3 -mx-3 rounded-xl hover:bg-slate-50 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <div className="h-10 w-10 rounded-lg bg-blue-50 text-welfare-blue flex items-center justify-center group-hover:bg-welfare-blue group-hover:text-white transition-colors shadow-sm">
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                            </svg>
                          </div>
                          <div>
                            <div className="text-base font-semibold text-slate-900 group-hover:text-welfare-blue transition-colors">{t('header.register')}</div>
                            <div className="text-xs text-slate-500 mt-0.5">{t('header.registerDesc')}</div>
                          </div>
                        </div>
                        <svg className="h-4 w-4 text-slate-300 group-hover:text-welfare-blue group-hover:translate-x-1 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                        </svg>
	                      </Link>

	                      <Link
	                        to="/ayuda"
	                        onClick={() => setIsMenuOpen(false)}
	                        className="group flex items-center justify-between p-3 -mx-3 rounded-xl hover:bg-slate-50 transition-colors"
	                      >
	                        <div className="flex items-center gap-4">
	                          <div className="h-10 w-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center group-hover:bg-amber-500 group-hover:text-white transition-colors shadow-sm">
	                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 12.284 3 6V5z" />
	                            </svg>
	                          </div>
	                          <div>
	                            <div className="text-base font-semibold text-slate-900 group-hover:text-amber-700 transition-colors">Actualizar o eliminar mi registro</div>
	                            <div className="text-xs text-slate-500 mt-0.5">Escríbenos para editar datos o dar de baja tu negocio.</div>
	                          </div>
	                        </div>
	                        <svg className="h-4 w-4 text-slate-300 group-hover:text-amber-700 group-hover:translate-x-1 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor">
	                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
	                        </svg>
	                      </Link>

                      <Link
                        to="/parenting-academy"
                        onClick={() => setIsMenuOpen(false)}
                        className="group flex items-center justify-between p-3 -mx-3 rounded-xl hover:bg-slate-50 transition-colors opacity-80 hover:opacity-100"
                      >
                        <div className="flex items-center gap-4">
                          <div className="h-10 w-10 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center group-hover:bg-purple-600 group-hover:text-white transition-colors shadow-sm">
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <div className="text-base font-semibold text-slate-900 group-hover:text-purple-600 transition-colors">{t('header.parentingAcademy')}</div>
                            </div>
                            <div className="text-xs text-slate-500 mt-0.5">{t('header.academyDesc')}</div>
                          </div>
                        </div>
                      </Link>
                    </div>

                    {/* Contact Info Side */}
                    <div className="lg:border-l lg:border-slate-100 lg:pl-12 space-y-6 hidden md:block">
                      <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-4">{t('header.contactSupport')}</h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-4">
                        <a href="mailto:contacto@mastercreators.work" className="flex items-center gap-3 group">
                          <div className="h-8 w-8 shrink-0 rounded-md bg-slate-50 text-slate-400 flex items-center justify-center group-hover:bg-blue-50 group-hover:text-welfare-blue transition-colors">
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                          </div>
                          <div>
                            <div className="text-xs font-bold text-slate-900">{t('header.emailUs')}</div>
                            <div className="text-xs text-slate-500 group-hover:text-welfare-blue transition-colors">contacto@mastercreators.work</div>
                          </div>
                        </a>

                        <a href="https://mastercreators.work/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 group">
                          <div className="h-8 w-8 shrink-0 rounded-md bg-slate-50 text-slate-400 flex items-center justify-center group-hover:bg-blue-50 group-hover:text-welfare-blue transition-colors">
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                            </svg>
                          </div>
                          <div>
                            <div className="text-xs font-bold text-slate-900">{t('header.developer')}</div>
                            <div className="text-xs text-slate-500 group-hover:text-welfare-blue transition-colors">Master Creators</div>
                          </div>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </header>
  );
};

export default Header;
