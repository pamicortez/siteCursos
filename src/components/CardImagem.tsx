import React from "react";

interface CardImagemProps {
  src: string;
  alt: string;
}

const CardImagem: React.FC<CardImagemProps> = ({ src, alt }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"
     >
      <img src={src} className="w-72 h-42 object-cover" alt={alt} />
    </div>
  );
};

export default CardImagem;