"use client"

import type React from "react"
import { useEffect, useState } from "react"
import CardCursoWithButton from "@/components/CardCursoWithButton"
import { Button } from "@/components/ui/button"
import { useParams, useRouter } from "next/navigation"
import { useSession } from "next-auth/react"

interface Projeto {
  id: number
  titulo: string
  imagem: string
  descricao: string
  categoria: string
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
    <div className="container mx-auto px-4 py-2">
      <div className="flex justify-between items-center my-4">
      <h1 className="text-3xl font-bold flex items-center gap-3">
        {projeto.titulo}
        {isOwner && (
          <button 
            className="p-0 ml-2 border-none bg-transparent cursor-pointer hover:opacity-70 transition-opacity"
            onClick={() => router.push(`/projeto/editar/${projeto.id}`)}
            aria-label="Editar Projeto"
          >
            <img src="/pen.png" alt="Editar" className="w-6 h-6" />
          </button>
        )}
      </h1>
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
              <strong>Data de Início:</strong> {new Date(projeto.dataInicio).toLocaleDateString()}
            </p>
          </div>
          <div>
            <p className="text-lg">
              <strong>Data de Finalização:</strong>{projeto.dataFim
                  ? new Date(projeto.dataFim).toLocaleDateString()
                  : ' Sem data de finalização determinada'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-lg">
              <strong>Coordenador:</strong>{" "}
              {
                // Primeiro verifica em projetoUsuario
                projeto.projetoUsuario?.find((u) => u.funcao === "Coordenador")?.usuario?.Nome ??
                  // Se não encontrar, verifica em projetoColaborador
                  projeto.projetoColaborador?.find((c) => c.categoria === "Coordenador")?.colaborador?.nome ??
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
            {(!projeto.projetoColaborador || projeto.projetoColaborador.length === 0) &&
            (!projeto.projetoUsuario || !projeto.projetoUsuario.some((u) => u.funcao !== "Coordenador")) ? (
              <li>Nenhum colaborador</li>
            ) : (
              <>
                {/* Lista de colaboradores externos */}
                {projeto.projetoColaborador?.map((colab, index) => (
                  <li key={`colab-${index}`}>
                    {colab.colaborador.nome} - {colab.categoria}
                  </li>
                ))}

                {/* Usuários do sistema que não são coordenadores */}
                {projeto.projetoUsuario
                  ?.filter((u) => u.funcao !== "Coordenador")
                  .map((user, index) => (
                    <li key={`user-${index}`}>
                      {user.usuario.Nome} - {user.funcao}
                    </li>
                  ))}
              </>
            )}
          </ul>
        </div>
      </div>

      <hr
        style={{
          border: "none",
          borderTop: "1px solid #e5e7eb",
          margin: "24px 0",
        }}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-10">
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
