import React, { useEffect } from 'react';

const SidebarContent = ({ categories, selectedCategories, onCategoryChange, onOpenAi, onSearch, searchQuery }) => {
  return (
    <>
      {/* Search Bar */}
      <div className="mb-6 pb-6 border-b border-slate-100">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input 
            type="text" 
            className="block w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl leading-5 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-welfare-blue/20 focus:border-welfare-blue transition-all sm:text-sm" 
            placeholder="Search businesses..." 
            value={searchQuery}
            onChange={(e) => onSearch && onSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-slate-900">Filters</h2>
        <button 
            onClick={() => selectedCategories.length > 0 && onCategoryChange('RESET')}
            className={`text-xs font-medium hover:underline ${selectedCategories.length > 0 ? 'text-welfare-blue' : 'text-slate-400 cursor-default'}`}
        >
            Reset
        </button>
      </div>

      <div className="space-y-1">
        <details className="group py-3 border-b border-slate-100" open>
          <summary className="flex justify-between items-center font-medium cursor-pointer list-none text-slate-900 mb-4">
            <span>Categories</span>
            <span className="transition group-open:rotate-180 text-slate-400">
              <svg fill="none" height="20" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="20"><path d="M6 9l6 6 6-6"></path></svg>
            </span>
          </summary>
          <div className="space-y-3 text-sm pl-1 pb-2 text-slate-600">
            {categories.map((category) => (
                <label key={category} className="flex items-center space-x-3 cursor-pointer group/item select-none">
                    <input 
                        type="checkbox" 
                        className="form-checkbox h-5 w-5 text-welfare-blue rounded border-slate-300 focus:ring-welfare-blue accent-welfare-blue transition-colors" 
                        checked={selectedCategories.includes(category)}
                        onChange={() => onCategoryChange(category)}
                    />
                    <span className={`flex-1 group-hover/item:text-welfare-blue transition-colors ${selectedCategories.includes(category) ? 'text-welfare-blue font-medium' : 'text-slate-900'}`}>
                        {category.replace('&', '')}
                    </span>
                </label>
            ))}
          </div>
        </details>
      </div>
    
      <div className="mb-6">
        <button 
          onClick={onOpenAi}
          className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-3 rounded-xl shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 hover:-translate-y-0.5 transition-all group flex items-center justify-center relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out skew-x-12"></div>
          <svg className="h-5 w-5 mr-2 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
          </svg>
          <span className="font-bold tracking-wide">Ask AI Assistant</span>
        </button>
      </div>
    </>
  );
};

const Sidebar = ({ isOpen, onClose, onOpenAi, selectedCategories, onCategoryChange, onSearch, searchQuery }) => {
  // Prevent body scroll when mobile sidebar is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const categories = [
    "Technology  IT",
    "Health  Wellness", 
    "Education  Tutoring", 
    "Food  Beverage", 
    "Professional Services", 
    "Creative  Arts",
    "Retail  Shopping",
    "Manufacturing  Industry",
    "Construction  Trades",
    "Automotive",
    "Real Estate",
    "Finance  Insurance",
    "Legal Services",
    "Personal Care  Beauty",
    "Entertainment  Events",
    "Travel  Tourism",
    "Agriculture  Farming",
    "Non-Profit",
    "Other"
  ];

  return (
    <>
      {/* Desktop Sidebar - Static */}
      <aside className="w-72 bg-white border-r border-slate-200 h-[calc(100vh-4rem)] sticky top-16 overflow-y-auto no-scrollbar hidden md:block p-6">
        <SidebarContent 
            categories={categories}
            selectedCategories={selectedCategories}
            onCategoryChange={onCategoryChange}
            onOpenAi={onOpenAi}
            onSearch={onSearch}
            searchQuery={searchQuery}
        />
      </aside>

      {/* Mobile Sidebar - Overlay/Drawer */}
      {/* Overlay Background */}
      <div 
        className={`fixed inset-0 bg-black/50 z-[60] transition-opacity duration-300 md:hidden ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} 
        onClick={onClose}
      />

      {/* Drawer Panel */}
      <aside 
        className={`fixed inset-y-0 left-0 w-80 bg-white z-[70] shadow-xl transform transition-transform duration-300 ease-in-out md:hidden overflow-y-auto ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="p-6">
          <div className="flex justify-end mb-4">
            <button onClick={onClose} className="p-2 -mr-2 text-slate-400 hover:text-slate-600">
               <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
               </svg>
            </button>
          </div>
          <SidebarContent 
            categories={categories}
            selectedCategories={selectedCategories}
            onCategoryChange={onCategoryChange}
            onOpenAi={onOpenAi}
            onSearch={onSearch}
            searchQuery={searchQuery}
          />
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
