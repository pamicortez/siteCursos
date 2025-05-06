"use client"

import React from "react";
import Carrossel from "@/components/Carrossel";
import CardProjeto from "@/components/CardProjeto";
import CardEvento from "@/components/CardEvento";
import Navbar from "@/components/Navbar";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface Usuario {
  id: number;
  Nome: string;
  Titulacao: string;
  instituicaoEnsino: string;
  resumoPessoal: string;
  fotoPerfil: string;
  Links?: { link: string }[];
  publicacao: Publicacao[];
  eventoUsuario: { evento: Evento }[];
  projetoUsuario: { projeto: Projeto }[];
  carreira: Carreira[];
}

interface Projeto {
  id: number;
  titulo: string;
  imagem: string;
  descricao: string;
  categoria: string;
  dataInicio: string;
  dataFim: string;
}

interface Evento {
  id: number;
  titulo: string;
  descricao: string;
  data: string;
  linkParticipacao: string;
  tipoParticipacao?: string;
  imagens?: { link: string }[];
}

interface Publicacao {
  id: number;
  descricao: string;
  link: string;
}

interface Carreira {
  id: number;
  nome: string;
  descricao: string;
  categoria: 'Formação acadêmica' | 'Experiencia profissional';
  dataInicio: string;
  dataFim: string | null;
}

export default function ProfessorPortfolio({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [id, setId] = useState<string>("");
  
  useEffect(() => {
    Promise.resolve(params).then(resolvedParams => {
      setId(resolvedParams.id);
    });
  }, [params]);
  
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [visiblePosts, setVisiblePosts] = useState(3);

  // Extrai os dados das relações do usuário
  const projetos = usuario?.projetoUsuario?.map(pu => pu.projeto) || [];
  const eventos = usuario?.eventoUsuario?.map(eu => eu.evento) || [];
  const publicacoes = usuario?.publicacao || [];
  const carreiras = usuario?.carreira || [];

  const formacoesAcademicas = carreiras.filter(item => item.categoria === 'Formação acadêmica');
  const experienciasProfissionais = carreiras.filter(item => item.categoria === 'Experiencia profissional');

  const loadMorePosts = () => {
    setVisiblePosts(prev => prev + 3);
  };

  const showLessPosts = () => {
    setVisiblePosts(3);
  };

  const formatarPeriodo = (dataInicio: string, dataFim: string | null) => {
    const inicio = new Date(dataInicio).toLocaleDateString('pt-BR');
    const fim = dataFim ? new Date(dataFim).toLocaleDateString('pt-BR') : 'Em andamento';
    return `${inicio} - ${fim}`;
  };

  const handleProjetoClick = (projetoId: number) => {
    router.push(`/projeto/${projetoId}`);
  };

  const handleEventoClick = (eventoId: number) => {
    router.push(`/evento/${eventoId}`);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const usuarioRes = await fetch(`http://localhost:3000/api/usuario?id=${id}`);
        if (!usuarioRes.ok) throw new Error('Erro ao carregar dados do professor');
        const usuarioData = await usuarioRes.json();
        setUsuario(usuarioData);

      } catch (err) {
        setError(err instanceof Error ? err.message : 'Ocorreu um erro desconhecido');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) return <div className="text-center py-20">Carregando...</div>;
  if (error) return <div className="text-center py-20 text-red-500">{error}</div>;
  if (!usuario) return <div className="text-center py-20">Professor não encontrado</div>;

  return (
    <div className="container mx-auto p-4 space-y-12">
      <Navbar />
      
      {/* Seção Perfil */}
      <div className="bg-white p-8 rounded-lg shadow-md">
        <div className="flex items-start gap-8">
          <img
            src={usuario.fotoPerfil || "/default-profile.png"}
            alt={`Foto do professor ${usuario.Nome}`}
            className="w-48 h-48 rounded-full object-cover border-4 border-gray-100"
          />
          <div className="flex-1 space-y-3">
            <h1 className="text-3xl font-bold text-gray-900">{usuario.Nome}</h1>
            <p className="text-xl text-blue-600 font-medium">{usuario.Titulacao} - {usuario.instituicaoEnsino}</p>
            <p className="text-gray-700 text-lg">{usuario.resumoPessoal}</p>
            {usuario.Links && usuario.Links.length > 0 && (
              <div className="mt-4">
                <h3 className="font-bold">Links:</h3>
                <div className="flex gap-4">
                  {usuario.Links.map((link, index) => (
                    <a key={index} href={link.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                      {new URL(link.link).hostname}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Seção Posts */}
      <div className="mt-8">
        <div className="flex justify-between items-center mb-6 px-4">
          <h1 className="text-3xl font-bold">Publicações</h1>
        </div>
        
        {publicacoes.length > 0 ? (
          <div className="space-y-6">
            {publicacoes.slice(0, visiblePosts).map(post => (
              <div key={post.id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <blockquote className="italic text-gray-800 text-lg">"{post.descricao}"</blockquote>
                <p className="mt-4 text-sm text-gray-600 font-medium">{post.link}</p>
              </div>
            ))}
            
            <div className="flex justify-center gap-4">
              {visiblePosts < publicacoes.length && (
                <Button 
                  variant="outline" 
                  onClick={loadMorePosts}
                >
                  Ver mais ({Math.min(3, publicacoes.length - visiblePosts)})
                </Button>
              )}
              
              {visiblePosts > 3 && (
                <Button 
                  variant="ghost" 
                  onClick={showLessPosts}
                >
                  Ver menos
                </Button>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            Nenhuma publicação adicionada ainda
          </div>
        )}
      </div>

      {/* Seção Projetos */}
      {projetos.length > 0 && (
        <div className="container space-y-4">
          <div className="mt-20">
            <h1 className="px-8 text-left text-3xl font-bold">Projetos</h1>
            <Carrossel linhas={1}>
              {projetos.map((projeto) => (
                <div key={projeto.id} onClick={() => handleProjetoClick(projeto.id)} className="cursor-pointer">
                  <CardProjeto 
                    imagem={projeto.imagem}
                    nome={projeto.titulo}
                    descricao={projeto.descricao}
                  />
                </div>
              ))}
            </Carrossel>
          </div>
        </div>
      )}

      {/* Seção Eventos */}
      {eventos.length > 0 && (
        <div className="mt-20">
          <h1 className="px-8 text-left text-3xl font-bold">Eventos</h1>
          <Carrossel linhas={1}>
            {eventos.map(evento => (
              <div key={evento.id} onClick={() => handleEventoClick(evento.id)} className="cursor-pointer">
                <CardEvento
                  nome={evento.titulo}
                  descricao={evento.descricao}
                  data={new Date(evento.data).toLocaleDateString('pt-BR')}
                />
              </div>
            ))}
          </Carrossel>
        </div>
      )}

      {/* Seção Formação Acadêmica */}
      <div className="bg-white p-6 rounded-lg shadow-md mt-12">
        <h1 className="text-3xl font-bold mb-6">Formação Acadêmica</h1>
        
        {formacoesAcademicas.length > 0 ? (
          <div className="space-y-8">
            {formacoesAcademicas.map((formacao) => (
              <div key={formacao.id} className="border-l-4 border-blue-500 pl-4">
                <h3 className="font-bold text-xl">{formacao.nome}</h3>
                <p className="text-gray-700 mt-2">{formacao.descricao}</p>
                <p className="text-gray-600 mt-1">
                  {formatarPeriodo(formacao.dataInicio, formacao.dataFim)}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            Nenhuma formação acadêmica cadastrada
          </div>
        )}
      </div>

      {/* Seção Experiência Profissional */}
      <div className="bg-white p-6 rounded-lg shadow-md mt-8">
        <h1 className="text-3xl font-bold mb-6">Experiência Profissional</h1>
        
        {experienciasProfissionais.length > 0 ? (
          <div className="space-y-8">
            {experienciasProfissionais.map((experiencia) => (
              <div key={experiencia.id} className="border-l-4 border-blue-500 pl-4">
                <h3 className="font-bold text-xl">{experiencia.nome}</h3>
                <p className="text-gray-700 mt-2">{experiencia.descricao}</p>
                <p className="text-gray-600 mt-1">
                  {formatarPeriodo(experiencia.dataInicio, experiencia.dataFim)}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            Nenhuma experiência profissional cadastrada
          </div>
        )}
      </div>
    </div>
  );
}