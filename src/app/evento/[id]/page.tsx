"use client";

import React, { useEffect, useState } from "react";
import CardEventoWithButton from "@/components/CardEventoWithButton"; 
import { Button } from "@/components/ui/button"; 
import { useParams, useRouter } from "next/navigation"; 
import { notFound } from 'next/navigation'; 

interface Evento {
  id: number;
  titulo: string;
  imagem: string;
  descricao: string;
  categoria: string;
  dataInicio: string;
  dataFim: string;
  eventoUsuario: {
    id: number;
    idEvento: number;
    idUsuario: number;
    funcao: string;
    usuario: {
      Nome: string;
    }
  }[];
  evento: any[];
  eventoColaborador: {
    id: number;
    categoria: string;
    idEvento: number;
    idColaborador: number;
    colaborador: {
      id: number;
      nome: string;
    };
  }[];
}

const EventoHome: React.FC = () => {
  const router = useRouter(); 
  const [isOwner, setIsOwner] = useState(false); 
  const [evento, setEvento] = useState<Evento | null>(null); 
  const { eventoid } = useParams();
  const [refreshKey, setRefreshKey] = useState(0); 
  const [error, setError] = useState<string | null>(null); 

  const handleEventoDeleted = () => {
    setRefreshKey(prev => prev + 1); 
  };

  useEffect(() => {
    const fetchEvento = async () => {
      try {
        setError(null); 

        if (eventoid === "TESTEINTERNO") {
          const eventoFalso: Evento = {
            id: 999,
            titulo: "Evento EducaFuturo",
            imagem: "/proj1.jpg",
            descricao: "Capacitando educadores e gestores com metodologias ativas e tecnologia educacional.",
            categoria: "Programação",
            dataInicio: "2023-10-01",
            dataFim: "2023-11-30",
            eventoUsuario: [
              {
                id: 1,
                idEvento: 999,
                idUsuario: 1,
                funcao: "Coordenador",
                usuario: {Nome: "Fulano"}
              }
            ],
            eventoColaborador: [
              { 
                id: 1,
                categoria: "Instrutor",
                idEvento: 999,
                idColaborador: 1,
                colaborador: {
                  id: 1,
                  nome: "Maria Oliveira"
                }
              },
              { 
                id: 2,
                categoria: "Tutor",
                idEvento: 999,
                idColaborador: 2,
                colaborador: {
                  id: 2,
                  nome: "Carlos Souza"
                }
              }
            ],
            evento: [
              { id:1, imagem: "/proj1.jpg", nome: "Evento Python", descricao: "Evento intensivo de programação em Python para iniciantes e avançados.", cargahoraria: "40 horas" },
              { id:2, imagem: "/prof3.jpg", nome: "Evento Inglês", descricao: "Evento de inglês básico a avançado, focado em conversação e gramática.", cargahoraria: "60 horas" },
              { id:3, imagem: "/prof4.jpg", nome: "Evento Sistemas Embarcados", descricao: "Evento completo sobre sistemas embarcados com prática em hardware e software.", cargahoraria: "80 horas" },
              { id:4, imagem: "/prof5.jpg", nome: "Evento C/C++", descricao: "Evento aprofundado em C e C++ com projetos práticos e desafios de programação.", cargahoraria: "70 horas" }
            ]
          };
          setEvento(eventoFalso); 
          setIsOwner(true); 
          return;
        }
  
        const res = await fetch(http://localhost:3000/api/evento?id=${eventoid}); 
        if (!res.ok) throw new Error("Erro na requisição"); 
        const data: Evento = await res.json(); 

        if (!data || !data.eventoUsuario || data.eventoUsuario.length === 0) {
          router.push('/404'); 
        }
        setEvento(data); 
  
        const usuarioLogadoId = 1; 
        const coordenador = data.eventoUsuario.find(
          (user) => user.idUsuario === usuarioLogadoId
        ); 
        setIsOwner(!!coordenador);
      } catch (error) {
        console.error("Erro ao buscar evento:", error);
        setError("Erro interno, tente mais tarde"); 
      }
    };
  
    fetchEvento(); 
  }, [eventoid, refreshKey]); 
  
  const handleAdicionarEvento = () => {
    router.push(/Evento/criar?idEvento=${eventoid}); 
  };

  return (
    <div className="container mx-auto px-4 py-2">
      {error ? ( 
        <div className="text-center py-10">
          <p className="text-red-600 text-lg font-medium">{error}</p>
        </div>
      ) : evento ? ( 
        <>
          <div className="flex justify-between items-center my-4">
            <h1 className="text-3xl font-bold">{evento.titulo}</h1>
            {isOwner && ( 
              <Button
                type="button"
                className="bg-black text-white hover:bg-gray-800 text-base"
                onClick={handleAdicionarEvento}
              >
                + Adicionar Evento
              </Button>
            )}
          </div>

          <p className="text-xl text-gray-700 mb-6">{evento.descricao}</p> 

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-10">
            {evento.evento.length > 0 ? (
              evento.evento.map((eventoItem, index) => (
                <div key={index} className="m-0 p-0 flex">
                  <CardEventoWithButton
                    key={${eventoItem.nome}-${index}}
                    idEvento={eventoItem.id} 
                    imagem={eventoItem.imagem}
                    nome={eventoItem.nome}
                    descricao={eventoItem.descricao}
                    cargahoraria={eventoItem.cargahoraria}
                    isOwner={isOwner}
                    onEventoDeleted={handleEventoDeleted}
                  />
                </div>
              ))
            ) : (
              <p className="col-span-3 text-center text-gray-500">
                Nenhum evento cadastrado.
              </p>
            )}
          </div>
        </>
      ) : (
        <p className="text-center text-gray-500">Carregando evento...</p> 
      )}
    </div>
  );
};

export default EventoHome;