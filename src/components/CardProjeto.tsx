import React from "react";
import { cn } from "@/lib/utils";

interface CardProjetoProps {
  imagem: string;
  nome: string;
  descricao: string;
}

const CardProjeto: React.FC<CardProjetoProps> = ({ imagem, nome, descricao }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden" style={{ width: "17rem", margin: "0 auto" }}>
      <img src={imagem} className="w-full h-[150px] object-cover" alt={nome} />
      <div className="p-4">
        <h5 className="text-xl font-semibold mb-2">{nome}</h5>
        <p className="text-base text-gray-700 mb-2">{descricao}</p>


      </div>
    </div>
  );
};

export default CardProjeto;
