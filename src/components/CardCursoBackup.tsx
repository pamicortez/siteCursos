import React from "react";
import { cn } from "@/lib/utils";

interface CardCursoProps {
  imagem: string;
  titulo: string;  // Mudança: nome -> titulo
  descricao: string;
  cargaHoraria: number;  // Mudança: cargahoraria -> cargaHoraria (number)
}

const CardCurso: React.FC<CardCursoProps> = ({ imagem, titulo, descricao, cargaHoraria }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden" style={{ width: "17rem", margin: "0 auto" }}>
      <img src={imagem} className="w-full h-[150px] object-cover" alt={titulo} />
      <div className="p-4">
        <h5 className="text-xl font-semibold mb-2 line-clamp-2">{titulo}</h5>
        <p className="text-base text-gray-700 mb-2 line-clamp-3">{descricao}</p>
        <p className="text-sm text-gray-500 mb-3 line-clamp-1">{cargaHoraria}h</p>
      </div>
    </div>
  );
};

export default CardCurso;