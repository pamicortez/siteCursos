"use client"

import React from "react"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { ConfirmationModal } from "./ConfirmationModal"
import { useRouter } from "next/navigation"

interface CardCursoProps {
  idCurso: number
  imagem: string
  titulo: string
  descricao: string
  categoria: string
  cargaHoraria: number
  vagas: number
  linkInscricao: string
  isOwner: boolean
  onCursoDeleted?: () => void
  maxCaracteres?: number // Opcional, padrão será 74
}

const CardCurso: React.FC<CardCursoProps> = ({
  idCurso,
  imagem,
  titulo,
  descricao,
  categoria,
  cargaHoraria,
  vagas,
  linkInscricao,
  isOwner,
  onCursoDeleted,
  maxCaracteres = 74,
}) => {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [imageSrc, setImageSrc] = useState<string>("/curso-default.jpg")
  const [imageLoaded, setImageLoaded] = useState(false)

  // Função para verificar se a imagem é válida
  const verificarImagem = async (url: string): Promise<boolean> => {
    return new Promise((resolve) => {
      const img = new Image()
      img.onload = () => resolve(true)
      img.onerror = () => resolve(false)
      img.src = url

      // Timeout para evitar travamento em URLs que não respondem
      setTimeout(() => resolve(false), 5000)
    })
  }

  // useEffect para verificar e definir a imagem
  useEffect(() => {
    const definirImagem = async () => {
      if (!imagem) {
        setImageSrc("/curso-default.jpg")
        setImageLoaded(true)
        return
      }

      // Se for base64, usar diretamente
      if (imagem.startsWith("data:image")) {
        setImageSrc(imagem)
        setImageLoaded(true)
        return
      }

      // Construir URL para verificação
      let urlParaVerificar: string
      if (imagem.startsWith("/")) {
        urlParaVerificar = imagem
      } else {
        urlParaVerificar = `/api/images?url=${encodeURIComponent(imagem)}`
      }

      // Verificar se a imagem é válida
      const imagemValida = await verificarImagem(urlParaVerificar)

      if (imagemValida) {
        setImageSrc(urlParaVerificar)
      } else {
        setImageSrc("/curso-default.jpg")
      }

      setImageLoaded(true)
    }

    definirImagem()
  }, [imagem])

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength).trim() + "..."
  }

  const handleDelete = async () => {
    setIsDeleting(true)

    try {
      const response = await fetch(`/api/curso?id=${idCurso}`, {
        method: "DELETE",
      })

      if (!response.ok) throw new Error("Falha ao excluir curso")

      onCursoDeleted?.() || window.location.reload()
    } catch (error) {
      console.error("Erro ao excluir curso:", error)
      alert("Ocorreu um erro ao excluir o curso")
    } finally {
      setIsDeleting(false)
      setShowDeleteModal(false)
    }
  }

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation()
    router.push(`/curso/editar/${idCurso}`)
  }

  const handleCardClick = () => {
    router.push(`/curso/detalhes/${idCurso}`)
  }

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    setShowDeleteModal(true)
  }

  // Função para obter a cor do badge baseado na categoria
  const getCategoriaBadgeColor = (categoria: string) => {
    switch (categoria) {
      case "Agricultura":
        return "bg-green-100 text-green-800"
      case "Silvicultura":
        return "bg-emerald-100 text-emerald-800"
      case "PescaEVeterinaria":
        return "bg-teal-100 text-teal-800"
      case "ArtesEHumanidades":
        return "bg-purple-100 text-purple-800"
      case "CienciasSociais":
        return "bg-pink-100 text-pink-800"
      case "ComunicacaoEInformacao":
        return "bg-blue-100 text-blue-800"
      case "CienciasNaturais":
        return "bg-cyan-100 text-cyan-800"
      case "MatematicaEEstatistica":
        return "bg-indigo-100 text-indigo-800"
      case "ComputacaoETecnologiaDaInformacao":
        return "bg-violet-100 text-violet-800"
      case "Engenharia":
        return "bg-orange-100 text-orange-800"
      case "ProducaoEConstrucao":
        return "bg-amber-100 text-amber-800"
      case "SaudeEBemEstar":
        return "bg-red-100 text-red-800"
      case "Educacao":
        return "bg-yellow-100 text-yellow-800"
      case "NegociosAdministracaoEDireito":
        return "bg-slate-100 text-slate-800"
      case "Servicos":
        return "bg-gray-100 text-gray-800"
      case "ProgramasBasicos":
        return "bg-stone-100 text-stone-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  // Função para formatar o nome da categoria para exibição
  const formatarCategoria = (categoria: string) => {
    const categoriaMap: { [key: string]: string } = {
      "LinguagensLetrasEComunicacao": "Linguagens e Letras",      // 18 chars
      "ArtesECultura": "Artes e Cultura",                         // 15 chars
      "CienciasAgrarias": "Ciências Agrárias",                    // 17 chars
      "PesquisaEInovacao": "Pesquisa e Inovação",                 // 19 chars
      "ServicosSociasEComunitarios": "Serviços Sociais",          // 16 chars
      "GestaoEPlanejamento": "Gestão e Planejamento",             // 21 chars
      "CienciasSociaisAplicadasANegocios": "Ciências Soc. Aplicadas", // 23 chars
      "ComunicacaoEInformacao": "Comunicação e Info.",             // 18 chars
      "CienciasBiologicasENaturais": "Ciências Biológicas",       // 19 chars
      "EngenhariaEProducao": "Engenharia e Produção",             // 21 chars
      "TecnologiaEComputacao": "Tecnologia e Comp.",              // 17 chars
      "ProducaoEConstrucao": "Produção e Construção",             // 20 chars
      "SaudeEBemEstar": "Saúde e Bem-estar",                      // 17 chars
      "EducacaoEFormacaoDeProfessores": "Educação e Formação",    // 18 chars
      "NegociosAdministracaoEDireito": "Neg., Adm. e Direito",    // 19 chars
      "CienciasExatas": "Ciências Exatas",                        // 15 chars
      "CienciasHumanas": "Ciências Humanas",                      // 16 chars
      "MeioAmbienteESustentabilidade": "Meio Amb. e Sustent."     // 19 chars
    }
    return categoriaMap[categoria] || categoria
  }

  // Determinar se há vagas disponíveis
  const hasVagas = vagas > 0
  const statusVagas = hasVagas ? `${vagas} vagas` : "Esgotado"

  return (
    <>
      <div
        className="bg-white rounded-lg shadow-md overflow-hidden relative cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"
        style={{ width: "14rem", margin: "0 auto" }}
        onClick={handleCardClick}
      >
        {/* Imagem com verificação e fallback */}
        <div className="w-full h-[150px] overflow-hidden flex-shrink-0 bg-gray-200 flex items-center justify-center">
          {imageLoaded ? (
            <img
              src={imageSrc}
              className="w-full h-full object-cover"
              alt={titulo}
              onError={() => {
                if (imageSrc !== "/curso-default.jpg") {
                  setImageSrc("/curso-default.jpg")
                }
              }}
            />
          ) : (
            <div className="w-full h-full bg-gray-200 animate-pulse flex items-center justify-center">
              <svg
                className="w-8 h-8 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
          )}
        </div>

        <div className="p-4">
          {/* Título */}
          <h5 className="text-xl font-semibold mb-2 line-clamp-2">{titulo}</h5>

          {/* Categoria */}
          <div className="mb-2">
            <span
              className={cn(
                "px-2 py-1 rounded-full text-xs font-medium",
                getCategoriaBadgeColor(categoria)
              )}
            >
              {formatarCategoria(categoria)}
            </span>
          </div>

          {/* Descrição */}
          <p className="text-base text-gray-700 mb-2 line-clamp-3">{descricao}</p>

          {/* Carga horária e vagas */}
          <div className="flex justify-between items-center mb-3">
            <p className="text-sm text-gray-500">{cargaHoraria}h</p>
            <span
              className={cn(
                "px-2 py-1 rounded-full text-xs font-medium",
                hasVagas ? "bg-gray-100 text-gray-800" : "bg-red-100 text-red-800"
              )}
            >
              {statusVagas}
            </span>
          </div>

          {/* Botões de ação apenas para proprietários */}
          {isOwner && (
            <div className="flex justify-between" onClick={(e) => e.stopPropagation()}>
              <button
                className="p-0 border-none bg-transparent cursor-pointer hover:opacity-70 transition-opacity"
                onClick={handleEdit}
                aria-label="Editar curso"
              >
                <img src="/pen.png" alt="Editar" className="w-6 h-6" />
              </button>
              <button
                className="p-0 border-none bg-transparent cursor-pointer hover:opacity-70 transition-opacity"
                onClick={handleDeleteClick}
                disabled={isDeleting}
                aria-label="Excluir curso"
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
        message="Tem certeza que deseja excluir este curso? Esta ação não pode ser desfeita e todas as aulas associadas também serão removidas."
        confirmText={isDeleting ? "Excluindo..." : "Confirmar Exclusão"}
        cancelText="Cancelar"
        variant="destructive"
      />
    </>
  )
}

export default CardCurso