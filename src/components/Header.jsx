import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="bg-white border-b border-slate-200 fixed w-full z-50 top-0 h-16 flex items-center justify-between px-4 md:px-8 shadow-sm">
      <Link to="/" className="flex items-center shrink-0 cursor-pointer hover:opacity-80 transition-opacity gap-3">
        <img src="/src/assets/logo.png" alt="Welfare School Logo" className="h-10 w-auto" />
        <span className="text-2xl font-bold text-welfare-blue tracking-tight hidden sm:block">Welfare</span>
      </Link>

      <div className="hidden md:flex flex-1 max-w-xl mx-8 relative group">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg className="h-5 w-5 text-slate-400 group-focus-within:text-welfare-blue transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input type="text" className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg leading-5 bg-slate-50 placeholder-slate-500 focus:outline-none focus:bg-white focus:ring-2 focus:ring-welfare-blue focus:border-welfare-blue transition-all sm:text-sm" placeholder="Search for services, products..." />
      </div>

      <div className="flex items-center">
        <Link to="/register" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-welfare-blue hover:bg-welfare-hover hover:shadow-md transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-welfare-blue">
          Add Listing
        </Link>
      </div>
    </header>
  );
};

export default Header;
