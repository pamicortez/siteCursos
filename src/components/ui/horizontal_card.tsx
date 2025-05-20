// components/CardHorizontal.tsx
import * as React from "react";
import Image from "next/image";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

// Definição das propriedades do componente
interface CardHorizontalProps {
  imageSrc: string;
  title: string;
  description: string;
}

export function HorizontalCard({ imageSrc, title, description }: CardHorizontalProps) {
  return (
    <Card className="flex w-full bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden p-0">
      {/* Div que agrupa a imagem e o conteúdo para alinhamento horizontal */}
      <div className="flex w-full">
        {/* Div com a imagem à esquerda */}
        <div className="flex-shrink-0 w-40 h-40 relative">
          <Image src={imageSrc} alt={title} layout="fill" objectFit="cover" />
        </div>

        {/* Div com o conteúdo (título e descrição) à direita da imagem */}
        <div className="flex-1 p-4">
          <CardHeader className="p-0">
            <CardTitle className="text-lg font-semibold text-gray-800">{title}</CardTitle>
            <CardDescription className="text-gray-600 mt-1">{description}</CardDescription>
          </CardHeader>
        </div>
      </div>
    </Card>
  );
}
