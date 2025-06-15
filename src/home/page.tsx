"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Carrossel from "@/components/Carrossel"
import CardProfessor from "@/components/CardProfessor"
import CardProjeto from "@/components/CardProjeto"
import CardCurso from "@/components/CardCurso"
import CardEvento from "@/components/CardEvento"

interface Usuario {
  id: number
  Nome: string
  fotoPerfil: string
  resumoPessoal: string
}

interface Projeto {
  id: number
  titulo: string
  imagem: string
  descricao: string
  categoria: string
  dataInicio: string
  dataFim: string
  projetoUsuario?: Array<{
    funcao: string
    idUsuario: number
  }>
}

interface Curso {
  id: number
  titulo: string
  imagem: string
  descricao: string
  cargaHoraria: number
  categoria: string
  vagas: number
  linkInscricao: string
}

interface Evento {
  id: number
  titulo: string
  descricao: string
  data: string
  linkParticipacao: string
  imagemEvento: Array<{
    id: number
    link: string
  }>
}

const HomePage: React.FC = () => {
  const [linhas, setLinhas] = useState(2)
  const [usuarios, setUsuarios] = useState<Usuario[]>([])
  const [projetos, setProjetos] = useState<Projeto[]>([])
  const [eventos, setEventos] = useState<Evento[]>([])
  const [cursos, setCursos] = useState<Curso[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Atualiza o número de linhas do carrossel de acordo com o tamanho da tela
  useEffect(() => {
    const handleResize = () => {
      setLinhas(window.innerWidth < 768 ? 1 : 2)
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      try {
        setError(null)

        // Buscar usuários
        try {
          const usuariosResponse = await fetch("/api/usuario?tipo=Ativo")
          if (usuariosResponse.ok) {
            const usuariosData = await usuariosResponse.json()
            setUsuarios(Array.isArray(usuariosData) ? usuariosData : [])
          } else {
            console.error("Erro ao buscar usuários:", usuariosResponse.status)
          }
        } catch (err) {
          console.error("Erro ao buscar usuários:", err)
        }

        // Buscar projetos
        try {
          console.log("Tentando buscar projetos...")
          const projetosResponse = await fetch("/api/projeto")
          console.log("Response status:", projetosResponse.status)

          if (projetosResponse.ok) {
            const projetosData = await projetosResponse.json()
            console.log("Projetos recebidos:", projetosData)
            setProjetos(Array.isArray(projetosData) ? projetosData : [])
          } else {
            console.error("Erro ao buscar projetos:", projetosResponse.status, projetosResponse.statusText)
            setProjetos([])
          }
        } catch (err) {
          console.error("Erro ao buscar projetos:", err)
          setProjetos([])
        }

        // Buscar cursos
        try {
          const cursosResponse = await fetch("/api/curso")
          if (cursosResponse.ok) {
            const cursosData = await cursosResponse.json()
            setCursos(Array.isArray(cursosData) ? cursosData : [])
          } else {
            console.error("Erro ao buscar cursos:", cursosResponse.status)
          }
        } catch (err) {
          console.error("Erro ao buscar cursos:", err)
        }

        // Buscar eventos
        try {
          console.log("Tentando buscar eventos...")
          const eventosResponse = await fetch("/api/evento")
          console.log("Response status eventos:", eventosResponse.status)

          if (eventosResponse.ok) {
            const eventosData = await eventosResponse.json()
            console.log("Eventos recebidos:", eventosData)
            setEventos(Array.isArray(eventosData) ? eventosData : [])
          } else {
            console.error("Erro ao buscar eventos:", eventosResponse.status, eventosResponse.statusText)
            setEventos([])
          }
        } catch (err) {
          console.error("Erro ao buscar eventos:", err)
          setEventos([])
        }
      } catch (error) {
        console.error("Erro geral ao buscar dados:", error)
        setError("Erro ao carregar dados")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-red-600 mb-2">Erro</h2>
          <p className="text-gray-700">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="container space-y-4 mx-auto">
      <div className="mt-12">
        <h1 className="text-center text-3xl font-bold">Professores</h1>
        {usuarios.length > 0 ? (
          <Carrossel>
            {usuarios.map((usuario) => (
              <CardProfessor
                key={usuario.id}
                idProfessor={usuario.id}
                imagem={usuario.fotoPerfil || "/default.png"}
                nome={usuario.Nome}
                descricao={usuario.resumoPessoal || "Sem descrição"}
              />
            ))}
          </Carrossel>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p>Nenhum professor encontrado</p>
          </div>
        )}
      </div>

      <div className="mt-20">
        <h1 className="px-8 text-center text-3xl font-bold">Projetos</h1>
        {projetos.length > 0 ? (
          <Carrossel linhas={linhas}>
            {projetos.map((projeto) => (
              <CardProjeto
                key={projeto.id}
                idProjeto={projeto.id}
                imagem={projeto.imagem || "/default-projeto.png"}
                titulo={projeto.titulo}
                descricao={projeto.descricao}
                categoria={projeto.categoria}
                dataInicio={projeto.dataInicio}
                dataFim={projeto.dataFim}
                isOwner={false}
                largura="17rem"
              />
            ))}
          </Carrossel>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p>Nenhum projeto encontrado</p>
            <p className="text-sm">Debug: Tentando buscar de /api/projeto</p>
          </div>
        )}
      </div>

      <div className="mt-20">
        <h1 className="px-8 text-center text-3xl font-bold">Cursos</h1>
        {cursos.length > 0 ? (
          <Carrossel linhas={linhas}>
            {cursos.map((curso) => (
              <CardCurso
                idCurso={curso.id}
                imagem={curso.imagem || "/default-curso.png"}
                titulo={curso.titulo}
                descricao={curso.descricao}
                categoria={curso.categoria}
                vagas={curso.vagas}
                linkInscricao={curso.linkInscricao}
                cargaHoraria={curso.cargaHoraria || 0}
                isOwner={false}
                largura="17rem"
              />
            ))}
          </Carrossel>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p>Nenhum curso encontrado</p>
          </div>
        )}
      </div>

      <div className="mt-20">
        <h1 className="px-8 text-center text-3xl font-bold">Eventos</h1>
        {eventos.length > 0 ? (
          <Carrossel linhas={linhas}>
            {eventos.map((evento) => (
              <CardEvento
                key={evento.id}
                idEvento={evento.id}
                titulo={evento.titulo}
                descricao={evento.descricao}
                data={evento.data}
                linkParticipacao={evento.linkParticipacao || "#"}
                imagens={evento.imagemEvento?.map((img) => img.link) || ["/event_lecture.jpg"]}
                isOwner={false}
                largura="17rem"
              />
            ))}
          </Carrossel>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p>Nenhum evento encontrado</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default HomePage
