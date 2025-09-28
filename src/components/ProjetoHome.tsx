"use client"

import type React from "react"
import { useEffect, useState } from "react"
import CardCursoWithButton from "@/components/CardCursoWithButton"
import { Button } from "@/components/ui/button"
import { useParams, useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Badge } from "@/components/ui/badge"

interface Projeto {
  id: number
  titulo: string
  imagem: string
  descricao: string
  categoria: string
  categoriaFormatada: string
  dataInicio: string
  dataFim: string
  projetoUsuario: {
    id: number
    idProjeto: number
    idUsuario: number
    funcao: string
    usuario: {
      Nome: string
    }
  }[]
  curso: any[]
  projetoColaborador: {
    id: number
    categoria: string
    idProjeto: number
    idColaborador: number
    colaborador: {
      id: number
      nome: string
    }
  }[]
}

interface ProjetoHomeProps {
  idOverride?: string
}


const ProjetoHome: React.FC<ProjetoHomeProps> = ({ idOverride }) => {
  const router = useRouter()
  const { id: routeId } = useParams()
  const id = idOverride ?? routeId
  const { data: session, status } = useSession()
  const [isOwner, setIsOwner] = useState(false)
  const [projeto, setProjeto] = useState<Projeto | null>(null)
  const [refreshKey, setRefreshKey] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  const handleCursoDeleted = () => {
    setRefreshKey((prev) => prev + 1)
  }

  useEffect(() => {
    const fetchProjeto = async () => {
      try {
        setError(null)
        setLoading(true)

        // Debug: Verificar o ID recebido
        console.log("🔍 Debug fetchProjeto:")
        console.log("- id:", id)
        console.log("- typeof id:", typeof id)

        if (id === "TESTEINTERNO") {
          const projetoFalso: Projeto = {
            id: 999,
            titulo: "Projeto EducaFuturo",
            imagem: "/proj1.jpg",
            descricao: "Capacitando educadores e gestores com metodologias ativas e tecnologia educacional.",
            categoria: "Programação",
            categoriaFormatada: "Programação",
            dataInicio: "2023-10-01",
            dataFim: "2023-11-30",
            projetoUsuario: [
              {
                id: 1,
                idProjeto: 999,
                idUsuario: 1,
                funcao: "Coordenador",
                usuario: { Nome: "Fulano" },
              },
            ],
            projetoColaborador: [
              {
                id: 1,
                categoria: "Instrutor",
                idProjeto: 999,
                idColaborador: 1,
                colaborador: {
                  id: 1,
                  nome: "Maria Oliveira",
                },
              },
              {
                id: 2,
                categoria: "Tutor",
                idProjeto: 999,
                idColaborador: 2,
                colaborador: {
                  id: 2,
                  nome: "Carlos Souza",
                },
              },
            ],
            curso: [
              {
                id: 1,
                imagem: "/proj1.jpg",
                nome: "Python",
                descricao: "Curso intensivo de programação em Python para iniciantes e avançados.",
                cargahoraria: "40 horas",
              },
              {
                id: 2,
                imagem: "/prof3.jpg",
                nome: "Inglês",
                descricao: "Curso de inglês básico a avançado, focado em conversação e gramática.",
                cargahoraria: "60 horas",
              },
              {
                id: 3,
                imagem: "/prof4.jpg",
                nome: "Sistemas Embarcados",
                descricao: "Curso completo sobre sistemas embarcados com prática em hardware e software.",
                cargahoraria: "80 horas",
              },
              {
                id: 4,
                imagem: "/prof5.jpg",
                nome: "C/C++",
                descricao: "Curso aprofundado em C e C++ com projetos práticos e desafios de programação.",
                cargahoraria: "70 horas",
              },
            ],
          }
          setProjeto(projetoFalso)
          setIsOwner(true)
          setLoading(false)
          return
        }

        if (status === "loading") return

        // Validar se o ID é válido
        if (!id || isNaN(Number(id))) {
          console.error("❌ ID inválido:", id)
          router.push("/404")
          return
        }

        console.log("📡 Fazendo fetch para:", `/api/projeto?id=${id}`)
        const res = await fetch(`/api/projeto?id=${id}`)

        console.log("📡 Response status:", res.status)

        if (!res.ok) {
          if (res.status === 404) {
            console.error("❌ Projeto não encontrado")
            router.push("/404")
            return
          }
          throw new Error(`Erro na requisição: ${res.status}`)
        }

        const data: Projeto = await res.json()
        console.log("📦 Dados recebidos:", data)

        // Verificar se o projeto existe (apenas verificar se tem ID)
        if (!data || !data.id) {
          console.error("❌ Projeto não encontrado nos dados")
          router.push("/404")
          return
        }

        setProjeto(data)

        // Verificar se o usuário é proprietário (apenas se estiver logado)
        if (session?.user?.id && data.projetoUsuario) {
          const isProjectOwner = data.projetoUsuario.some((user) => Number(user.idUsuario) === Number(session.user.id))
          console.log("👤 É proprietário:", isProjectOwner)
          setIsOwner(isProjectOwner)
        }
      } catch (error) {
        console.error("❌ Erro ao buscar projeto:", error)
        setError("Erro interno, tente mais tarde")
      } finally {
        setLoading(false)
      }
    }

    fetchProjeto()
  }, [id, refreshKey, status, session, router])

  const handleAdicionarCurso = () => {
    router.push(`/curso/criar?idProjeto=${id}`)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-2">
        <div className="text-center py-10">
          <p className="text-red-600 text-lg font-medium">{error}</p>
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

  if (!projeto) {
    return (
      <div className="container mx-auto px-4 py-2">
        <p className="text-center text-gray-500">Projeto não encontrado</p>
      </div>
    )
  }

  return (
    <div>
      <div
        className="bg-gray-200 bg-cover bg-center bg-no-repeat relative min-h-[400px] -mt-4"
        style={{
          backgroundImage: projeto?.imagem ? `url(${projeto.imagem})` : undefined,
        }}
      >
        {/* Overlay para melhorar legibilidade */}
        <div className="absolute inset-0 bg-black/20"></div>

        {/* Conteúdo com z-index para ficar acima da overlay */}
        <div className="relative z-10 flex flex-col md:flex-row w-full mx-auto px-8 py-10">

          <div className="w-full md:w-1/2 md:pr-10">
            <h1 className="text-3xl md:text-5xl font-bold pb-6 text-white drop-shadow-lg">
              {projeto.titulo}
              {isOwner && (
                <button
                  className="p-0 ml-2 border-none bg-transparent cursor-pointer hover:opacity-70 transition-opacity"
                  onClick={() => router.push(`/projeto/editar/${projeto.id}`)}
                  aria-label="Editar Projeto"
                >
                  <img src="/pen.png" alt="Editar" className="w-6 h-6 filter brightness-0 invert" />
                </button>
              )}
            </h1>


            <div className="px-2 py-0.5 rounded-lg shadow-md bg-gray-900/60 backdrop-blur-sm text-gray-200 text-justify
 inline-block max-w-[90%] break-words whitespace-normal">
              {projeto.descricao}
            </div>
            <div className="flex">
              <Badge className="mr-2 my-5">{projeto.categoriaFormatada}</Badge>
            </div>

            <div>
              {isOwner && (
                <Button
                  size="sm"
                  className="transition-all duration-300 ease-in-out hover:shadow-lg hover:shadow-white/50 hover:scale-105 hover:brightness-110"
                  onClick={handleAdicionarCurso}
                >
                  + Adicionar Curso
                </Button>
              )}
            </div>
          </div>

          <div className="w-full md:w-1/2 flex justify-center items-start pt-10 md:mt-0">
            <div className="p-5 rounded-lg shadow-md flex flex-col space-y-2 bg-gray-900/80 backdrop-blur-sm text-gray-200">
              <p><strong>Data de Início:</strong> {new Date(projeto.dataInicio).toLocaleDateString()}</p>
              <p><strong>Data de Finalização:</strong> {projeto.dataFim
                ? new Date(projeto.dataFim).toLocaleDateString()
                : 'Sem data determinada'}</p>
              <p><strong>Coordenador:</strong> {
                projeto.projetoUsuario?.find((u) => u.funcao === "Coordenador")?.usuario?.Nome ??
                projeto.projetoColaborador?.find((c) => c.categoria === "Coordenador")?.colaborador?.nome ??
                "Não informado"
              }</p>
              <div>
                <strong>Colaboradores:</strong>
                <div className="mt-1 max-h-24 overflow-y-auto">
                  {(!projeto.projetoColaborador || projeto.projetoColaborador.length === 0) &&
                    (!projeto.projetoUsuario || !projeto.projetoUsuario.some((u) => u.funcao !== "Coordenador")) ? (
                    <span className="text-sm">Nenhum colaborador</span>
                  ) : (
                    <div className="text-sm space-y-1">
                      {projeto.projetoColaborador?.map((colab, index) => (
                        <div key={`colab-${index}`}>
                          {colab.colaborador.nome} - {colab.categoria}
                        </div>
                      ))}
                      {projeto.projetoUsuario
                        ?.filter((u) => u.funcao !== "Coordenador")
                        .map((user, index) => (
                          <div key={`user-${index}`}>
                            {user.usuario.Nome} - {user.funcao}
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      <h1 className="mt-12 px-8 text-center text-3xl font-bold">Cursos Associados</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-10 mb-12 mt-12">
        {projeto.curso && projeto.curso.length > 0 ? (
          projeto.curso.map((curso, index) => (
            <div key={index} className="m-0 p-0 flex">
              <CardCursoWithButton
                key={`${curso.nome}-${index}`}
                idCurso={curso.id}
                imagem={curso.imagem}
                nome={curso.nome}
                descricao={curso.descricao}
                cargahoraria={curso.cargahoraria}
                isOwner={isOwner}
                onCursoDeleted={handleCursoDeleted}
              />
            </div>
          ))
        ) : (
          <p className="col-span-3 text-center text-gray-500">Nenhum curso cadastrado.</p>
        )}
      </div>
    </div>
  )
}

export default ProjetoHome
