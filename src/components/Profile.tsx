"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Carrossel from "@/components/Carrossel"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import ImageCropper from "@/components/ui/ImageCropper"
import CardEvento from "@/components/CardEvento"
import CardProjeto from "@/components/CardProjeto"
import { LinkIcon, FileText, Building } from "lucide-react"

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
  projetoColaborador: Array<{
    id: number
    categoria: string
  }>
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
  eventoUsuario: Array<{
    id: number
    tipoParticipacao: string
  }>
}

function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText,
  variant = 'default'
}: {
  isOpen: boolean;
  onClose?: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText: string;
  variant?: 'default' | 'destructive';
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-md w-full shadow-xl border border-gray-200">
        <h2 className="text-xl font-bold mb-4">{title}</h2>
        <p className="mb-6">{message}</p>
        <div className="flex justify-end gap-4">
          {onClose && (
            <button
              className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition"
              onClick={onClose}
            >
              Continuar editando
            </button>
          )}
          <button
            className={`px-4 py-2 rounded-md transition ${variant === 'destructive'
              ? 'bg-red-600 text-white hover:bg-red-700'
              : 'bg-gray-900 text-white hover:bg-gray-700'
              }`}
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [usuario, setUsuario] = useState<Usuario | null>(null)
  const [projetos, setProjetos] = useState<Projeto[]>([])
  const [eventos, setEventos] = useState<Evento[]>([])
  const [loading, setLoading] = useState(true)
  const [editMode, setEditMode] = useState(false)
  const [showImageCropper, setShowImageCropper] = useState(false)
  const [isModalClosing, setIsModalClosing] = useState(false)
  // const [error, setError] = useState<string | null>(null)
  const [showResultDialog, setShowResultDialog] = useState(false)
  const [resultDialog, setResultDialog] = useState({
    title: '',
    message: '',
    isError: false,
  })
  const [formData, setFormData] = useState({
    Nome: "",
    email: "",
    Titulacao: "",
    instituicaoEnsino: "",
    formacaoAcademica: "",
    resumoPessoal: "",
    links: [] as Array<{ id?: number; tipo: string; link: string }>,
    publicacoes: [] as Array<{ id?: number; descricao: string; link: string }>,
    carreira: [] as Array<{
      id?: number
      nome: string
      descricao: string
      categoria: string
      dataInicio: string
      dataFim: string
    }>,
  })

  // Função auxiliar para fazer requests com tratamento de erro
  const fetchWithErrorHandling = async (url: string) => {
    try {
      const response = await fetch(url)

      // Verifica se a resposta é bem-sucedida
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      // Verifica o Content-Type para garantir que é JSON
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

  // Redirect se não estiver logado
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
    }
  }, [status, router])

  // Carregar dados do usuário
  useEffect(() => {
    const fetchUsuario = async () => {
      if (session?.user?.id) {
        try {
          //setError(null)
          const data = await fetchWithErrorHandling(`/api/usuario?id=${session.user.id}`)
          setUsuario(data)
          setFormData({
            Nome: data.Nome || "",
            email: data.email || "",
            Titulacao: data.Titulacao || "",
            instituicaoEnsino: data.instituicaoEnsino || "",
            formacaoAcademica: data.formacaoAcademica || "",
            resumoPessoal: data.resumoPessoal || "",
            links: data.link || [],
            publicacoes: data.publicacao || [],
            carreira: data.carreira || [],
          })
        } catch (error) {
          console.error("Erro ao carregar usuário:", error)
          //setError("Erro ao carregar dados do usuário")
          setResultDialog({
            title: 'Erro',
            message: "Erro ao carregar dados do usuário",
            isError: true,
          })
          setShowResultDialog(true)
        } finally {
          setLoading(false)
        }
      }
    }

    fetchUsuario()
  }, [session])

  // Carregar projetos do usuário - CORRIGIDO: usando endpoint correto baseado no schema
  useEffect(() => {
    const fetchProjetos = async () => {
      if (session?.user?.id) {
        try {
          // Busca projetos através da tabela de relacionamento projetoUsuario
          const data = await fetchWithErrorHandling(`/api/usuario/${session.user.id}/projetos`)
          setProjetos(Array.isArray(data) ? data : [])
        } catch (error) {
          console.error("Erro ao carregar projetos:", error)
          // Em caso de erro 404, define array vazio
          setProjetos([])
        }
      }
    }

    fetchProjetos()
  }, [session])

  // Carregar eventos do usuário - CORRIGIDO: usando endpoint correto baseado no schema
  useEffect(() => {
    const fetchEventos = async () => {
      if (session?.user?.id) {
        try {
          // Busca eventos através da tabela de relacionamento eventoUsuario
          const data = await fetchWithErrorHandling(`/api/usuario/${session.user.id}/eventos`)
          setEventos(Array.isArray(data) ? data : [])
        } catch (error) {
          console.error("Erro ao carregar eventos:", error)
          // Em caso de erro 404, define array vazio
          setEventos([])
        }
      }
    }

    fetchEventos()
  }, [session])

  useEffect(() => {
    console.log("Debug - Projetos:", projetos)
    console.log("Debug - Eventos:", eventos)
    console.log("Debug - Usuario:", usuario)
  }, [projetos, eventos, usuario])

  useEffect(() => {
    console.log("Session changed:", { status, session })

    if (status === "unauthenticated") {
      console.log("User is not authenticated, redirecting to login")
      router.push("/login")
    }

    if (status === "authenticated" && !session?.user?.id) {
      console.warn("Session exists but user ID is missing")
    }
  }, [status, session, router])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // Função para adicionar item ao array
  const addArrayItem = (arrayName: "links" | "publicacoes" | "carreira") => {
    setFormData((prev) => ({
      ...prev,
      [arrayName]: [
        ...prev[arrayName],
        arrayName === "links"
          ? { tipo: "Linkedin", link: "" }
          : arrayName === "publicacoes"
            ? { descricao: "", link: "" }
            : { nome: "", descricao: "", categoria: "acadêmica", dataInicio: "", dataFim: "" },
      ],
    }))
  }

  // Função para remover item do array
  const removeArrayItem = (arrayName: "links" | "publicacoes" | "carreira", index: number) => {
    setFormData((prev) => ({
      ...prev,
      [arrayName]: prev[arrayName].filter((_, i) => i !== index),
    }))
  }

  // Função para alterar item específico do array
  const handleArrayInputChange = (
    arrayName: "links" | "publicacoes" | "carreira",
    index: number,
    field: string,
    value: string,
  ) => {
    setFormData((prev) => ({
      ...prev,
      [arrayName]: prev[arrayName].map((item, i) => (i === index ? { ...item, [field]: value } : item)),
    }))
  }

  const handleSuccessConfirm = () => {
    setShowResultDialog(false)
  }

  // FUNÇÃO CORRIGIDA - handleSave
  const handleSave = async () => {
    try {
      setLoading(true)
      //setError(null)

      // Verificar se o usuário está autenticado
      if (!session?.user?.id) {
        //setError("Você precisa estar logado para editar seu perfil")
        setResultDialog({
          title: 'Erro',
          message: "Você precisa estar logado para editar seu perfil",
          isError: true,
        })
        setShowResultDialog(true)
        return
      }

      // Validar dados básicos antes de enviar
      if (!formData.Nome.trim()) {
        //setError("Nome é obrigatório")
        setResultDialog({
          title: 'Erro',
          message: "Nome é obrigatório",
          isError: true,
        })
        setShowResultDialog(true)
        return
      }

      if (!formData.email.trim()) {
        //setError("Email é obrigatório")
        setResultDialog({
          title: 'Erro',
          message: "Email é obrigatório",
          isError: true,
        })
        setShowResultDialog(true)
        return
      }

      // Validar formato do email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(formData.email)) {
        //setError("Email inválido")
        setResultDialog({
          title: 'Erro',
          message: "Email inválido",
          isError: true,
        })
        setShowResultDialog(true)
        return
      }

      // Preparar todos os dados em um único objeto
      const allUserData = {
        // Dados básicos do usuário (apenas os que foram alterados)
        ...(formData.Nome !== usuario?.Nome && { Nome: formData.Nome.trim() }),
        ...(formData.email !== usuario?.email && { email: formData.email.toLowerCase().trim() }),
        ...(formData.Titulacao !== usuario?.Titulacao && { Titulacao: formData.Titulacao }),
        ...(formData.instituicaoEnsino !== usuario?.instituicaoEnsino && {
          instituicaoEnsino: formData.instituicaoEnsino.trim(),
        }),
        ...(formData.formacaoAcademica !== usuario?.formacaoAcademica && {
          formacaoAcademica: formData.formacaoAcademica.trim(),
        }),
        ...(formData.resumoPessoal !== usuario?.resumoPessoal && {
          resumoPessoal: formData.resumoPessoal.trim(),
        }),

        // Arrays relacionados - filtrar apenas itens válidos
        links: formData.links
          .filter((link) => link.link.trim() !== "" && link.tipo.trim() !== "")
          .map((link) => ({
            tipo: link.tipo.trim(),
            link: link.link.trim(),
            ...(link.id && { id: link.id }),
          })),

        publicacoes: formData.publicacoes
          .filter((pub) => pub.descricao.trim() !== "" && pub.link.trim() !== "")
          .map((pub) => ({
            descricao: pub.descricao.trim(),
            link: pub.link.trim(),
            ...(pub.id && { id: pub.id }),
          })),

        carreira: formData.carreira
          .filter(
            (exp) =>
              exp.nome.trim() !== "" &&
              exp.descricao.trim() !== "" &&
              exp.categoria.trim() !== "" &&
              exp.dataInicio.trim() !== "" &&
              exp.dataFim.trim() !== "",
          )
          .map((exp) => ({
            nome: exp.nome.trim(),
            descricao: exp.descricao.trim(),
            categoria: exp.categoria.trim(),
            dataInicio: exp.dataInicio,
            dataFim: exp.dataFim,
            ...(exp.id && { id: exp.id }),
          })),
      }

      console.log("Dados sendo enviados:", allUserData)

      // Fazer a requisição com headers corretos e aguardar a sessão ser válida
      const response = await fetch(`/api/usuario/editar?id=${session.user.id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Importante: incluir cookies de sessão
        body: JSON.stringify(allUserData),
      })

      // Verificar se a resposta está OK antes de tentar fazer parse
      if (!response.ok) {
        let errorMessage = `Erro ${response.status}: ${response.statusText}`

        try {
          const errorData = await response.json()
          errorMessage = errorData.error || errorMessage
        } catch (parseError) {
          console.warn("Não foi possível fazer parse do erro:", parseError)
        }

        // Tratar diferentes códigos de status
        switch (response.status) {
          case 401:
            //setError("Sessão expirada. Faça login novamente.")
            setResultDialog({
              title: 'Erro',
              message: "Sessão expirada. Faça login novamente.",
              isError: true,
            })
            setShowResultDialog(true)
            // Opcional: redirecionar para login após um delay
            setTimeout(() => router.push("/login"), 2000)
            return
          case 403:
            //setError("Você não tem permissão para editar este perfil.")
            setResultDialog({
              title: 'Erro',
              message: "Você não tem permissão para editar este perfil.",
              isError: true,
            })
            setShowResultDialog(true)
            return
          case 409:
            //setError("Este email já está sendo usado por outro usuário.")
            setResultDialog({
              title: 'Erro',
              message: "Este email já está sendo usado por outro usuário.",
              isError: true,
            })
            setShowResultDialog(true)
            return
          case 400:
            //setError(`Erro de validação: ${errorMessage}`)
            setResultDialog({
              title: 'Erro',
              message: `Erro de validação: ${errorMessage}`,
              isError: true,
            })
            setShowResultDialog(true)
            return
          default:
            throw new Error(errorMessage)
        }
      }

      // Parse da resposta de sucesso
      const data = await response.json()

      // Verificar se os dados foram retornados corretamente
      if (!data || !data.id) {
        throw new Error("Nenhum dado válido foi retornado do servidor")
      }

      // Atualizar estado local com dados atualizados
      setUsuario(data)
      setFormData({
        Nome: data.Nome || "",
        email: data.email || "",
        Titulacao: data.Titulacao || "",
        instituicaoEnsino: data.instituicaoEnsino || "",
        formacaoAcademica: data.formacaoAcademica || "",
        resumoPessoal: data.resumoPessoal || "",
        links: data.link || [],
        publicacoes: data.publicacao || [],
        carreira: data.carreira || [],
      })

      setEditMode(false)
      //setError(null)

      setResultDialog({
        title: 'Sucesso!',
        message: 'Perfil atualizado com sucesso.',
        isError: false,
      })
      setShowResultDialog(true)
    } catch (error: any) {
      console.error("Erro ao atualizar perfil:", error)

      // Tratamento de erro mais específico
      if (error.name === "TypeError" && error.message.includes("fetch")) {
        //setError("Erro de conexão. Verifique sua internet e tente novamente.")
        setResultDialog({
          title: 'Erro',
          message: "Erro de conexão. Verifique sua internet e tente novamente.",
          isError: true,
        })
        setShowResultDialog(true)
      } else if (error.message.includes("JSON")) {
        //setError("Erro no formato dos dados. Tente novamente.")
        setResultDialog({
          title: 'Erro',
          message: "Erro no formato dos dados. Tente novamente.",
          isError: true,
        })
        setShowResultDialog(true)
      } else if (error.message.includes("NetworkError") || error.message.includes("Failed to fetch")) {
        //setError("Erro de rede. Verifique sua conexão e tente novamente.")
        setResultDialog({
          title: 'Erro',
          message: "Erro de rede. Verifique sua conexão e tente novamente.",
          isError: true,
        })
        setShowResultDialog(true)
      } else {
        //setError(error.message || "Erro ao atualizar perfil. Tente novamente.")
        setResultDialog({
          title: 'Erro',
          message: error.message || "Erro ao atualizar perfil. Tente novamente.",
          isError: true,
        })
        setShowResultDialog(true)
      }
    } finally {
      setLoading(false)
    }
  }

  const handleImageUploadSuccess = (newImageBase64: string) => {
    setUsuario((prev) => (prev ? { ...prev, fotoPerfil: newImageBase64 } : null))
    handleCloseModal()
  }

  const handleCloseModal = () => {
    setIsModalClosing(true)
    setTimeout(() => {
      setShowImageCropper(false)
      setIsModalClosing(false)
    }, 700) // Duração da animação de fade out
  }

  const isValidTipoParticipacao = (tipo: string): tipo is "Ouvinte" | "Palestrante" | "Organizador" => {
    return ["Ouvinte", "Palestrante", "Organizador"].includes(tipo)
  }

  const isValidCategoria = (tipo: string): tipo is "Coordenador" | "Colaborador" | "Bolsista" | "Voluntário" => {
    return ["Coordenador", "Colaborador", "Bolsista", "Voluntário"].includes(tipo)
  }

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

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  // if (error) {
  //   return (
  //     <div className="min-h-screen flex items-center justify-center">
  //       <div className="text-center">
  //         <h2 className="text-xl font-semibold text-red-600 mb-2">Erro</h2>
  //         <p className="text-gray-700">{error}</p>
  //         <button
  //           onClick={() => window.location.reload()}
  //           className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
  //         >
  //           Tentar novamente
  //         </button>
  //       </div>
  //     </div>
  //   )
  // }

  if (!usuario) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-700">Usuário não encontrado</h2>
          <button
            onClick={() => router.push("/login")}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            Voltar ao Login
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
            <h1 className="text-3xl font-bold text-gray-800">Meu Perfil</h1>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              {editMode ? (
                <>
                  <button
                    onClick={handleSave}
                    disabled={loading}
                    className="px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-600 transition disabled:opacity-50"
                  >
                    {loading ? "Salvando..." : "Salvar"}
                  </button>
                  <button
                    onClick={() => setEditMode(false)}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition"
                  >
                    Cancelar
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setEditMode(true)}
                  className="px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-600 transition"
                >
                  Editar Perfil
                </button>
              )}
            </div>
          </div>
          {/* {error && <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">{error}</div>} */}
        </div>

        {/* Foto de Perfil e Informações Básicas */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
            {/* Foto de Perfil */}
            <div className="relative group">
              <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                {usuario.fotoPerfil ? (
                  <img
                    src={usuario.fotoPerfil || "/placeholder.svg"}
                    alt="Foto de perfil"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-gray-400 text-4xl">👤</div>
                )}
              </div>
              <button
                onClick={() => setShowImageCropper(true)}
                className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
              >
                📷
              </button>
            </div>

            {/* Informações Básicas */}
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">{usuario.Nome}</h2>
              <p className="text-gray-600 mb-1">{usuario.email}</p>
              <p className="text-gray-600 mb-1">{usuario.Titulacao}</p>
              <p className="text-gray-600 mb-1">{usuario.instituicaoEnsino}</p>
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

        {/* Formulário de Edição */}
        {editMode && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h3 className="text-xl font-semibold mb-4">Editar Informações</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
                <input
                  type="text"
                  name="Nome"
                  value={formData.Nome}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Titulação</label>
                <select
                  name="Titulacao"
                  value={formData.Titulacao}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Bacharel">Bacharel</option>
                  <option value="Licenciado">Licenciado</option>
                  <option value="Especialista">Especialista</option>
                  <option value="Mestre">Mestre</option>
                  <option value="Doutor">Doutor</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Instituição de Ensino</label>
                <input
                  type="text"
                  name="instituicaoEnsino"
                  value={formData.instituicaoEnsino}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Formação Acadêmica</label>
                <input
                  type="text"
                  name="formacaoAcademica"
                  value={formData.formacaoAcademica}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Resumo Pessoal</label>
                <textarea
                  name="resumoPessoal"
                  value={formData.resumoPessoal}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="space-y-6">
              <h3 className="text-xl font-semibold mb-4 text-gray-800">Experiência e Links (Opcional)</h3>

              {/* Links */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-gray-700">
                    <LinkIcon className="inline w-4 h-4 mr-1" />
                    Links Profissionais
                  </h4>
                  <button
                    type="button"
                    onClick={() => addArrayItem("links")}
                    className="px-3 py-1 bg-black text-white text-sm rounded hover:bg-gray-700"
                  >
                    + Adicionar Link
                  </button>
                </div>

                {formData.links.map((link, index) => (
                  <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-2">
                    <select
                      value={link.tipo}
                      onChange={(e) => handleArrayInputChange("links", index, "tipo", e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Linkedin">LinkedIn</option>
                      <option value="Instragram">Instagram</option>
                      <option value="Facebook">Facebook</option>
                      <option value="Whatsapp">WhatsApp</option>
                      <option value="Genérico">Website</option>
                    </select>
                    <input
                      type="url"
                      value={link.link}
                      onChange={(e) => handleArrayInputChange("links", index, "link", e.target.value)}
                      placeholder="https://..."
                      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      type="button"
                      onClick={() => removeArrayItem("links", index)}
                      className="px-3 py-1 bg-black text-white rounded hover:bg-gray-700"
                    >
                      Remover
                    </button>
                  </div>
                ))}
              </div>

              {/* Publications */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-gray-700">
                    <FileText className="inline w-4 h-4 mr-1" />
                    Publicações
                  </h4>
                  <button
                    type="button"
                    onClick={() => addArrayItem("publicacoes")}
                    className="px-3 py-1 bg-black text-white text-sm rounded hover:bg-gray-700"
                  >
                    + Adicionar Publicação
                  </button>
                </div>

                {formData.publicacoes.map((pub, index) => (
                  <div key={index} className="space-y-2 mb-4 p-3 border border-gray-200 rounded">
                    <input
                      type="text"
                      value={pub.descricao}
                      onChange={(e) => handleArrayInputChange("publicacoes", index, "descricao", e.target.value)}
                      placeholder="Descrição da publicação"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="url"
                      value={pub.link}
                      onChange={(e) => handleArrayInputChange("publicacoes", index, "link", e.target.value)}
                      placeholder="Link da publicação"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      type="button"
                      onClick={() => removeArrayItem("publicacoes", index)}
                      className="px-3 py-1 bg-black text-white rounded hover:bg-gray-700"
                    >
                      Remover
                    </button>
                  </div>
                ))}
              </div>

              {/* Experience */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-gray-700">
                    <Building className="inline w-4 h-4 mr-1" />
                    Experiência Profissional
                  </h4>
                  <button
                    type="button"
                    onClick={() => addArrayItem("carreira")}
                    className="px-3 py-1 bg-black text-white text-sm rounded hover:bg-gray-700"
                  >
                    + Adicionar Experiência
                  </button>
                </div>

                {formData.carreira.map((exp, index) => (
                  <div key={index} className="space-y-2 mb-4 p-3 border border-gray-200 rounded">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={exp.nome}
                        onChange={(e) => handleArrayInputChange("carreira", index, "nome", e.target.value)}
                        placeholder="Nome da posição/cargo"
                        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <select
                        value={exp.categoria}
                        onChange={(e) => handleArrayInputChange("carreira", index, "categoria", e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="acadêmica">Acadêmica</option>
                        <option value="profissional">Profissional</option>
                      </select>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      <input
                        type="date"
                        value={exp.dataInicio}
                        onChange={(e) => handleArrayInputChange("carreira", index, "dataInicio", e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <input
                        type="date"
                        value={exp.dataFim}
                        onChange={(e) => handleArrayInputChange("carreira", index, "dataFim", e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <textarea
                      value={exp.descricao}
                      onChange={(e) => handleArrayInputChange("carreira", index, "descricao", e.target.value)}
                      placeholder="Descrição da experiência"
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      type="button"
                      onClick={() => removeArrayItem("carreira", index)}
                      className="px-3 py-1 bg-black text-white rounded hover:bg-gray-700"
                    >
                      Remover Experiência
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Carrossel de Projetos */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">Meus Projetos ({projetos.length})</h3>
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
                    isOwner={true}
                    funcaoUsuario={
                      projeto.projetoColaborador?.[0]?.categoria &&
                        isValidCategoria(projeto.projetoColaborador[0].categoria)
                        ? projeto.projetoColaborador[0].categoria
                        : undefined
                    }
                    onProjetoDeleted={() => window.location.reload()}
                  />
                </div>
              ))}
            </Carrossel>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>Nenhum projeto encontrado</p>
              <p className="text-sm">Debug: Array length = {projetos.length}</p>
            </div>
          )}
          <button
            onClick={() => router.push("/projeto/criar")}
            className="px-6 py-3 bg-black text-white rounded-md hover:bg-gray-600 transition flex items-center gap-2 mx-auto"
          >
            <span>+</span>
            Criar Novo Projeto
          </button>
        </div>

        {/* Carrossel de Eventos */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">Meus Eventos ({eventos.length})</h3>
          {eventos.length > 0 ? (
            <Carrossel>
              {eventos.map((evento: any) => (
                <div key={evento.id} className="flex-shrink-0 w-80 h-full mt-1">

                  <CardEvento
                    idEvento={evento.id}
                    titulo={evento.titulo}
                    descricao={evento.descricao}
                    data={evento.data}
                    linkParticipacao={evento.linkParticipacao || "#"}
                    imagens={evento.imagemEvento?.map((img: any) => img.link) || []}
                    isOwner={true}
                    tipoParticipacao={
                      evento.eventoUsuario?.[0]?.tipoParticipacao &&
                        isValidTipoParticipacao(evento.eventoUsuario[0].tipoParticipacao)
                        ? evento.eventoUsuario[0].tipoParticipacao
                        : undefined
                    }
                    onEventoDeleted={() => window.location.reload()}
                  />

                </div>
              ))}
            </Carrossel>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>Nenhum evento encontrado</p>
              <p className="text-sm">Debug: Array length = {eventos.length}</p>
            </div>
          )}
          <button
            onClick={() => router.push("/evento/criar")}
            className="px-6 py-3 bg-black text-white rounded-md hover:bg-gray-600 transition flex items-center gap-2 mx-auto"
          >
            <span>+</span>
            Criar Novo Evento
          </button>
        </div>

        {/* Informações Adicionais - Apenas Visualização */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Links */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold mb-4">Links ({usuario?.link?.length || 0})</h3>
            {usuario?.link && usuario.link.length > 0 ? (
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
            ) : (
              <div className="text-center py-4 text-gray-500">
                <p>Nenhum link cadastrado</p>
                <p className="text-sm">
                  Debug: {usuario?.link ? `Array length = ${usuario.link.length}` : "Array is null/undefined"}
                </p>
              </div>
            )}
          </div>

          {/* Publicações */}
          {usuario.publicacao && usuario.publicacao.length > 0 && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold mb-4">Publicações ({usuario?.publicacao?.length || 0})</h3>
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

          {/* Carreira */}
          {usuario.carreira && usuario.carreira.length > 0 && (
            <div className="bg-white rounded-lg shadow-md p-6 lg:col-span-2">
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

        {/* Informações da Conta */}
        <div className="bg-white rounded-lg shadow-md p-6 mt-6">
          <h3 className="text-xl font-semibold mb-4">Informações da Conta</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium text-gray-700">ID:</span>
              <span className="ml-2 text-gray-600">{usuario.id}</span>
            </div>
            <div>
              <span className="font-medium text-gray-700">Membro desde:</span>
              <span className="ml-2 text-gray-600">{formatDate(usuario.createdAt)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Modal do Image Cropper com Animações */}
      {showImageCropper && (
        <div
          className={`fixed inset-0 flex items-center justify-center z-50 p-4 transition-all duration-700 ease-in-out ${isModalClosing
            ? "bg-slate-600/0 backdrop-blur-none opacity-0"
            : "bg-slate-600/40 backdrop-blur-sm opacity-100"
            }`}
          style={{
            backdropFilter: isModalClosing ? "blur(0px)" : "blur(8px)",
            background: isModalClosing ? "rgba(71, 85, 105, 0)" : "rgba(71, 85, 105, 0.4)",
          }}
        >
          <div
            className={`bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto transform transition-all duration-700 ease-in-out ${isModalClosing ? "scale-95 opacity-0 translate-y-4" : "scale-100 opacity-100 translate-y-0"
              }`}
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">Alterar Foto de Perfil</h3>
                <button
                  onClick={handleCloseModal}
                  className="text-gray-400 hover:text-gray-600 text-2xl transition-colors duration-200"
                >
                  ×
                </button>
              </div>
              <ImageCropper userId={session?.user?.id || ""} onUploadSuccess={handleImageUploadSuccess} />
            </div>
          </div>
        </div>
      )}
      <ConfirmationModal
        isOpen={showResultDialog}
        onConfirm={handleSuccessConfirm}
        title={resultDialog.title}
        message={resultDialog.message}
        confirmText="OK"
        variant={resultDialog.isError ? 'destructive' : 'default'}
      />
    </div>
  )
}
