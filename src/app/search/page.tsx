"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
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

import { Suspense } from 'react';

function SearchPageNoSuspense() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [filter, setFilter] = useState(searchParams.get("filter") ?? "curso");
  const [categoria, setCategoria] = useState(searchParams.get("categoria") ?? "todas");
  const [searchTerm, setSearchTerm] = useState(searchParams.get("searchTerm") ?? "");
  const [ordem, setOrdem] = useState(searchParams.get("ordem") ?? "alfabetica");

  const [currentPage, setCurrentPage] = useState(1);
  const [items, setItems] = useState<Item[]>([]);

  const [formacoes, setFormacoes] = useState<string[]>([]);

  const [categoriasCursos, setCategoriasCursos] = useState<string[]>([]);
  const [categoriasProjetos, setCategoriasProjetos] = useState<string[]>([]);

  useEffect(() => {
    const newFilter = searchParams.get("filter") ?? "curso";
    const newCategoria = searchParams.get("categoria") ?? "todas";
    const newSearchTerm = searchParams.get("searchTerm") ?? "";
    const newOrdem = searchParams.get("ordem") ?? "alfabetica";
    
    setFilter(newFilter);
    setCategoria(newCategoria);
    setSearchTerm(newSearchTerm);
    setOrdem(newOrdem);
  }, [searchParams]);

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

  const fetchFormacoesAcademicas = async (): Promise<string[]> => {
    try {
      const response = await fetch("/api/usuario");
      const usuarios: { formacaoAcademica?: string }[] = await response.json();
      const formacoes = usuarios
        .map((u) => u.formacaoAcademica)
        .filter((f): f is string => Boolean(f));
      return Array.from(new Set(formacoes));
    } catch (error) {
      console.error("Erro ao buscar usuários:", error);
      return [];
    }
  };

  const fetchCategoriasCursos = async (): Promise<string[]> => {
    try {
      const response = await fetch("/api/curso");
      const cursos: { categoria?: string }[] = await response.json();
      const categorias = cursos
        .map((c) => c.categoria)
        .filter((c): c is string => Boolean(c));
      return Array.from(new Set(categorias));
    } catch (error) {
      console.error("Erro ao buscar categorias de cursos:", error);
      return [];
    }
  };

  const fetchCategoriasProjetos = async (): Promise<string[]> => {
    try {
      const response = await fetch("/api/projeto");
      const projetos: { categoria?: string }[] = await response.json();
      const categorias = projetos
        .map((p) => p.categoria)
        .filter((c): c is string => Boolean(c));
      return Array.from(new Set(categorias));
    } catch (error) {
      console.error("Erro ao buscar categorias de projetos:", error);
      return [];
    }
  };

  type Curso = {
    id: string;
    titulo: string;
    descricao: string;
    imagem: string;
  };

  type Projeto = {
    id: string;
    titulo: string;
    descricao: string;
    imagem: string;
  };

  type Usuario = {
    id: string;
    fotoPerfil: string;
    Nome: string;
    resumoPessoal: string;
  };

  type Item = Curso | Projeto | Usuario;



  useEffect(() => {
    

    if (filter === "usuario") {
      fetchFormacoesAcademicas().then(setFormacoes);
      setCategoriasCursos([]);
      setCategoriasProjetos([]);
    } else if (filter === "curso") {
      fetchCategoriasCursos().then((data) =>
        setCategoriasCursos(data.length ? data : categoriasFixas)
      );
      setFormacoes([]);
      setCategoriasProjetos([]);
    } else if (filter === "projeto") {
      fetchCategoriasProjetos().then(setCategoriasProjetos);
      setFormacoes([]);
      setCategoriasCursos([]);
    } else {
      setFormacoes([]);
      setCategoriasCursos([]);
      setCategoriasProjetos([]);
    }
  }, [filter]);

  useEffect(() => {
    const fetchData = async () => {
      let url = `/api/${filter}`;
      const params = new URLSearchParams();

      if (categoria && categoria !== "todas") {
        params.append(filter === "usuario" ? "formacaoAcademica" : "categoria", categoria);
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
        setCurrentPage(1);
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      }
    };
    fetchData();
  }, [filter, categoria, searchTerm, ordem]);

  // useEffect(() => {
  //   const params = new URLSearchParams();
  //   if (filter) params.set("filter", filter);
  //   if (categoria) params.set("categoria", categoria);
  //   if (searchTerm) params.set("searchTerm", searchTerm);
  //   if (ordem) params.set("ordem", ordem);
  //   router.replace(`/search${params.toString() ? `?${params.toString()}` : ""}`, {
  //     scroll: false,
  //   });
  // }, [filter, categoria, searchTerm, ordem, router]);

  useEffect(() => {
    const params = new URLSearchParams();
    if (filter) params.set("filter", filter);
    if (categoria && categoria !== "todas") params.set("categoria", categoria);
    if (searchTerm) params.set("searchTerm", searchTerm);
    if (ordem) params.set("ordem", ordem);
    router.replace(`/search${params.toString() ? `?${params.toString()}` : ""}`, {
      scroll: false,
    });
  }, [filter, categoria, searchTerm, ordem, router]);

  const itemsPerPage = 6;
  const totalPages = Math.ceil(items.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = items.slice(startIndex, startIndex + itemsPerPage);

  const categoriasParaSelect =
    filter === "usuario"
      ? formacoes
      : filter === "curso"
        ? categoriasCursos
        : filter === "projeto"
          ? categoriasProjetos
          : [];

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100 space-y-6 px-4 pb-10">
      {/* Barra de Filtros */}
      <div className="w-full max-w-4xl bg-white p-6 mt-8 shadow-lg rounded-lg">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 w-full">
            <Select onValueChange={setFilter} value={filter}>
              <SelectTrigger className="w-full sm:w-[180px]">
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

            <Select onValueChange={setCategoria} value={categoria}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder={filter === "usuario" ? "Formação" : "Categoria"} />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {/* Opção "Todas" com valor não-vazio */}
                  <SelectItem value="todas">Todas</SelectItem>
                  {categoriasParaSelect.length > 0 ? (
                    categoriasParaSelect.map((item, index) => (
                      <SelectItem key={index} value={item}>
                        {item}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="sem-opcoes" disabled>
                      Selecione uma opção
                    </SelectItem>
                  )}
                </SelectGroup>
              </SelectContent>
            </Select>

            <div className="relative w-full sm:w-56">
              <Input
                id="input-text"
                placeholder="Pesquisar"
                className="w-full pr-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
            </div>
          </div>

          <Select onValueChange={setOrdem} value={ordem}>
            <SelectTrigger className="w-full sm:w-[180px]">
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
            // Aqui podemos garantir que item é Curso | Projeto
            const cursoOuProjeto = item as Curso | Projeto;
            cardData = {
              imageSrc: cursoOuProjeto.imagem,
              title: cursoOuProjeto.titulo,
              description: cursoOuProjeto.descricao,
            };
          } else if (filter === "usuario") {
            const usuario = item as Usuario;
            cardData = {
              imageSrc: usuario.fotoPerfil,
              title: usuario.Nome,
              description: usuario.resumoPessoal,
            };
          }

          return (
            <HorizontalCard
              key={index}
              id={item.id}
              type={filter}
              imageSrc={cardData?.imageSrc ?? ""}
              title={cardData?.title ?? ""}
              description={cardData?.description ?? ""}
            />
          );
        })}
      </div>

      {/* Paginação */}
      <Pagination className="w-full">
        <PaginationContent className="flex flex-wrap justify-center gap-2">
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




export default function SearchPage() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <SearchPageNoSuspense />
    </Suspense>
  );
}