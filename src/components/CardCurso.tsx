import React from "react";
import { cn } from "@/lib/utils";

interface CardCursoProps {
  imagem: string;
  nome: string;
  descricao: string;
  cargahoraria: string;
}

const CardCurso: React.FC<CardCursoProps> = ({ imagem, nome, descricao, cargahoraria }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden" style={{ width: "17rem", margin: "0 auto" }}>
      <img src={imagem} className="w-full h-[150px] object-cover" alt={nome} />
      <div className="p-4">
        <h5 className="text-xl font-semibold mb-2">{nome}</h5>
        <p className="text-base text-gray-700 mb-2">{descricao}</p>
        <p className="text-sm text-gray-500 mb-3">{cargahoraria}</p>
        

      </div>
    </div>
  );
};

export default CardCurso;
