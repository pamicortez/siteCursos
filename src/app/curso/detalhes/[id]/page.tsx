"use client"
import { Badge } from "@/components/ui/badge"
import { Link, TvMinimalPlay, Headphones, Images, PencilLine, Pencil } from "lucide-react"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { useEffect, useState } from "react";
import { notFound, useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react"



export type Curso = {
  id: number;
  titulo: string;
  imagem: string;
  descricao: string;
  categoria: string;
  cargaHoraria: number;
  linkInscricao: string;
  vagas: number;
  bibliografia: string;
  metodologia: string;
  metodoAvaliacao: string;
  linkApostila: string | null;
  idProjeto: number;
  idUsuario: number;
  createdAt: string;
  updatedAt: string;
  usuario: {
    Nome: string
  },
  aula: Aula[]

}

type Aula = {
  id: number,
  titulo: string,
  linkPdf: string,
  linkPodcast: string,
  linkVideo: string
}


export default function DetalhesCurso() {

  const { data: session, status } = useSession();
  const params = useParams();
  const router = useRouter();
  
  const id = params.id;

  const [curso, setCurso] = useState<Curso | null>(null); // criar tipo aqui
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);
  const aulasPorPagina = 3;

  interface Category {
    value: string;
    label: string;
  }

useEffect(() => {
    async function loadCursoAndCategories() {
      try {
        // Load Curso
        const resCurso = await fetch(`/api/curso?id=${id}`);
        if (!resCurso.ok) {
          throw new Error('Failed to load course');
        }
        const dataCurso = await resCurso.json();
        setCurso(dataCurso);

        // Load Categories
        const resCategories = await fetch("/api/enums/categoriaCurso");
        if (!resCategories.ok) {
          throw new Error("Erro ao buscar categorias de evento");
        }
        const dataCategories = await resCategories.json();
        setCategories(dataCategories);

      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      } finally {
        setLoading(false);
      }
    }
    loadCursoAndCategories();
  }, [id]);


  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]"> 
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
        <p className="ml-4 text-lg text-gray-700">Carregando curso...</p>
      </div>
    );
  }

  if (!curso) {
    return notFound();
  }

  const absoluteLink = (url: any) => {
    return url.startsWith('http://') || url.startsWith('https://')
      ? url
      : `https://${url}`;
  }


  const totalPaginas = Math.ceil((curso?.aula?.length || 0) / aulasPorPagina);
  const aulasVisiveis = curso?.aula?.slice(
    (paginaAtual - 1) * aulasPorPagina,
    paginaAtual * aulasPorPagina
  ) || [];

  const categoriaMapeada = categories.find((category) => category.value == curso?.categoria)
  const isCourseOwner = curso?.idUsuario == Number(session?.user.id)

  return (
    <div>
      <div className="bg-gray-200">
        <div className="flex flex-col md:flex-row w-full mx-auto px-8 py-10">

          <div className="w-full md:w-1/2 md:pr-10">
            <h1 className="text-3xl md:text-5xl font-bold pb-6">{curso?.titulo}
              {isCourseOwner && (
              <button 
                className="p-0 ml-2 border-none bg-transparent cursor-pointer hover:opacity-70 transition-opacity"
                onClick={() => router.push(`/curso/editar/${curso?.id}`)}
                aria-label="Editar Curso"
              >
              <img src="/pen.png" alt="Editar" className="w-6 h-6" />
            </button>
        )}
            </h1>
            
            <p className="text-justify">{curso?.descricao}</p>
            <div className="flex">
              <Badge className="mr-2 my-5">{categoriaMapeada?.label}</Badge>
            </div>

            <div>
              <Button asChild size="sm">
                <a
                  href={absoluteLink(curso?.linkInscricao)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <PencilLine />
                  Inscreva-se
                </a>
              </Button>

            </div>
          </div>

          <div className="w-full md:w-1/2 flex justify-center items-start pt-10 md:mt-0">
            <div className="p-5 rounded-md border-3 border-[#cac4d0] border-solid flex flex-col space-y-2">
              <p><strong>Instrutor:</strong> {curso?.usuario.Nome}</p>
              <p><strong>Vagas:</strong> {curso?.vagas}</p>
              <p><strong>Carga Horária:</strong> {curso?.cargaHoraria}h</p>
              <p><strong>Método de Avaliação:</strong> {curso?.metodoAvaliacao}</p>
              <p><strong>Metodologia:</strong> {curso?.metodologia}</p>
              <p><strong>Última Atualização:</strong> {new Date(curso?.updatedAt).toLocaleDateString("pt-BR")}</p>
            </div>
          </div>

        </div>
      </div>

      {/* CONTEÚDO DE MATERIAIS */}
      <div className="flex flex-col items-center px-4">
        <h1 className="text-3xl md:text-5xl font-bold py-9 text-center">Materiais</h1>

        <div className="flex items-center hover:cursor-pointer">
          {curso?.linkApostila && (
            <a
              href={curso?.linkApostila}
              download={`apostila_${curso.titulo}.pdf`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2"
            >
              <Link />
              <span className="text-xl font-medium">Apostila</span>
            </a>
          )}
        </div>

        {curso.aula.length === 0 && (
          <p className="text-gray-500 mt-10 text-center">Nenhuma aula adicionada.</p>
        )}

        <div className="mt-10 w-full md:w-[70%] px-4">
          {aulasVisiveis.map((aula: any, index: any) => (
            <div
              key={index}
              className="flex flex-col sm:flex-row justify-between p-3 rounded-md border-3 border-[#cac4d0] mb-4"
            >
              <p className="font-medium text-xl mb-2 sm:mb-0">{aula.titulo}</p>
              <div className="flex gap-1 hover:cursor-pointer">
                {aula.linkVideo && (
                  <a href={absoluteLink(aula.linkVideo)} target="_blank" rel="noopener noreferrer">
                    <TvMinimalPlay />
                  </a>
                )}
                {aula.linkPodcast && (
                  <a href={absoluteLink(aula.linkPodcast)} target="_blank" rel="noopener noreferrer">
                    <Headphones />
                  </a>
                )}
                {aula.linkPdf && (
                  <a href={aula.linkPdf} target="_blank" rel="noopener noreferrer" download={`${aula.titulo}.pdf`}>
                    <Images />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>

        {totalPaginas > 1 && (
          <Pagination className="mt-10 mb-15">
            <PaginationContent>
              {paginaAtual > 1 && (
                <PaginationItem>
                  <PaginationPrevious onClick={() => setPaginaAtual(p => p - 1)} />
                </PaginationItem>
              )}

              {[...Array(totalPaginas)].map((_, i) => (
                <PaginationItem key={i}>
                  <PaginationLink
                    href="#"
                    isActive={i + 1 === paginaAtual}
                    onClick={() => setPaginaAtual(i + 1)}
                  >
                    {i + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}

              {paginaAtual < totalPaginas && (
                <PaginationItem>
                  <PaginationNext onClick={() => setPaginaAtual(p => p + 1)} />
                </PaginationItem>
              )}
            </PaginationContent>
          </Pagination>
        )}

        <div className="my-7 w-full md:w-[70%] px-4">
          <strong>Bibliografia</strong>
          <p className="text-justify text-sm">{curso?.bibliografia}</p>
        </div>
      </div>
    </div>

  );

}
