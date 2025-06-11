import React from "react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation"

interface CardProfessorProps {
  idProfessor: number
  imagem: string;
  nome: string;
  descricao: string;
}

const CardProfessor: React.FC<CardProfessorProps> = ({ idProfessor, imagem, nome, descricao }) => {
  const router = useRouter()
  const handleCardClick = () => {
    router.push(`/usuario/${idProfessor}`)
  }
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-lg h-75"
     style={{ width: "17rem", margin: "0 auto" }}
     onClick={handleCardClick}
     >
      <img src={imagem} className="w-full h-[150px] object-cover line-clamp-1" alt={nome} />
      <div className="p-4">
        <h5 className="text-xl font-semibold mb-2">{nome}</h5>
        <p className="text-base text-gray-700 mb-2 line-clamp-3">{descricao}</p>

        

      </div>
    </div>
  );
};

export default CardProfessor;
