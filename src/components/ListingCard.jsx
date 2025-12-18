import React from 'react';
import { useLanguage } from '../i18n/context.js';

const ListingCard = ({ title, category, subCategory, description, imageUrl, logoUrl, delay, icon, isPrimary, onContact }) => {
  const isMasterCreators = title && title.toLowerCase().includes('master creators');
  const { t } = useLanguage();

  if (isMasterCreators) {
    return (
      <div className={`group relative bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-[0_0_30px_rgba(6,182,212,0.18)] transition-all duration-500 hover:-translate-y-2 opacity-0 animate-fade-in-up ${delay}`}>
        {/* Animated Background Effects */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(148,163,184,0.22)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.22)_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-cyan-400/20 rounded-full blur-3xl group-hover:bg-cyan-400/30 transition-all duration-700"></div>
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-blue-500/15 rounded-full blur-3xl group-hover:bg-blue-500/25 transition-all duration-700"></div>
        
        {/* Image Section */}
        <div className="h-44 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/10 to-white z-10"></div>
          <img src={imageUrl} alt={title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
          
          {/* Tech Badge */}
          <div className="absolute top-4 right-4 z-20">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-white/90 text-welfare-blue border border-welfare-blue/20 backdrop-blur-md shadow-[0_0_12px_rgba(6,182,212,0.18)]">
              {t('listing.officialPartner')}
            </span>
          </div>
        </div>

        {/* Floating Logo/Icon */}
        <div className="absolute top-32 left-6 p-1 z-20">
	          <div className="relative h-16 w-16 rounded-full bg-white flex items-center justify-center border border-cyan-500/30 shadow-[0_0_20px_rgba(6,182,212,0.2)] group-hover:shadow-[0_0_30px_rgba(6,182,212,0.4)] group-hover:border-cyan-400/50 transition-all duration-300 overflow-hidden">
	             {logoUrl ? (
	               <img src={logoUrl} alt={`${title} logo`} className="h-full w-full object-contain rounded-full p-2" />
	             ) : (
	               <div className="text-cyan-500 drop-shadow-[0_0_5px_rgba(34,211,238,0.5)]">
	                 {icon}
	               </div>
             )}
          </div>
        </div>

        {/* Content */}
        <div className="pt-10 p-6 relative z-10">
          <h3 className="text-2xl font-bold mb-3 text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600 bg-[length:200%_200%] animate-mc-title">
            {title}
          </h3>
          
          <div className="flex flex-wrap gap-2 mb-5">
            <span className="inline-flex items-center px-3 py-1 rounded-md text-xs font-medium bg-welfare-light text-welfare-blue border border-welfare-blue/10 transition-colors">
              {category}
            </span>
            {subCategory && (
               <span className="inline-flex items-center px-3 py-1 rounded-md text-xs font-medium bg-slate-50 text-slate-600 border border-slate-200">
                 {subCategory}
               </span>
            )}
          </div>
          
          <p className="text-slate-600 text-sm mb-8 leading-relaxed line-clamp-2 border-l-2 border-cyan-200 pl-3 transition-colors">
            {description}
          </p>
          
          <button 
            onClick={onContact}
            className="group/btn relative w-full py-3 rounded-xl font-bold text-sm uppercase tracking-wider overflow-hidden bg-slate-900 text-white shadow-lg transition-all duration-300 hover:shadow-cyan-500/25 border border-slate-900 hover:border-cyan-600/40"
          >
            <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-cyan-600 to-blue-600 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
            <span className="relative z-10 flex items-center justify-center gap-2 group-hover/btn:scale-105 transition-transform">
              {t('listing.contactTeam')}
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`group bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl hover:border-welfare-blue/30 transition-all duration-300 hover:-translate-y-1 relative opacity-0 animate-fade-in-up ${delay}`}>
      <div className="h-40 bg-slate-200 relative overflow-hidden">
        <img src={imageUrl} alt={title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/10 to-transparent"></div>
      </div>
      <div className="absolute top-28 left-5 p-1 bg-white rounded-full shadow-md z-10">
	        <div className="h-14 w-14 rounded-full bg-white flex items-center justify-center border border-slate-100 overflow-hidden">
	           {logoUrl ? (
	             <img src={logoUrl} alt={`${title} logo`} className="h-full w-full object-contain rounded-full p-2" />
	           ) : (
	             icon
	           )}
	        </div>
      </div>
      <div className="pt-8 p-5">
        <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-welfare-blue transition-colors">{title}</h3>
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-welfare-light text-welfare-blue">{category}</span>
          {subCategory && (
             <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600">{subCategory}</span>
          )}
        </div>
        <p className="text-slate-600 text-sm mb-6 line-clamp-2">{description}</p>
        <button 
          onClick={onContact}
          className={`w-full py-2.5 font-medium rounded-lg transition-all focus:ring-2 focus:ring-offset-2 focus:ring-welfare-blue ${isPrimary ? 'bg-welfare-blue text-white border border-transparent hover:bg-welfare-hover shadow-md hover:shadow-lg' : 'bg-white border border-slate-300 text-slate-700 hover:bg-welfare-blue hover:text-white hover:border-transparent'}`}
        >
          {t('listing.contact')}
        </button>
      </div>
    </div>
  );
};

export default ListingCard;
