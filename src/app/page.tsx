"use client"

import { useState } from "react";
import Link from "next/link";
import { HorizontalCard } from "@/components/ui/horizontal_card";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";

export default function Home() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  
  const categorias = [
    "Tecnologia e Programação",
    "Negócios e Empreendedorismo",
    "Design e Multimídia",
    "Ciências e Educação",
    "Saúde e Bem-Estar",
    "Engenharia e Arquitetura",
    "Estilo de Vida e Desenvolvimento Pessoal",
  ];

  // Lista de Cards (exemplo com mais de 10 itens para demonstrar a paginação)
  const cards = Array.from({ length: 30 }, (_, i) => ({
    imageSrc: "https://i.imgur.com/LYxU5hw.png",
    title: `Curso ${i + 1}`,
    description: "Descrição do curso exemplo",
  }));

  const totalPages = Math.ceil(cards.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentCards = cards.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-8 space-y-6">
      {/* Barra de Filtros */}
      <div className="w-full max-w-4xl bg-white p-6 shadow-lg rounded-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Select>
              <SelectTrigger className="w-[180px] flex justify-between items-center">
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="cursos">Cursos</SelectItem>
                  <SelectItem value="projetos">Projetos</SelectItem>
                  <SelectItem value="professores">Professores</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="w-[180px] flex justify-between items-center">
                <SelectValue placeholder="Categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {categorias.map((categoria, index) => (
                    <SelectItem key={index} value={categoria.toLowerCase()}>
                      {categoria}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            <div className="relative">
              <Input id="input-text" placeholder="Pesquisar" className="w-56 pr-10" />
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
            </div>
          </div>
          <Select>
            <SelectTrigger className="w-[180px] flex justify-between items-center">
              <SelectValue placeholder="Filtro" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="recentes">Mais recentes</SelectItem>
                <SelectItem value="alfabetica">Ordem alfabética</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Lista de Cards */}
      <div className="w-full max-w-4xl space-y-4">
        {currentCards.map((card, index) => (
          <HorizontalCard key={index} imageSrc={card.imageSrc} title={card.title} description={card.description} />
        ))}
      </div>

      {/* Paginação */}
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious href="#" onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} />
          </PaginationItem>
          {Array.from({ length: totalPages }, (_, i) => (
            <PaginationItem key={i}>
              <PaginationLink href="#" isActive={currentPage === i + 1} onClick={() => setCurrentPage(i + 1)}>
                {i + 1}
              </PaginationLink>
            </PaginationItem>
          ))}
          <PaginationItem>
            <PaginationNext href="#" onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))} />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
