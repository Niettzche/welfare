import React from 'react';

const Footer = () => {
  return (
    <footer className="fixed bottom-0 left-0 w-full bg-welfare-blue text-white py-4 px-6 md:px-8 flex flex-col md:flex-row justify-between items-center z-50 shadow-[0_-5px_15px_rgba(0,0,0,0.1)]">
      <p className="text-base md:text-lg font-medium mb-3 md:mb-0 text-center md:text-left">
        Are you a Welfare parent with a business? <span className="opacity-90">Join the directory.</span>
      </p>
      <button type="button" className="inline-flex items-center px-6 py-2.5 border border-transparent text-sm md:text-base font-semibold rounded-lg text-welfare-blue bg-white hover:bg-slate-50 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white shadow-sm whitespace-nowrap active:scale-95 transform">
        Register Now
      </button>
    </footer>
  );
};

export default Footer;
