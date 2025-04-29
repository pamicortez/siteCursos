import React from "react";
import { cn } from "@/lib/utils";

interface CardEventoProps {
  nome: string;
  descricao: string;
  data: string;
}

const CardEvento: React.FC<CardEventoProps> = ({ nome, descricao, data }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden" style={{ width: "17rem", margin: "0 auto" }}>
      <div className="p-4">
        <div className="flex items-start gap-3">
          <div className="bg-blue-100 text-blue-800 rounded-lg p-2 min-w-[60px] text-center">
            <div className="font-bold">{data.split('/')[0]}</div>
            <div className="text-xs">{data.split('/')[1]}/{data.split('/')[2]}</div>
          </div>
          <div>
            <h5 className="text-xl font-semibold mb-2">{nome}</h5>
            <p className="text-base text-gray-700">{descricao}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardEvento;