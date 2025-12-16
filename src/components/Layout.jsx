import React from 'react';
import Header from './Header';

const Layout = ({ children }) => {
  return (
    <div className="bg-slate-50 font-sans min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 pt-16 flex relative z-10">
        {children}
      </main>
    </div>
  );
};

export default Layout;
