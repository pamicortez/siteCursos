"use client"

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { ConfirmationModal } from "./ConfirmationModal";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react"

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

interface CardEventoProps {
  idEvento: number;
  titulo: string;
  descricao: string;
  dataInicio: string | Date;
  dataFim: string | Date;
  linkParticipacao?: string | null;
  local: string;
  imagens?: string[]; // Array de URLs das imagens do evento
  isOwner: boolean;
  tipoParticipacao?: 'Ouvinte' | 'Palestrante' | 'Organizador';
  onEventoDeleted?: () => void;
  maxCaracteres?: number; // Opcional, padrão será 74
  largura?: string;
}

const CardEvento: React.FC<CardEventoProps> = ({
  idEvento,
  titulo,
  descricao,
  dataInicio,
  dataFim,
  linkParticipacao,
  local,
  imagens,
  isOwner,
  tipoParticipacao,
  onEventoDeleted,
  maxCaracteres = 74,
  largura = "14rem"
}) => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const isLoggedIn = status === "authenticated" && session?.user;
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + '...';
  };

  // Formatar data separadamente
  const formatarData = (dataEvento: string | Date) => {
    try {
      const date = new Date(dataEvento);

      // Verificar se a data é válida
      if (isNaN(date.getTime())) {
        return 'Data inválida';
      }

      return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch (error) {
      console.error('Erro ao formatar data:', error);
      return 'Data inválida';
    }
  };

  // Formatar hora separadamente
  const formatarHora = (dataEvento: string | Date) => {
    try {
      const date = new Date(dataEvento);

      // Verificar se a data é válida
      if (isNaN(date.getTime())) {
        return 'Hora inválida';
      }

      return date.toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      console.error('Erro ao formatar hora:', error);
      return 'Hora inválida';
    }
  };

  // Verifica se a imagem é base64 ou URL - usa a primeira imagem disponível
  const primeiraImagem = imagens && imagens.length > 0 ? imagens[0] : null;
  const isBase64 = primeiraImagem?.startsWith('data:image');
  const imageSrc = primeiraImagem
    ? (isBase64 ? primeiraImagem : primeiraImagem?.startsWith('/') ? primeiraImagem : `/api/images?url=${encodeURIComponent(primeiraImagem)}`)
    : '/event_lecture.jpg'; // Imagem padrão para eventos

  const handleDelete = async () => {
    setIsDeleting(true);

    try {
      const response = await fetch(`/api/evento?id=${idEvento}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Falha ao excluir evento');

      onEventoDeleted?.() || window.location.reload();
    } catch (error) {
      console.error('Erro ao excluir evento:', error);
      alert('Ocorreu um erro ao excluir o evento');
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(`/evento/editar/${idEvento}`);
  };

  const handleCardClick = () => {
    router.push(`/evento/${idEvento}`);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDeleteModal(true);
  };

  const handleParticipate = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (linkParticipacao && linkParticipacao.trim() !== '') {
      window.open(linkParticipacao, '_blank');
    } else {
      // Se não houver link de participação, redireciona para a mesma rota do card
      router.push(`/evento/${idEvento}`);
    }
  };

  // Função para obter a cor do badge baseado no tipo de participação
  const getParticipacaoBadgeColor = (tipo?: string) => {
    switch (tipo) {
      case 'Organizador':
        return 'bg-purple-100 text-purple-800';
      case 'Palestrante':
        return 'bg-green-100 text-green-800';
      case 'Ouvinte':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Função para obter gênero neutro na função do usuário
  const getGeneroNeutro = (funcao?: string) => {
    switch (funcao) {
      case "Organizador":
        return "Organizador(a)"
      case "Palestrante":
        return "Palestrante"
      case "Ouvinte":
        return "Ouvinte"
      default:
        return "Ouvinte"
    }
  }

  return (
    <>
      <div
        className="bg-white rounded-lg shadow-md overflow-hidden relative cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-lg h-100 flex flex-col"
        style={{ width: largura, margin: "0 auto" }}
        onClick={handleCardClick}
      >
        {/* Imagem com fallback */}
        <div className="w-full h-32 overflow-hidden flex-shrink-0">
          <img
            src={imageSrc || "/placeholder.svg"}
            className="w-full h-full object-cover"
            alt={titulo}
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/event_lecture.jpg';
            }}
          />
        </div>

        <div className="p-4 flex-1 flex flex-col">
          <div className="flex justify-between items-start mb-2 flex-shrink-0">
            <h5 className="text-lg font-semibold line-clamp-1 flex-1 mr-2 overflow-hidden">{titulo}</h5>
            {tipoParticipacao && (
              <span className={cn(
                "absolute top-29 left-1/2 transform -translate-x-1/2 px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap flex-shrink-0",
                getParticipacaoBadgeColor(tipoParticipacao)
              )}>
                {getGeneroNeutro(tipoParticipacao)}
              </span>
            )}
          </div>

          <div className="h-12 mb-2 flex-shrink-0">
            <p className="text-sm text-gray-700 line-clamp-2 overflow-hidden">{truncateText(descricao, maxCaracteres)}</p>
          </div>

          {/* Datas e horas separadas */}
          <div className="mb-2 flex-shrink-0">
            <p className="text-xs text-gray-500 mb-1 font-medium">
              <span className="font-semibold">Início:</span> {formatarData(dataInicio)} às {formatarHora(dataInicio)}
            </p>
            <p className="text-xs text-gray-500 mb-1 font-medium">
              <span className="font-semibold">Fim:</span> {formatarData(dataFim)}
            </p>
          </div>

          {/* Local do evento */}
          <p className="text-xs text-gray-500 mb-3 font-medium flex-shrink-0">
            <span className="font-semibold">Local:</span> {local}
          </p>

          {/* Botão de participação - sempre visível e clicável */}
          <div className="mb-3 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
            <button
              className="w-full py-2 px-4 rounded-md transition-colors duration-200 text-sm font-medium bg-gray-900 hover:bg-gray-600 text-white cursor-pointer"
              onClick={handleParticipate}
              style={{ height: '2.5rem' }}
            >
              Participar do Evento
            </button>
          </div>


          {/* Botões de ação para proprietários */}
          {isOwner && (
            <div className="flex justify-between flex-shrink-0" onClick={(e) => e.stopPropagation()}>
              <button
                className="p-0 border-none bg-transparent cursor-pointer hover:opacity-70 transition-opacity"
                onClick={handleEdit}
                aria-label="Editar evento"
              >
                <img src="/pen.png" alt="Editar" className="w-6 h-6" />
              </button>
              <button
                className="p-0 border-none bg-transparent cursor-pointer hover:opacity-70 transition-opacity"
                onClick={handleDeleteClick}
                disabled={isDeleting}
                aria-label="Excluir evento"
              >
                <img
                  src="/trash.png"
                  alt="Excluir"
                  className={cn("w-6 h-6", isDeleting && "opacity-50")}
                />
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
        message="Tem certeza que deseja excluir este evento? Esta ação não pode ser desfeita."
        confirmText={isDeleting ? "Excluindo..." : "Confirmar Exclusão"}
        cancelText="Cancelar"
        variant="destructive"
      />
    </>
  );
};

export default CardEvento;