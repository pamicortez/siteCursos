"use client"

import React from "react";
import Carrossel from "@/components/Carrossel";
import CardProjeto from "@/components/CardProjeto";
import CardEvento from "@/components/CardEvento";
import Navbar from "@/components/Navbar";

interface Profile {
  nome: string;
  descricao: string;
  instituicao: string;
  foto: string;
}

interface Evento {
  id: string;
  nome: string;
  descricao: string;
  data: string;
}

interface Experiencia {
  id: string;
  cargo: string;
  instituicao: string;
  periodo: string;
  local: string;
}

interface Formacao {
  id: string;
  nivel: string;
  instituicao: string;
  periodo: string;
  local: string;
}

interface Post {
  id: string;
  citacao: string;
  referencia: string;
}

export default function ProfessorPortfolio() {
  const profile: Profile = {
    nome: "Nome do professor",
    descricao: "Descrição breve sobre o professor",
    instituicao: "Instituição de ensino",
    foto: "/default-profile.png"
  };

  const projetos = [
    { imagem: "/proj1.jpg", nome: "Tecnologia da Informação", descricao: "Curso de introdução e especialização em TI.", cargahoraria: "80 horas" },
    { imagem: "/proj2.jpg", nome: "Física", descricao: "Projeto de pesquisa e desenvolvimento em física aplicada.", cargahoraria: "120 horas" },
    { imagem: "/proj3.jpg", nome: "Química", descricao: "Curso focado em experimentos e teoria química avançada.", cargahoraria: "100 horas" },
    { imagem: "/proj4.jpg", nome: "Matemática", descricao: "Projeto de inovação em métodos de ensino matemático.", cargahoraria: "90 horas" },
    { imagem: "/proj5.jpg", nome: "História", descricao: "Curso de história mundial e metodologias de pesquisa histórica.", cargahoraria: "70 horas" },
  ];

  const eventosDisponiveis: Evento[] = [
    { id: '1', nome: 'Conferência Internacional de Tecnologia', descricao: 'Palestra sobre inovações em educação digital', data: '15/05/2024' },
    { id: '2', nome: 'Workshop de Desenvolvimento Web', descricao: 'Oficina prática para estudantes', data: '22/06/2024' },
    { id: '3', nome: 'Simpósio de Pesquisa Científica', descricao: 'Apresentação de trabalhos acadêmicos', data: '10/08/2024' }
  ];

  const experiencias: Experiencia[] = [
    { id: '1', cargo: 'Professor Titular', instituicao: 'Universidade Federal', periodo: '2018 - Presente', local: 'São Paulo, SP' },
    { id: '2', cargo: 'Pesquisador', instituicao: 'Instituto de Tecnologia', periodo: '2015 - 2018', local: 'Campinas, SP' }
  ];

  const formacoes: Formacao[] = [
    { id: '1', nivel: 'Doutorado em Ciência da Computação', instituicao: 'USP', periodo: '2012 - 2016', local: 'São Paulo, SP' },
    { id: '2', nivel: 'Mestrado em Engenharia de Software', instituicao: 'UNICAMP', periodo: '2010 - 2012', local: 'Campinas, SP' }
  ];

  const posts: Post[] = [
    { id: '1', citacao: "A educação é a arma mais poderosa que você pode usar para mudar o mundo.", referencia: "Nelson Mandela" },
    { id: '2', citacao: "O sucesso é a soma de pequenos esforços repetidos dia após dia.", referencia: "Robert Collier" },
    { id: '3', citacao: "A tecnologia é apenas uma ferramenta. Para levar as crianças a trabalhar juntas e motivá-las, o professor é o mais importante.", referencia: "Bill Gates" }
  ];

  return (
    <div className="container mx-auto p-4 space-y-12">
      <Navbar />
      
      {/* Seção Perfil */}
      <div className="bg-white p-8 rounded-lg shadow-md">
        <div className="flex items-start gap-8">
          <img
            src={profile.foto}
            alt="Foto do professor"
            className="w-48 h-48 rounded-full object-cover border-4 border-gray-100"
          />
          <div className="flex-1 space-y-3">
            <h1 className="text-3xl font-bold text-gray-900">{profile.nome}</h1>
            <p className="text-xl text-blue-600 font-medium">{profile.instituicao}</p>
            <p className="text-gray-700 text-lg">{profile.descricao}</p>
          </div>
        </div>
      </div>

      {/* Seção Posts */}
      <div className="mt-8">
        <h1 className="text-3xl font-bold mb-6 px-4">Publicações</h1>
        <div className="space-y-6">
          {posts.map(post => (
            <div key={post.id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <blockquote className="italic text-gray-800 text-lg">"{post.citacao}"</blockquote>
              <p className="mt-4 text-sm text-gray-600 font-medium">{post.referencia}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Seção Projetos */}
      <div className="container space-y-4">
        <div className="mt-20">
          <h1 className="px-8 text-left text-3xl font-bold">Projetos</h1>
          <Carrossel linhas={1}>
            {projetos.map((projeto, index) => (
              <CardProjeto key={index} {...projeto} />
            ))}
          </Carrossel>
        </div>
      </div>

      {/* Seção Eventos */}
      <div className="mt-20">
        <h1 className="px-8 text-left text-3xl font-bold">Eventos</h1>
        <Carrossel linhas={1}>
          {eventosDisponiveis.map(evento => (
            <CardEvento
              key={evento.id}
              nome={evento.nome}
              descricao={evento.descricao}
              data={evento.data}
            />
          ))}
        </Carrossel>
      </div>

      {/* Seção Experiências */}
      <div className="bg-white p-6 rounded-lg shadow-md mt-12">
        <h1 className="text-3xl font-bold mb-6">Experiência Profissional</h1>
        <div className="space-y-6">
          {experiencias.map(exp => (
            <div key={exp.id} className="border-b pb-6 last:border-b-0">
              <div className="space-y-1">
                <h3 className="font-bold text-lg">{exp.cargo}</h3>
                <p className="text-gray-800">{exp.instituicao}</p>
                <p className="text-gray-600 text-sm">{exp.periodo}</p>
                <p className="text-gray-500 text-sm">{exp.local}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Seção Formação */}
      <div className="bg-white p-6 rounded-lg shadow-md mt-12">
        <h1 className="text-3xl font-bold mb-6">Formação Acadêmica</h1>
        <div className="space-y-6">
          {formacoes.map(form => (
            <div key={form.id} className="border-b pb-6 last:border-b-0">
              <div className="space-y-1">
                <h3 className="font-bold text-lg">{form.nivel}</h3>
                <p className="text-gray-800">{form.instituicao}</p>
                <p className="text-gray-600 text-sm">{form.periodo}</p>
                <p className="text-gray-500 text-sm">{form.local}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}