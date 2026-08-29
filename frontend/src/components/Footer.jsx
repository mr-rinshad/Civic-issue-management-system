import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-black/90 border-t border-zinc-900 py-6 mt-auto">
      <div className="max-w-7xl mx-auto px-4 text-center text-xs text-zinc-500">
        <p className="font-bold text-zinc-400 mb-1">
          FixMyCity © {new Date().getFullYear()}
        </p>
        <p className="text-[11px] text-zinc-600">
          Smart Municipal Infrastructure Platform • Empowering citizens, councillor admins, and field departments.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
