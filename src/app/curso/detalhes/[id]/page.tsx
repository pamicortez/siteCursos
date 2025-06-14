"use client"
import { Badge } from "@/components/ui/badge"
import {useSession} from "next-auth/react"
import { redirect, useRouter } from 'next/navigation';
import { Link, TvMinimalPlay, Headphones, Images } from "lucide-react"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

enum categoria {
  SaudeEBemEstar = "Saúde e Bem-estar",
  CienciasBiologicasENaturais = "Ciências Biológicas e Naturais",
  TecnologiaEComputacao = "Tecnologia e Computação",
  EngenhariaEProducao = "Engenharia e Produção",
  CienciasSociaisENegocios = "Ciências Sociais Aplicadas e Negócios",
  EducacaoEFormacao = "Educação e Formação de Professores",
  CienciasExatas = "Ciências Exatas",
  CienciasHumanas = "Ciências Humanas",
  MeioAmbienteESustentabilidade = "Meio Ambiente e Sustentabilidade",
  LinguagensELetrasEComunicacao = "Linguagens, Letras e Comunicação",
  ArtesECultura = "Artes e Cultura",
  CienciasAgrarias = "Ciências Agrárias",
  PesquisaEInovacao = "Pesquisa e Inovação",
  ServicosSociaisEComunitarios = "Serviços Sociais e Comunitários",
  GestaoEPlanejamento = "Gestão e Planejamento",
}




export default function DetalhesCurso() {

  const { data: session, status } = useSession();
  const router = useRouter();

  const params = useParams();
  const id = params.id;

  const [curso, setCurso] = useState(null); // criar tipo aqui
  const [paginaAtual, setPaginaAtual] = useState(1);
  const aulasPorPagina = 3;

  useEffect(() => {
    async function loadCurso() {
      const res = await fetch(`/api/curso?id=${id}`);
      const data = await res.json();
      setCurso(data);
    }
    loadCurso();
  }, [id]);

  const absoluteLink = (url) => {
      return url.startsWith('http://') || url.startsWith('https://')
      ? url
      : `https://${url}`;
  }

  if (!curso) return <div></div>;

  const totalPaginas = Math.ceil((curso.aula?.length || 0) / aulasPorPagina);
  const aulasVisiveis = curso.aula?.slice(
    (paginaAtual - 1) * aulasPorPagina,
    paginaAtual * aulasPorPagina
  ) || [];

  console.log(session?.user.id)

  
  
  return (
    <div>
        <div className="flex w-100% h-100 bg-gray-200">
            
            <div className="w-1/2">
                <h1 className="text-5xl font-bold pt-12 pb-10 px-10 text-left">{curso.titulo} </h1>
                <p className="px-10 text-justify" >{curso.descricao}</p>
                <div className="flex">
                    <Badge className="ml-10 mr-2 my-5">{categoria[curso.categoria]}</Badge>
                </div>
            </div>

            <div className="w-1/2 flex justify-center items-center">
              <div className="p-5 min-w-1/2 min-h-1/2 rounded-md border-3 border-[#cac4d0] border-solid">
                 <p>Instrutor: {curso.usuario.Nome}</p>
                 <p>Carga Horária: {curso.cargaHoraria}h</p>
                 <p>Última Atualização: {new Date(curso.updatedAt).toLocaleDateString("pt-BR")}</p>
              </div>
            </div>

        </div>
        
        <div className="flex flex-col items-center">
          <h1 className="text-5xl font-bold py-9">Materiais</h1>
          <div className="flex items-center hover:cursor-pointer">
             {curso.linkApostila && (
                <a
                  href={curso.linkApostila}
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

        <div className="mt-10 mx-20 w-[90%]">
          {aulasVisiveis.map((aula: any, index: any) => (
            <div
              key={index}
              className="flex justify-between p-3 rounded-md border-3 border-[#cac4d0] mb-4"
            >
              <p className="font-medium text-xl">{aula.titulo}</p>
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

        </div>
    </div>
  );

}
