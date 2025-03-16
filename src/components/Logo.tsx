import React from "react";

const Logo = () => {
  return (
    <a 
      href="/" 
      className="flex items-center transition-all duration-300 ease-in-out hover:opacity-80"
    >
      <span className="font-bold text-xl text-black uppercase tracking-wide">Nome do Site</span>
    </a>
  );
};

export default Logo;
