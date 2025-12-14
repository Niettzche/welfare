import React from 'react';

const ListingCard = ({ title, category, subCategory, description, imageUrl, delay, icon, isPrimary, onContact }) => {
  return (
    <div className={`group bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl hover:border-welfare-blue/30 transition-all duration-300 hover:-translate-y-1 relative opacity-0 animate-fade-in-up ${delay}`}>
      <div className="h-48 bg-slate-200 relative overflow-hidden">
        <img src={imageUrl} alt={title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/10 to-transparent"></div>
      </div>
      <div className="absolute top-36 left-6 p-1 bg-white rounded-full shadow-md z-10">
        <div className="h-16 w-16 rounded-full bg-white flex items-center justify-center border border-slate-100">
           {icon}
        </div>
      </div>
      <div className="pt-10 p-6">
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
          Contact
        </button>
      </div>
    </div>
  );
};

export default ListingCard;