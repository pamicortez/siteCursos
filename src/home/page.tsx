"use client";

import React, { useState, useEffect } from 'react';
import Carrossel from '@/components/Carrossel';
import CardProfessor from '@/components/CardProfessor';
import CardProjeto from '@/components/CardProjeto';
import CardCurso from '@/components/CardCurso';

interface Usuario {
  id: number;
  Nome: string;
  fotoPerfil: string;
  resumoPessoal: string;
}

interface Projeto {
  id: number;
  titulo: string;
  imagem: string;
  descricao: string;
}

interface Curso {
  id: number;
  titulo: string;
  imagem: string;
  descricao: string;
  cargaHoraria: number;
}

const HomePage: React.FC = () => {
  const [linhas, setLinhas] = useState(2);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [projetos, setProjetos] = useState<Projeto[]>([]);
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [loading, setLoading] = useState(true);

  // Atualiza o número de linhas do carrossel de acordo com o tamanho da tela
  useEffect(() => {
    const handleResize = () => {
      setLinhas(window.innerWidth < 768 ? 1 : 2);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Buscar usuários
        const usuariosResponse = await fetch('/api/usuario');
        const usuariosData = await usuariosResponse.json();
        setUsuarios(usuariosData);

        // Buscar projetos
        const projetosResponse = await fetch('/api/projeto');
        const projetosData = await projetosResponse.json();
        setProjetos(projetosData);

        // Buscar cursos
        const cursosResponse = await fetch('/api/curso');
        const cursosData = await cursosResponse.json();
        setCursos(cursosData);

        setLoading(false);
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="container space-y-4">
      <div className="mt-12">
        <h1 className="text-center text-3xl font-bold">Professores</h1>
        <Carrossel>
          {usuarios.map((usuario) => (
            <CardProfessor
              key={usuario.id}
              imagem={usuario.fotoPerfil || '/default.png'}
              nome={usuario.Nome}
              descricao={usuario.resumoPessoal || 'Sem descrição'}
            />
          ))}
        </Carrossel>
      </div>

      <div className="mt-20">
        <h1 className="px-8 text-left text-3xl font-bold">Projetos</h1>
        <Carrossel linhas={linhas}>
        {projetos.map((projeto) => (
            <CardProjeto
              key={projeto.id}
              imagem={projeto.imagem || '/default-projeto.png'}
              titulo={projeto.titulo}
              descricao={projeto.descricao}
            />
          ))}
        </Carrossel>
      </div>

      <div className="mt-20">
        <h1 className="px-8 text-left text-3xl font-bold">Cursos</h1>
        <Carrossel linhas={linhas}>
          {cursos.map((curso) => (
            <CardCurso
              key={curso.id}
              imagem={curso.imagem || '/default.png'}
              titulo={curso.titulo}
              descricao={curso.descricao}
              cargaHoraria={curso.cargaHoraria || 0}
            />
          ))}
        </Carrossel>
      </div>
    </div>

    
  );
};

export default HomePage;