// components/CardHorizontal.tsx
import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface CardHorizontalProps {
  id: string | number;
  type: string; // tipo de destino
  imageSrc: string;
  title: string;
  description: string;
}

export function HorizontalCard({ id, type, imageSrc, title, description }: CardHorizontalProps) {
  // Define a rota de acordo com o tipo
  const href =
    type === "curso"
      ? `/curso/detalhes/${id}`
      : `/${type}/${id}`; // projeto e usuario seguem esse padrão

  return (
    <Link href={href} className="block">
      <Card className="flex w-full bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden p-0 cursor-pointer">
        <div className="flex w-full">
          <div className="flex-shrink-0 w-40 h-40 relative">
            {imageSrc ? (
              <Image src={imageSrc} alt={title} layout="fill" objectFit="cover" />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500">
                Sem imagem
              </div>
            )}
          </div>
          <div className="flex-1 p-4">
            <CardHeader className="p-0">
              <CardTitle className="text-lg font-semibold text-gray-800">{title}</CardTitle>
              <CardDescription className="text-gray-600 mt-1">{description}</CardDescription>
            </CardHeader>
          </div>
        </div>
      </Card>
    </Link>
  );
}
