import React from 'react';

const SimpleFooter: React.FC = () => {
  return (
    <footer className="bg-[#F2EFE9] border-t border-[#E6E0DA] py-8">
      <div className="max-w-[1280px] mx-auto px-8 text-center">
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-3">
          <img src="/RCA-Logo.png" alt="RCA.Estate" width="24" height="24" className="h-6 w-auto" />
          <span className="font-manrope font-extralight text-sm text-[#1E293B] uppercase tracking-widest">
            RCA.Estate
          </span>
        </div>

        {/* Copyright */}
        <p className="font-manrope font-extralight text-xs text-[#94A3B8]">
          © 2023 RCA.Estate. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default SimpleFooter;