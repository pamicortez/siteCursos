import React from "react";
import { cn } from "@/lib/utils";

interface CardCursoWithButtonProps {
  imagem: string;
  nome: string;
  descricao: string;
  cargahoraria: string;
  isOwner: boolean;
}

const CardCursoWithButton: React.FC<CardCursoWithButtonProps> = ({ 
  imagem, 
  nome, 
  descricao, 
  cargahoraria, 
  isOwner 
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden" style={{ width: "17rem", margin: "0 auto" }}>
      <img src={imagem} className="w-full h-[150px] object-cover" alt={nome} />
      <div className="p-4">
        <h5 className="text-xl font-semibold mb-2">{nome}</h5>
        <p className="text-base text-gray-700 mb-2">{descricao}</p>
        <p className="text-sm text-gray-500 mb-3">{cargahoraria}</p>
        
        {isOwner && (
          <div className="flex justify-between">
            <button className="p-0 border-none bg-transparent cursor-pointer">
              <img src="/pen.png" alt="Editar" className="w-6 h-6" />
            </button>
            <button className="p-0 border-none bg-transparent cursor-pointer">
              <img src="/trash.png" alt="Excluir" className="w-6 h-6" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CardCursoWithButton;
