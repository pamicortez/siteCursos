"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { HorizontalCard } from "@/components/ui/horizontal_card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Footer2 } from "@/components/ui/footer";

export default function SearchPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState("curso");
  const [categoria, setCategoria] = useState("");
  const [searchTerm, setSearchTerm] = useState(""); // Estado para a pesquisa
  const [ordem, setOrdem] = useState("alfabetica"); // Estado para a ordenação
  const [items, setItems] = useState([]);

  // Estados para as categorias/formações
  const [formacoes, setFormacoes] = useState<string[]>([]); // para usuários
  const [categoriasCursos, setCategoriasCursos] = useState<string[]>([]);
  const [categoriasProjetos, setCategoriasProjetos] = useState<string[]>([]);

  // Lista fixa usada para cursos quando não buscar da API
  const categoriasFixas = [
    "Linguagens, Letras e Comunicação",
    "Artes e Cultura",
    "Ciências Agrárias",
    "Pesquisa e Inovação",
    "Serviços Sociais e Comunitários",
    "Gestão e Planejamento",
    "Ciências Sociais Aplicadas a Negócios",
    "Comunicação e Informação",
    "Ciências Biológicas e Naturais",
    "Engenharia e Produção",
    "Tecnologia e Computação",
    "Produção e Construção",
    "Saúde e Bem-Estar",
    "Educação e Formação de Professores",
    "Negócios, Administração e Direito",
    "Ciências Exatas",
    "Ciências Humanas",
    "Meio Ambiente e Sustentabilidade",
  ];

  // Função para buscar formações acadêmicas distintas (usuarios)
  const fetchFormacoesAcademicas = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/usuario");
      const usuarios = await response.json();

      const formacoes = usuarios
        .map((usuario: any) => usuario.formacaoAcademica)
        .filter(Boolean);

      const formacoesDistintas = Array.from(new Set(formacoes));
      return formacoesDistintas;
    } catch (error) {
      console.error("Erro ao buscar usuários:", error);
      return [];
    }
  };

  // Função para buscar categorias de cursos
  const fetchCategoriasCursos = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/curso");
      const cursos = await response.json();

      const categorias = cursos
        .map((curso: any) => curso.categoria)
        .filter(Boolean);

      const categoriasDistintas = Array.from(new Set(categorias));
      return categoriasDistintas;
    } catch (error) {
      console.error("Erro ao buscar categorias de cursos:", error);
      return [];
    }
  };

  // Função para buscar categorias de projetos
  const fetchCategoriasProjetos = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/projeto");
      const projetos = await response.json();

      const categorias = projetos
        .map((projeto: any) => projeto.categoria)
        .filter(Boolean);

      const categoriasDistintas = Array.from(new Set(categorias));
      return categoriasDistintas;
    } catch (error) {
      console.error("Erro ao buscar categorias de projetos:", error);
      return [];
    }
  };

  // Effect para resetar a categoria sempre que o filtro mudar
  useEffect(() => {
    setCategoria(""); // **Reseta a categoria sempre que o filtro mudar**

    if (filter === "usuario") {
      fetchFormacoesAcademicas().then((data) => setFormacoes(data));
      setCategoriasCursos([]);
      setCategoriasProjetos([]);
    } else if (filter === "curso") {
      fetchCategoriasCursos().then((data) =>
        setCategoriasCursos(data.length ? data : categoriasFixas)
      );
      setFormacoes([]);
      setCategoriasProjetos([]);
    } else if (filter === "projeto") {
      fetchCategoriasProjetos().then((data) => setCategoriasProjetos(data));
      setFormacoes([]);
      setCategoriasCursos([]);
    } else {
      // Reset geral, caso tenha outros filtros
      setFormacoes([]);
      setCategoriasCursos([]);
      setCategoriasProjetos([]);
    }
  }, [filter]);

  // Effect para buscar itens (cursos, projetos ou usuários)
  useEffect(() => {
    const fetchData = async () => {
      let url = `http://localhost:3000/api/${filter}`;
      const params = new URLSearchParams();

      if (categoria) {
        params.append(
          filter === "usuario" ? "formacaoAcademica" : "categoria",
          categoria
        );
      }

      if (searchTerm) {
        params.append(filter === "usuario" ? "nome" : "titulo", searchTerm);
      }

      if (ordem === "recente") {
        params.append("ordem", "recente");
      }

      url += `?${params.toString()}`;

      try {
        const response = await fetch(url);
        const data = await response.json();
        setItems(data);
        setCurrentPage(1); // Resetar página ao buscar novos dados
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      }
    };

    fetchData();
  }, [filter, categoria, searchTerm, ordem]);

  const itemsPerPage = 6;
  const totalPages = Math.ceil(items.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = items.slice(startIndex, startIndex + itemsPerPage);

  // Escolhe a lista de categorias/formações para o select conforme filtro
  const categoriasParaSelect =
    filter === "usuario"
      ? formacoes
      : filter === "curso"
      ? categoriasCursos
      : filter === "projeto"
      ? categoriasProjetos
      : [];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 space-y-6">
      {/* Barra de Filtros */}
      <div className="w-full max-w-4xl bg-white p-6 mt-8 shadow-lg rounded-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Select onValueChange={(value) => setFilter(value)} value={filter}>
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
            <Select onValueChange={(value) => setCategoria(value)} value={categoria}>
              <SelectTrigger className="w-[180px] flex justify-between items-center">
                <SelectValue placeholder={filter === "usuario" ? "Formação" : "Categoria"} />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {categoriasParaSelect.length > 0 ? (
                    categoriasParaSelect.map((item, index) => (
                      <SelectItem key={index} value={item}>
                        {item}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem disabled>Nenhuma categoria</SelectItem>
                  )}
                </SelectGroup>
              </SelectContent>
            </Select>
            <div className="relative">
              <Input
                id="input-text"
                placeholder="Pesquisar"
                className="w-56 pr-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
            </div>
          </div>
          {/* Filtro de Ordenação */}
          <Select onValueChange={(value) => setOrdem(value)} value={ordem}>
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
            <HorizontalCard
              key={index}
              id={item.id}
              type={filter}
              imageSrc={cardData?.imageSrc}
              title={cardData?.title}
              description={cardData?.description}
            />
          );
        })}
      </div>

      {/* Paginação */}
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href="#"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            />
          </PaginationItem>
          {Array.from({ length: totalPages }, (_, i) => (
            <PaginationItem key={i}>
              <PaginationLink
                href="#"
                isActive={currentPage === i + 1}
                onClick={() => setCurrentPage(i + 1)}
              >
                {i + 1}
              </PaginationLink>
            </PaginationItem>
          ))}
          <PaginationItem>
            <PaginationNext
              href="#"
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
