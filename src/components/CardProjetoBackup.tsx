import type React from "react"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { ConfirmationModal } from "./ConfirmationModal"
import { useRouter } from "next/navigation"

interface CardProjetoProps {
  imagem: string;
  titulo: string;  // Mudança: nome -> titulo
  descricao: string;
}

const CardProjeto: React.FC<CardProjetoProps> = ({ imagem, titulo, descricao }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden h-80 " style={{ width: "14rem", margin: "0 auto" }}>
      <img src={imagem} className="w-full h-[150px] object-cover" alt={titulo} />
      <div className="p-4">
        <h5 className="text-xl font-semibold mb-2 line-clamp-2">{titulo}</h5>
        <p className="text-base text-gray-700 mb-2 line-clamp-3">{descricao}</p>
      </div>
    </div>
  );
};

export default CardProjeto;