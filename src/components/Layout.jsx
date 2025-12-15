import React from 'react';
import Header from './Header';

const Layout = ({ children }) => {
  return (
    <div className="bg-slate-50 font-sans h-screen overflow-hidden flex flex-col">
      <Header />
      <main className="flex-1 pt-16 h-full flex relative z-10 overflow-hidden">
        {children}
      </main>
    </div>
  );
};

export default Layout;
