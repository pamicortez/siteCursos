"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { HorizontalCard } from "@/components/ui/horizontal_card";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Footer2 } from "@/components/ui/footer";

export default function SearchPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState("curso");
  const [categoria, setCategoria] = useState("");
  const [searchTerm, setSearchTerm] = useState(""); // Estado para a pesquisa
  const [ordem, setOrdem] = useState("alfabetica"); // Estado para a ordenação
  const [items, setItems] = useState([]);
  const itemsPerPage = 6;

  const categorias = ["Tecnologia", "Ciências"];

  useEffect(() => {
    const fetchData = async () => {
      let url = `http://localhost:3000/api/${filter}`;
      const params = new URLSearchParams();

      // Filtro por categoria ou formação acadêmica
      if (categoria) {
        params.append(filter === "usuario" ? "formacaoAcademica" : "categoria", categoria);
      }

      // Filtro de pesquisa por título ou nome
      if (searchTerm) {
        params.append(filter === "usuario" ? "nome" : "titulo", searchTerm);
      }

      // Parâmetro de ordenação
      if (ordem === "recente") {
        params.append("ordem", "recente");
      }
      // Adiciona os parâmetros à URL
      url += `?${params.toString()}`;

      try {
        const response = await fetch(url);
        const data = await response.json();
        console.log(data);
        setItems(data);
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      }
    };

    fetchData();
  }, [filter, categoria, searchTerm, ordem]);

  const totalPages = Math.ceil(items.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = items.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100  space-y-6">
      {/* Barra de Filtros */}
      <div className="w-full max-w-4xl bg-white p-6 mt-8 shadow-lg rounded-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Select onValueChange={(value) => setFilter(value)}>
              <SelectTrigger className="w-[180px] flex justify-between items-center">
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="curso">Cursos</SelectItem>
                  <SelectItem value="projeto">Projetos</SelectItem>
                  <SelectItem value="usuario">Professores</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            <Select onValueChange={(value) => setCategoria(value)}>
              <SelectTrigger className="w-[180px] flex justify-between items-center">
                <SelectValue placeholder={filter === "usuario" ? "Formação" : "Categoria"} />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {(filter === "usuario" ? ["Engenharia de Software", "Ciência da Computação"] : categorias).map((item, index) => (
                    <SelectItem key={index} value={item}>
                      {item}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            <div className="relative">
              <Input
                id="input-text"
                placeholder="Pesquisar"
                className="w-56 pr-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)} // Atualiza o estado ao digitar
              />
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
            </div>
          </div>
          {/* Filtro de Ordenação */}
          <Select onValueChange={(value) => setOrdem(value)}>
            <SelectTrigger className="w-[180px] flex justify-between items-center">
              <SelectValue placeholder="Ordem" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="recente">Mais recentes</SelectItem>
                <SelectItem value="alfabetica">Ordem alfabética</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Lista de Cards */}
      <div className="w-full max-w-4xl space-y-4">
        {currentItems.map((item, index) => {
          let cardData;

          if (filter === "curso" || filter === "projeto") {
            cardData = {
              imageSrc: item.imagem,
              title: item.titulo,
              description: item.descricao,
            };
          } else if (filter === "usuario") {
            cardData = {
              imageSrc: item.fotoPerfil,
              title: item.Nome,
              description: item.resumoPessoal,
            };
          }

          return (
            <HorizontalCard key={index} imageSrc={cardData?.imageSrc} title={cardData?.title} description={cardData?.description} />
          );
        })}
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

      {/* Rodapé */}
      <Footer2 />
    </div>
  );
}