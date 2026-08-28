import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-slate-200 py-6 mt-auto">
      <div className="max-w-7xl mx-auto px-4 text-center text-xs text-slate-500">
        <p className="font-medium text-slate-700 mb-1">
          Smart Civic Issue Reporting System © {new Date().getFullYear()}
        </p>
        <p>
          Empowering citizens, local councillors, and municipal departments for transparent civic issue resolution.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
