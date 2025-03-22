// src/app/home/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import Carrossel from "@/components/Carrossel";
import CardProfessor from "@/components/CardProfessor";
import CardProjeto from "@/components/CardProjeto";
import CardCurso from "@/components/CardCurso";

const professores = [
  { imagem: "/prof1.jpg", nome: "João Silva", descricao: "Especialista em IA." },
  { imagem: "/prof2.jpg", nome: "Ana Souza", descricao: "Doutora em Big Data." },
  { imagem: "/prof3.jpg", nome: "Carlos Mendes", descricao: "PhD em Robótica." },
  { imagem: "/prof4.jpg", nome: "Mariana Lima", descricao: "Engenheira de Software." },
  { imagem: "/prof5.jpg", nome: "Ricardo Santos", descricao: "Especialista em Redes." },
  { imagem: "/prof1.jpg", nome: "João Silva", descricao: "Especialista em IA." },
  { imagem: "/prof2.jpg", nome: "Ana Souza", descricao: "Doutora em Big Data." },
  { imagem: "/prof3.jpg", nome: "Carlos Mendes", descricao: "PhD em Robótica." },
  { imagem: "/prof4.jpg", nome: "Mariana Lima", descricao: "Engenheira de Software." },
  { imagem: "/prof5.jpg", nome: "Ricardo Santos", descricao: "Especialista em Redes." }
];

const projetos = [
  { imagem: "/proj1.jpg", nome: "Tecnologia da Informação", descricao: "Curso de introdução e especialização em TI.", cargahoraria: "80 horas" },
  { imagem: "/proj2.jpg", nome: "Física", descricao: "Projeto de pesquisa e desenvolvimento em física aplicada.", cargahoraria: "120 horas" },
  { imagem: "/proj3.jpg", nome: "Química", descricao: "Curso focado em experimentos e teoria química avançada.", cargahoraria: "100 horas" },
  { imagem: "/proj4.jpg", nome: "Matemática", descricao: "Projeto de inovação em métodos de ensino matemático.", cargahoraria: "90 horas" },
  { imagem: "/proj5.jpg", nome: "História", descricao: "Curso de história mundial e metodologias de pesquisa histórica.", cargahoraria: "70 horas" },
  { imagem: "/proj1.jpg", nome: "Tecnologia da Informação", descricao: "Curso de introdução e especialização em TI.", cargahoraria: "80 horas" },
  { imagem: "/proj2.jpg", nome: "Física", descricao: "Projeto de pesquisa e desenvolvimento em física aplicada.", cargahoraria: "120 horas" },
  { imagem: "/proj3.jpg", nome: "Química", descricao: "Curso focado em experimentos e teoria química avançada.", cargahoraria: "100 horas" },
  { imagem: "/proj4.jpg", nome: "Matemática", descricao: "Projeto de inovação em métodos de ensino matemático.", cargahoraria: "90 horas" },
  { imagem: "/proj5.jpg", nome: "História", descricao: "Curso de história mundial e metodologias de pesquisa histórica.", cargahoraria: "70 horas" },
  { imagem: "/proj1.jpg", nome: "Tecnologia da Informação", descricao: "Curso de introdução e especialização em TI.", cargahoraria: "80 horas" },
  { imagem: "/proj2.jpg", nome: "Física", descricao: "Projeto de pesquisa e desenvolvimento em física aplicada.", cargahoraria: "120 horas" },
  { imagem: "/proj3.jpg", nome: "Química", descricao: "Curso focado em experimentos e teoria química avançada.", cargahoraria: "100 horas" },
  { imagem: "/proj4.jpg", nome: "Matemática", descricao: "Projeto de inovação em métodos de ensino matemático.", cargahoraria: "90 horas" },
  { imagem: "/proj5.jpg", nome: "História", descricao: "Curso de história mundial e metodologias de pesquisa histórica.", cargahoraria: "70 horas" },
  { imagem: "/proj1.jpg", nome: "Tecnologia da Informação", descricao: "Curso de introdução e especialização em TI.", cargahoraria: "80 horas" },
  { imagem: "/proj2.jpg", nome: "Física", descricao: "Projeto de pesquisa e desenvolvimento em física aplicada.", cargahoraria: "120 horas" },
  { imagem: "/proj3.jpg", nome: "Química", descricao: "Curso focado em experimentos e teoria química avançada.", cargahoraria: "100 horas" },
  { imagem: "/proj4.jpg", nome: "Matemática", descricao: "Projeto de inovação em métodos de ensino matemático.", cargahoraria: "90 horas" },
  { imagem: "/proj5.jpg", nome: "História", descricao: "Curso de história mundial e metodologias de pesquisa histórica.", cargahoraria: "70 horas" }
];

const cursos = [
  { imagem: "/proj1.jpg", nome: "Python", descricao: "Curso intensivo de programação em Python para iniciantes e avançados.", cargahoraria: "40 horas" },
  { imagem: "/prof2.jpg", nome: "React", descricao: "Curso prático de desenvolvimento com React para aplicações web.", cargahoraria: "50 horas" },
  { imagem: "/prof3.jpg", nome: "Inglês", descricao: "Curso de inglês básico a avançado, focado em conversação e gramática.", cargahoraria: "60 horas" },
  { imagem: "/prof4.jpg", nome: "Sistemas Embarcados", descricao: "Curso completo sobre sistemas embarcados com prática em hardware e software.", cargahoraria: "80 horas" },
  { imagem: "/prof5.jpg", nome: "C/C++", descricao: "Curso aprofundado em C e C++ com projetos práticos e desafios de programação.", cargahoraria: "70 horas" },
  { imagem: "/proj1.jpg", nome: "Python", descricao: "Curso intensivo de programação em Python para iniciantes e avançados.", cargahoraria: "40 horas" },
  { imagem: "/prof2.jpg", nome: "React", descricao: "Curso prático de desenvolvimento com React para aplicações web.", cargahoraria: "50 horas" },
  { imagem: "/prof3.jpg", nome: "Inglês", descricao: "Curso de inglês básico a avançado, focado em conversação e gramática.", cargahoraria: "60 horas" },
  { imagem: "/prof4.jpg", nome: "Sistemas Embarcados", descricao: "Curso completo sobre sistemas embarcados com prática em hardware e software.", cargahoraria: "80 horas" },
  { imagem: "/prof5.jpg", nome: "C/C++", descricao: "Curso aprofundado em C e C++ com projetos práticos e desafios de programação.", cargahoraria: "70 horas" }
];

export default function HomePage() {
  const [linhas, setLinhas] = useState(2);

  useEffect(() => {
    const handleResize = () => {
      setLinhas(window.innerWidth < 768 ? 1 : 2);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="container my-5">
      <h1 className="text-center mb-4">Professores</h1>
      <Carrossel>
        {professores.map((professor, index) => (
          <CardProfessor key={index} {...professor} />
        ))}
      </Carrossel>

      <h1 className="text-left mb-4">Projetos</h1>
      <Carrossel linhas={linhas}>
        {projetos.map((projeto, index) => (
          <CardProjeto key={index} {...projeto} />
        ))}
      </Carrossel>

      <h1 className="text-left mb-4">Cursos</h1>
      <Carrossel linhas={linhas}>
        {cursos.map((curso, index) => (
          <CardCurso key={index} {...curso} />
        ))}
      </Carrossel>
    </div>
  );
}
