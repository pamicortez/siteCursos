"use client"

import type React from "react"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { ConfirmationModal } from "./ConfirmationModal"
import { useRouter } from "next/navigation"

interface CardProjetoProps {
  idProjeto: number
  imagem: string
  titulo: string
  descricao: string
  categoria: string
  dataInicio: string | Date
  dataFim: string | Date
  isOwner: boolean
  funcaoUsuario?: "Coordenador" | "Colaborador" | "Bolsista" | "Voluntário" | "Nenhuma"
  onProjetoDeleted?: () => void
  maxCaracteres?: number // Opcional, padrão será 74
}

const CardProjeto: React.FC<CardProjetoProps> = ({
  idProjeto,
  imagem,
  titulo,
  descricao,
  categoria,
  dataInicio,
  dataFim,
  isOwner,
  funcaoUsuario,
  onProjetoDeleted,
  maxCaracteres = 74,
}) => {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength).trim() + "."
  }

  // Formatar as datas do projeto
  const formatarData = (data: string | Date) => {
    const date = new Date(data)
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
  }

  // Verifica se a imagem é base64 ou URL
  const isBase64 = imagem?.startsWith("data:image")
  const imageSrc = imagem
    ? isBase64
      ? imagem
      : imagem?.startsWith("/")
        ? imagem
        : `/api/images?url=${encodeURIComponent(imagem)}`
    : "/projeto-default.jpg" // Imagem padrão para projetos

  const handleDelete = async () => {
    setIsDeleting(true)

    try {
      const response = await fetch(`/api/projeto?id=${idProjeto}`, {
        method: "DELETE",
      })

      if (!response.ok) throw new Error("Falha ao excluir projeto")

      onProjetoDeleted?.() || window.location.reload()
    } catch (error) {
      console.error("Erro ao excluir projeto:", error)
      alert("Ocorreu um erro ao excluir o projeto")
    } finally {
      setIsDeleting(false)
      setShowDeleteModal(false)
    }
  }

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation()
    router.push(`/projeto/editar/${idProjeto}`)
  }

  const handleCardClick = () => {
    router.push(`/projeto/${idProjeto}`)
  }

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    setShowDeleteModal(true)
  }

  // Função para obter a cor do badge baseado na categoria (igual ao CardCurso)
  const getCategoriaBadgeColor = (categoria: string) => {
    switch (categoria) {
      case "LinguagensLetrasEComunicacao":
        return "bg-blue-100 text-blue-800"
      case "ArtesECultura":
        return "bg-purple-100 text-purple-800"
      case "CienciasAgrarias":
        return "bg-green-100 text-green-800"
      case "PesquisaEInovacao":
        return "bg-violet-100 text-violet-800"
      case "ServicosSociasEComunitarios":
        return "bg-pink-100 text-pink-800"
      case "GestaoEPlanejamento":
        return "bg-slate-100 text-slate-800"
      case "CienciasSociaisAplicadasANegocios":
        return "bg-indigo-100 text-indigo-800"
      case "ComunicacaoEInformacao":
        return "bg-cyan-100 text-cyan-800"
      case "CienciasBiologicasENaturais":
        return "bg-emerald-100 text-emerald-800"
      case "EngenhariaEProducao":
        return "bg-orange-100 text-orange-800"
      case "TecnologiaEComputacao":
        return "bg-violet-100 text-violet-800"
      case "ProducaoEConstrucao":
        return "bg-amber-100 text-amber-800"
      case "SaudeEBemEstar":
        return "bg-red-100 text-red-800"
      case "EducacaoEFormacaoDeProfessores":
        return "bg-yellow-100 text-yellow-800"
      case "NegociosAdministracaoEDireito":
        return "bg-stone-100 text-stone-800"
      case "CienciasExatas":
        return "bg-indigo-100 text-indigo-800"
      case "CienciasHumanas":
        return "bg-rose-100 text-rose-800"
      case "MeioAmbienteESustentabilidade":
        return "bg-teal-100 text-teal-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  // Função para formatar o nome da categoria para exibição (igual ao CardCurso)
  // const formatarCategoria = (categoria: string) => {
  //   const categoriaMap: { [key: string]: string } = {
  //     "LinguagensLetrasEComunicacao": "Linguagens e Letras",      // 18 chars
  //     "ArtesECultura": "Artes e Cultura",                         // 15 chars
  //     "CienciasAgrarias": "Ciências Agrárias",                    // 17 chars
  //     "PesquisaEInovacao": "Pesquisa e Inovação",                 // 19 chars
  //     "ServicosSociasEComunitarios": "Serviços Sociais",          // 16 chars
  //     "GestaoEPlanejamento": "Gestão e Planejamento",             // 21 chars
  //     "CienciasSociaisAplicadasANegocios": "Ciências Soc. Aplicadas", // 23 chars
  //     "ComunicacaoEInformacao": "Comunicação e Info.",             // 18 chars
  //     "CienciasBiologicasENaturais": "Ciências Biológicas",       // 19 chars
  //     "EngenhariaEProducao": "Engenharia e Produção",             // 21 chars
  //     "TecnologiaEComputacao": "Tecnologia e Comp.",              // 17 chars
  //     "ProducaoEConstrucao": "Produção e Construção",             // 20 chars
  //     "SaudeEBemEstar": "Saúde e Bem-estar",                      // 17 chars
  //     "EducacaoEFormacaoDeProfessores": "Educação e Formação",    // 18 chars
  //     "NegociosAdministracaoEDireito": "Neg., Adm. e Direito",    // 19 chars
  //     "CienciasExatas": "Ciências Exatas",                        // 15 chars
  //     "CienciasHumanas": "Ciências Humanas",                      // 16 chars
  //     "MeioAmbienteESustentabilidade": "Meio Amb. e Sustent."     // 19 chars
  //   }
  //   return categoriaMap[categoria] || categoria
  // }

  // Função para obter a cor do badge baseado na função do usuário
  const getFuncaoBadgeColor = (funcao?: string) => {
    switch (funcao) {
      case "Coordenador":
        return "bg-purple-100 text-purple-800"
      case "Colaborador":
        return "bg-blue-100 text-blue-800"
      case "Bolsista":
        return "bg-green-100 text-green-800"
      case "Voluntário":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  // Determinar o status do projeto usando uma única referência de tempo
  const now = new Date()
  const inicio = new Date(dataInicio)
  const fim = new Date(dataFim)

  const isProjetoAtivo = now >= inicio && now <= fim
  const statusProjeto = isProjetoAtivo ? "Ativo" : now > fim ? "Finalizado" : "Não Iniciado"

  // Apenas coordenadores podem editar/deletar projetos
  // const canEditProject = funcaoUsuario === "Coordenador"
  const canEditProject = isOwner

  return (
    <>
      <div
        className="bg-white rounded-lg shadow-md overflow-hidden relative cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-lg h-90 flex flex-col"
        style={{ width: "14rem", margin: "0 auto" }}
        onClick={handleCardClick}
      >
        {/* Imagem com fallback */}
        <div className="w-full h-32 overflow-hidden flex-shrink-0">
          <img
            src={imageSrc || "/placeholder.svg?height=128&width=224"}
            className="w-full h-full object-cover"
            alt={titulo}
            onError={(e) => {
              ; (e.target as HTMLImageElement).src = "/placeholder.svg?height=128&width=224"
            }}
          />
        </div>

        <div className="p-4 flex-1 flex flex-col">
          <div className="flex justify-between items-start mb-2 flex-shrink-0">
            <h5 className="text-lg font-semibold line-clamp-2 flex-1 mr-2 overflow-hidden">{titulo}</h5>
            {funcaoUsuario && (
              <span
                className={cn(
                  "px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap flex-shrink-0",
                  getFuncaoBadgeColor(funcaoUsuario),
                )}
              >
                {funcaoUsuario}
              </span>
            )}
          </div>

          {/* Categoria e Status - Layout original */}
          <div className="flex justify-between items-center mb-2 flex-shrink-0">
            <span
              className={cn(
                "px-2 py-1 rounded-full text-xs font-medium flex-shrink-0 line-clamp-1",
                getCategoriaBadgeColor(categoria)
              )}
            >
              {/* {formatarCategoria(categoria)} */}
              {truncateText(categoria, 14)}
            </span>
            <span
              className={cn(
                "px-2 py-1 rounded-full text-xs font-medium",
                statusProjeto === "Ativo"
                  ? "bg-green-100 text-green-800"
                  : statusProjeto === "Finalizado"
                    ? "bg-red-100 text-red-800"
                    : "bg-yellow-100 text-yellow-800",
              )}
            >
              {statusProjeto}
            </span>
          </div>

          <div className="h-12 mb-2 flex-shrink-0">
            <p className="text-sm text-gray-700 line-clamp-2 overflow-hidden">
              {descricao}
            </p>
          </div>

          {/* Período do projeto */}
          <div className="text-xs text-gray-500 mb-3 font-medium flex-shrink-0">
            <p>
              {formatarData(dataInicio)} - {formatarData(dataFim)}
            </p>
          </div>

          {/* Botões de ação apenas para coordenadores */}
          {canEditProject && (
            <div className="flex justify-between flex-shrink-0" onClick={(e) => e.stopPropagation()}>
              <button
                className="p-0 border-none bg-transparent cursor-pointer hover:opacity-70 transition-opacity"
                onClick={handleEdit}
                aria-label="Editar projeto"
              >
                <img src="/pen.png" alt="Editar" className="w-6 h-6" />
              </button>
              <button
                className="p-0 border-none bg-transparent cursor-pointer hover:opacity-70 transition-opacity"
                onClick={handleDeleteClick}
                disabled={isDeleting}
                aria-label="Excluir projeto"
              >
                <img src="/trash.png" alt="Excluir" className={cn("w-6 h-6", isDeleting && "opacity-50")} />
              </button>
            </div>
          )}
        </div>
      </div>

      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        title={`Excluir "${titulo}"?`}
        message="Tem certeza que deseja excluir este projeto? Esta ação não pode ser desfeita e todos os cursos associados também serão removidos."
        confirmText={isDeleting ? "Excluindo..." : "Confirmar Exclusão"}
        cancelText="Cancelar"
        variant="destructive"
      />
    </>
  )
}

export default CardProjeto