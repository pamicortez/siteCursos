"use client"

import React from "react";
import CardCursoWithButton from "../components/CardCursoWithButton"; 
import { Button } from "@/components/ui/button";

const ProjetoHome: React.FC = () => {
  const cursos = [
    { imagem: "/proj1.jpg", nome: "Python", descricao: "Curso intensivo de programação em Python para iniciantes e avançados.", cargahoraria: "40 horas", isOwner: true },
    { imagem: "/prof2.jpg", nome: "React", descricao: "Curso prático de desenvolvimento com React para aplicações web.", cargahoraria: "50 horas", isOwner: true },
    { imagem: "/prof3.jpg", nome: "Inglês", descricao: "Curso de inglês básico a avançado, focado em conversação e gramática.", cargahoraria: "60 horas", isOwner: true },
    { imagem: "/prof4.jpg", nome: "Sistemas Embarcados", descricao: "Curso completo sobre sistemas embarcados com prática em hardware e software.", cargahoraria: "80 horas", isOwner: true },
    { imagem: "/prof5.jpg", nome: "C/C++", descricao: "Curso aprofundado em C e C++ com projetos práticos e desafios de programação.", cargahoraria: "70 horas", isOwner: true },
    { imagem: "/proj1.jpg", nome: "Python", descricao: "Curso intensivo de programação em Python para iniciantes e avançados.", cargahoraria: "40 horas", isOwner: true },
    { imagem: "/prof2.jpg", nome: "React", descricao: "Curso prático de desenvolvimento com React para aplicações web.", cargahoraria: "50 horas", isOwner: true },
    { imagem: "/prof3.jpg", nome: "Inglês", descricao: "Curso de inglês básico a avançado, focado em conversação e gramática.", cargahoraria: "60 horas", isOwner: true },
    { imagem: "/prof4.jpg", nome: "Sistemas Embarcados", descricao: "Curso completo sobre sistemas embarcados com prática em hardware e software.", cargahoraria: "80 horas", isOwner: true },
    { imagem: "/prof5.jpg", nome: "C/C++", descricao: "Curso aprofundado em C e C++ com projetos práticos e desafios de programação.", cargahoraria: "70 horas", isOwner: true }
  ];

  const handleAdicionarCurso = () => {
    alert("Botão 'Adicionar Curso' clicado!");
  };

  const isOwner = true; 

  return (
    <>
      <div className="container mx-auto px-4 py-2">
        {/* Título e Botão "Adicionar Curso" */}
        <div className="flex justify-between items-center my-4">
          <h1 className="text-3xl font-bold">Projeto EducaFuturo</h1>
          {isOwner && (
            <Button 
              type="button" 
              className="bg-black text-white hover:bg-gray-800 text-base" 
              onClick={handleAdicionarCurso}
            >
              + Adicionar Curso
            </Button>
          )}
        </div>

        <p className="text-xl text-gray-700 mb-6">
          Capacitando educadores e gestores com metodologias ativas e tecnologia educacional.
        </p>

        <div className="mb-8">
          {/* Data de início e Data de finalização lado a lado */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-lg"><strong>Data de Início:</strong> 01/10/2023</p>
            </div>
            <div>
              <p className="text-lg"><strong>Data de Finalização:</strong> 30/11/2023</p>
            </div>
          </div>

          {/* Coordenador e Categoria */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-lg"><strong>Coordenador:</strong> João Silva</p>
            </div>
            <div>
              <p className="text-lg"><strong>Categoria:</strong> Programação</p>
            </div>
          </div>

          {/* Colaboradores */}
          <div>
            <strong className="text-lg">Colaboradores:</strong>
            <ul className="list-disc pl-5 mt-2 text-base">
              <li>Maria Oliveira - Instrutora</li>
              <li>Carlos Souza - Tutor</li>
            </ul>
          </div>
        </div>

        <hr style={{ border: "none", borderTop: "1px solid #e5e7eb", margin: "24px 0" }} />

        {/* Exibe os cards em 3 colunas por linha */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-10 ">
        {cursos.map((curso, index) => (
            <div key={index} className="m-0 p-0 flex">
            <CardCursoWithButton
                imagem={curso.imagem}
                nome={curso.nome}
                descricao={curso.descricao}
                cargahoraria={curso.cargahoraria}
                isOwner={curso.isOwner}
              />
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default ProjetoHome;
