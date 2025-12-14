import React, { useEffect, useState } from 'react';

const Preloader = ({ onFinish, title = "Welfare", subtitle = "Excellence in Community" }) => {
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    // Start exit animation
    const timer = setTimeout(() => {
      setExiting(true);
    }, 2800);

    // Unmount
    const cleanup = setTimeout(() => {
      onFinish();
    }, 3600); 

    return () => {
      clearTimeout(timer);
      clearTimeout(cleanup);
    };
  }, [onFinish]);

  return (
    <div className={`preloader-container fixed inset-0 z-[100] flex items-center justify-center bg-welfare-blue overflow-hidden transition-all duration-1000 ease-in-out ${exiting ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100 scale-100'}`}>
      
      {/* Background Geometric Elements (Golden Ratio / Elegant Lines) */}
      <div className="preloader-bg-elements absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
         {/* Large slowly rotating circle */}
         <div className="preloader-circle-large absolute w-[800px] h-[800px] border border-white rounded-full animate-spin-slower border-dashed"></div>
         {/* Smaller counter-rotating circle */}
         <div className="preloader-circle-small absolute w-[500px] h-[500px] border border-white rounded-full animate-spin-slow-reverse"></div>
         {/* Decorative crosshair lines */}
         <div className="preloader-line-horizontal absolute w-full h-[1px] bg-gradient-to-r from-transparent via-white to-transparent opacity-20"></div>
         <div className="preloader-line-vertical absolute h-full w-[1px] bg-gradient-to-b from-transparent via-white to-transparent opacity-20"></div>
      </div>

      {/* Main Content */}
      <div className="preloader-content relative z-10 flex flex-col items-center justify-center">
        
        {/* Logo Container - Elegant Float */}
        <div className="preloader-logo-container animate-elegant-float relative mb-8">
           {/* Glow Effect behind logo */}
           <div className="preloader-logo-glow absolute inset-0 bg-white/20 blur-3xl rounded-full scale-150 animate-pulse"></div>
           
           <img 
            src="/src/assets/logo.png" 
            alt="Welfare School" 
            className="preloader-logo-img relative w-36 h-auto md:w-48 object-contain drop-shadow-2xl brightness-0 invert" 
          />
        </div>

        {/* Text Reveal */}
        <div className="preloader-title-wrapper overflow-hidden text-center px-4">
            <h1 className="preloader-title text-3xl md:text-5xl font-serif text-white tracking-[0.2em] uppercase animate-reveal-up opacity-0 [animation-fill-mode:forwards] [animation-delay:0.3s]">
                {title}
            </h1>
        </div>
        
        <div className="preloader-divider-wrapper overflow-hidden mt-3">
             <div className="preloader-divider h-[1px] w-24 bg-white/50 mx-auto animate-reveal-up opacity-0 [animation-fill-mode:forwards] [animation-delay:0.6s]"></div>
        </div>

        <div className="preloader-subtitle-wrapper overflow-hidden mt-3 text-center px-4">
            <p className="preloader-subtitle text-white/70 font-light text-xs md:text-sm tracking-[0.3em] uppercase animate-reveal-up opacity-0 [animation-fill-mode:forwards] [animation-delay:0.8s]">
                {subtitle}
            </p>
        </div>

      </div>
    </div>
  );
};

export default Preloader;
