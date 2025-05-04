"use client"

import React, { useEffect, useState } from "react";
import CardCursoWithButton from "@/components/CardCursoWithButton";
import { Button } from "@/components/ui/button";
import { useParams } from "next/navigation";

interface Projeto {
  id: number;
  titulo: string;
  imagem: string;
  descricao: string;
  categoria: string;
  dataInicio: string;
  dataFim: string;
  projetoUsuario: {
    id: number;
    idProjeto: number;
    idUsuario: number;
    funcao: string;
  }[];
  curso: any[];
  projetoColaborador: {
    id: number;
    categoria: string;
    idProjeto: number;
    idColaborador: number;
    colaborador: {
      id: number;
      nome: string;
    };
  }[];
}

const ProjetoHome: React.FC = () => {
  const [isOwner, setIsOwner] = useState(false);
  const [projeto, setProjeto] = useState<Projeto | null>(null);
  const { id } = useParams();

  useEffect(() => {
    const fetchProjeto = async () => {
      try {
        if (id === "TESTEINTERNO") {
          const projetoFalso: Projeto = {
            id: 999,
            titulo: "Projeto EducaFuturo",
            imagem: "/proj1.jpg",
            descricao: "Capacitando educadores e gestores com metodologias ativas e tecnologia educacional.",
            categoria: "Programação",
            dataInicio: "2023-10-01",
            dataFim: "2023-11-30",
            projetoUsuario: [
              {
                id: 1,
                idProjeto: 999,
                idUsuario: 1,
                funcao: "Coordenador"
              }
            ],
            projetoColaborador: [
              { 
                id: 1,
                categoria: "Instrutor",
                idProjeto: 999,
                idColaborador: 1,
                colaborador: {
                  id: 1,
                  nome: "Maria Oliveira"
                }
              },
              { 
                id: 2,
                categoria: "Tutor",
                idProjeto: 999,
                idColaborador: 2,
                colaborador: {
                  id: 2,
                  nome: "Carlos Souza"
                }
              }
            ],
            curso: [
              { imagem: "/proj1.jpg", nome: "Python", descricao: "Curso intensivo de programação em Python para iniciantes e avançados.", cargahoraria: "40 horas" },
              { imagem: "/prof3.jpg", nome: "Inglês", descricao: "Curso de inglês básico a avançado, focado em conversação e gramática.", cargahoraria: "60 horas" },
              { imagem: "/prof4.jpg", nome: "Sistemas Embarcados", descricao: "Curso completo sobre sistemas embarcados com prática em hardware e software.", cargahoraria: "80 horas" },
              { imagem: "/prof5.jpg", nome: "C/C++", descricao: "Curso aprofundado em C e C++ com projetos práticos e desafios de programação.", cargahoraria: "70 horas" }
            ]
          };;
          setProjeto(projetoFalso);
          setIsOwner(true); // Como é só teste, assume que é dono
          return;
        }
  
        const res = await fetch(`http://localhost:3000/api/projeto?id=${id}`);
        if (!res.ok) throw new Error("Erro na requisição");
        const data: Projeto = await res.json();
        setProjeto(data);
  
        const usuarioLogadoId = 1; // <--- Ajusta 
        const coordenador = data.projetoUsuario.find(
          (user) => user.funcao === "Coordenador" && user.idUsuario === usuarioLogadoId
        );
        setIsOwner(!!coordenador);
      } catch (error) {
        console.error("Erro ao buscar projeto:", error);
      }
    };
  
    fetchProjeto();
  }, [id]);
  

  const handleAdicionarCurso = () => {
    alert("Botão 'Adicionar Curso' clicado!");
  };

  return (
    <div className="container mx-auto px-4 py-2">
      {projeto ? (
        <>
          <div className="flex justify-between items-center my-4">
            <h1 className="text-3xl font-bold">{projeto.titulo}</h1>
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

          <p className="text-xl text-gray-700 mb-6">{projeto.descricao}</p>

          <div className="mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-lg">
                  <strong>Data de Início:</strong>{" "}
                  {new Date(projeto.dataInicio).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-lg">
                  <strong>Data de Finalização:</strong>{" "}
                  {new Date(projeto.dataFim).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-lg">
                  <strong>Coordenador:</strong>{" "}
                  {
                    // Primeiro verifica em projetoUsuario
                    projeto.projetoUsuario.find((u) => u.funcao === "Coordenador")?.idUsuario ??
                    // Se não encontrar, verifica em projetoColaborador
                    projeto.projetoColaborador.find((c) => c.categoria === "Coordenador")?.colaborador.nome ??
                    "Não informado"
                  }
                </p>
              </div>
              <div>
                <p className="text-lg">
                  <strong>Categoria:</strong> {projeto.categoria}
                </p>
              </div>
            </div>

          <div>
              <strong className="text-lg">Colaboradores:</strong>
              <ul className="list-disc pl-5 mt-2 text-base">
                {projeto.projetoColaborador.length === 0 && !projeto.projetoUsuario.some(u => u.funcao !== "Coordenador") ? (
                  <li>Nenhum colaborador</li>
                ) : (
                  <>
                    {/* Lista de colaboradores externos */}
                    {projeto.projetoColaborador.map((colab, index) => (
                      <li key={`colab-${index}`}>
                        {colab.colaborador.nome} - {colab.categoria}
                      </li>
                    ))}
                    
                    {/* Usuários do sistema que não são coordenadores */}
                    {projeto.projetoUsuario
                      .filter(u => u.funcao !== "Coordenador")
                      .map((user, index) => (
                        <li key={`user-${index}`}>
                          {user.idUsuario} - {user.funcao}
                        </li>
                      ))
                    }
                  </>
                )}
              </ul>
            </div>'
          </div>

          <hr
            style={{
              border: "none",
              borderTop: "1px solid #e5e7eb",
              margin: "24px 0",
            }}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-10">
            {projeto.curso.length > 0 ? (
              projeto.curso.map((curso, index) => (
                <div key={index} className="m-0 p-0 flex">
                  <CardCursoWithButton
                    imagem={curso.imagem}
                    nome={curso.nome}
                    descricao={curso.descricao}
                    cargahoraria={curso.cargahoraria}
                    isOwner={isOwner}
                  />
                </div>
              ))
            ) : (
              <p className="col-span-3 text-center text-gray-500">
                Nenhum curso cadastrado.
              </p>
            )}
          </div>
        </>
      ) : (
        <p className="text-center text-gray-500">Carregando projeto...</p>
      )}
    </div>
  );
};

export default ProjetoHome;
