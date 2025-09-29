"use client"
import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import Carrossel from "@/components/Carrossel"
import { useParams, useRouter } from "next/navigation"
import CardEvento from "@/components/CardEvento"
import CardProjeto from "@/components/CardProjeto"

interface Usuario {
  id: number
  email: string
  fotoPerfil: string
  Nome: string
  Titulacao: string
  instituicaoEnsino: string
  formacaoAcademica: string
  resumoPessoal: string
  tipo: string
  createdAt: string
  link: Array<{
    id: number
    link: string
    tipo: string
  }>
  publicacao: Array<{
    id: number
    descricao: string
    link: string
  }>
  carreira: Array<{
    id: number
    nome: string
    descricao: string
    categoria: string
    dataInicio: string
    dataFim: string
  }>
}

interface Projeto {
  id: number
  titulo: string
  imagem: string
  descricao: string
  categoria: string
  dataInicio: string
  dataFim: string
  funcaoUsuario?: "Coordenador" | "Colaborador" | "Bolsista" | "Voluntário"
  isOwner?: boolean
}

interface Evento {
  id: number
  titulo: string
  descricao: string
  dataInicio: string
  dataFim: string
  linkParticipacao?: string | null
  local: string
  imagemEvento: Array<{
    id: number
    link: string
  }>
}

export default function UsuarioProfilePage() {
  const params = useParams()
  const router = useRouter()
  const { data: session, status } = useSession()
  const [usuario, setUsuario] = useState<Usuario | null>(null)
  const [projetos, setProjetos] = useState<Projeto[]>([])
  const [eventos, setEventos] = useState<Evento[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Função auxiliar para fazer requests com tratamento de erro
  const fetchWithErrorHandling = async (url: string) => {
    try {
      const response = await fetch(url)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const contentType = response.headers.get("content-type")
      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text()
        console.error("Response is not JSON:", text)
        throw new Error("Response is not valid JSON")
      }

      return await response.json()
    } catch (error) {
      console.error(`Error fetching ${url}:`, error)
      throw error
    }
  }

  // Carregar dados do usuário
  useEffect(() => {
    const fetchUsuario = async () => {
      const resolvedParams = await params
      const userId = resolvedParams.id

      if (!userId || isNaN(Number(userId))) {
        setError("ID de usuário inválido")
        setLoading(false)
        return
      }

      try {
        setError(null)
        const data = await fetchWithErrorHandling(`/api/usuario?id=${userId}`)

        if (!data) {
          setError("Usuário não encontrado")
          return
        }

        setUsuario(data)
      } catch (error) {
        console.error("Erro ao carregar usuário:", error)
        setError("Erro ao carregar dados do usuário")
      } finally {
        setLoading(false)
      }
    }

    fetchUsuario()
  }, [params])

  // Carregar projetos do usuário
  useEffect(() => {
    const fetchProjetos = async () => {
      const resolvedParams = await params
      const userId = resolvedParams.id

      if (userId && !isNaN(Number(userId))) {
        try {
          const data = await fetchWithErrorHandling(`/api/usuario/${userId}/projetos`)
          setProjetos(Array.isArray(data) ? data : [])
        } catch (error) {
          console.error("Erro ao carregar projetos:", error)
          setProjetos([])
        }
      }
    }

    fetchProjetos()
  }, [params])

  // Carregar eventos do usuário
  useEffect(() => {
    const fetchEventos = async () => {
      const resolvedParams = await params
      const userId = resolvedParams.id

      if (userId && !isNaN(Number(userId))) {
        try {
          const data = await fetchWithErrorHandling(`/api/usuario/${userId}/eventos`)
          setEventos(Array.isArray(data) ? data : [])
        } catch (error) {
          console.error("Erro ao carregar eventos:", error)
          setEventos([])
        }
      }
    }

    fetchEventos()
  }, [params])

  const isOwnProfile = usuario && session?.user?.id && Number(usuario.id) === Number(session.user.id)

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString("pt-BR")
    } catch (error) {
      console.error("Erro ao formatar data:", error)
      return "Data inválida"
    }
  }

  const handleProjetoClick = (projetoId: number) => {
    router.push(`/projeto/${projetoId}`)
  }

  const handleEventoClick = (eventoId: number) => {
    router.push(`/evento/${eventoId}`)
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-red-600 mb-2">Erro</h2>
          <p className="text-gray-700">{error}</p>
          <button
            onClick={() => router.back()}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            Voltar
          </button>
        </div>
      </div>
    )
  }

  if (!usuario) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-700">Usuário não encontrado.</h2>
          <button
            onClick={() => router.back()}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            Voltar
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-800">Docente</h1>
            <button
              onClick={() => router.back()}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition"
            >
              Voltar
            </button>
          </div>
        </div>

        {/* Foto de Perfil e Informações Básicas */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
            {/* Foto de Perfil */}
            <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
              {usuario.fotoPerfil ? (
                <img
                  src={usuario.fotoPerfil || "/placeholder.svg?height=128&width=128"}
                  alt="Foto de perfil"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-gray-400 text-4xl">👤</div>
              )}
            </div>

            {/* Informações Básicas */}
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">{usuario.Nome}</h2>
              <p className="text-gray-600 mb-1">{usuario.email}</p>
              <p className="text-gray-600 mb-1">{usuario.Titulacao}</p>
              <p className="text-gray-600 mb-1">{usuario.instituicaoEnsino}</p>
              <p className="text-gray-600 mb-3">{usuario.formacaoAcademica}</p>
              {usuario.resumoPessoal && (
                <p className="text-gray-700 text-sm bg-gray-50 p-3 rounded-md">{usuario.resumoPessoal}</p>
              )}
              <div className="mt-3">
                <span
                  className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${usuario.tipo === "Normal"
                      ? "bg-green-100 text-green-800"
                      : usuario.tipo === "Super"
                        ? "bg-blue-100 text-blue-800"
                        : usuario.tipo === "Pendente"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                    }`}
                >
                  {usuario.tipo}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Carrossel de Projetos */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">Projetos ({projetos.length})</h3>
          {projetos.length > 0 ? (
            <Carrossel>
              {projetos.map((projeto) => (
                <div
                  key={projeto.id}
                  onClick={() => handleProjetoClick(projeto.id)}
                  className="flex-shrink-0 w-80 h-full hover:scale-105 transition-transform duration-300 cursor-pointer"
                >
                  <CardProjeto
                    idProjeto={projeto.id}
                    imagem={projeto.imagem}
                    titulo={projeto.titulo}
                    descricao={projeto.descricao}
                    categoria={projeto.categoria}
                    dataInicio={projeto.dataInicio}
                    dataFim={projeto.dataFim}
                    isOwner={false}
                    funcaoUsuario={projeto.funcaoUsuario}
                    isAuthenticated={!!isOwnProfile}
                  />
                </div>
              ))}
            </Carrossel>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>Nenhum projeto encontrado.</p>
            </div>
          )}
        </div>

        {/* Carrossel de Eventos */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">Eventos ({eventos.length})</h3>
          {eventos.length > 0 ? (
            <Carrossel>
              {eventos.map((evento) => (
                <div key={evento.id} className="flex-shrink-0 w-80 h-full mt-1">
                  <div className="h-112">
                    <CardEvento
                      key={evento.id}
                      idEvento={evento.id}
                      titulo={evento.titulo}
                      descricao={evento.descricao}
                      dataInicio={evento.dataInicio}
                      dataFim={evento.dataFim}
                      linkParticipacao={evento.linkParticipacao || null}
                      local={evento.local}
                      imagens={evento.imagemEvento?.map((img) => img.link) || ["/event_lecture.jpg"]}
                      isOwner={false}
                    />
                  </div>
                </div>
              ))}
            </Carrossel>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>Nenhum evento encontrado.</p>
            </div>
          )}
        </div>

        {/* Informações Adicionais - Apenas Visualização */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Links */}
          {usuario?.link && usuario.link.length > 0 && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold mb-4">Links ({usuario.link.length})</h3>
              <div className="space-y-2 max-h-64 overflow-y-auto pr-2">
                {usuario.link.map((link) => (
                  <div key={link.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span className="text-sm font-medium text-gray-600">{link.tipo}</span>
                    <a
                      href={link.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 truncate ml-2"
                    >
                      {link.link}
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Publicações */}
          {usuario.publicacao && usuario.publicacao.length > 0 && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold mb-4">Publicações ({usuario.publicacao.length})</h3>
              <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
                {usuario.publicacao.map((pub) => (
                  <div key={pub.id} className="p-3 bg-gray-50 rounded">
                    <p className="text-sm text-gray-700 mb-2">{pub.descricao}</p>
                    <a
                      href={pub.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 text-sm"
                    >
                      Ver publicação →
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Carreira */}
        {usuario.carreira && usuario.carreira.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6 mt-6">
            <h3 className="text-xl font-semibold mb-4">Experiência</h3>
            <div className="space-y-4">
              {usuario.carreira.map((exp) => (
                <div key={exp.id} className="border-l-4 border-blue-500 pl-4">
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="font-semibold text-gray-800">{exp.nome}</h4>
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${exp.categoria === "acadêmica" ? "bg-blue-100 text-blue-800" : "bg-green-100 text-green-800"
                        }`}
                    >
                      {exp.categoria}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm mb-2">
                    {formatDate(exp.dataInicio)} - {formatDate(exp.dataFim)}
                  </p>
                  <p className="text-gray-700 text-sm">{exp.descricao}</p>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
