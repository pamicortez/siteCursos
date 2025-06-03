"use client"

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { ConfirmationModal } from "./ConfirmationModal";
import { useRouter } from "next/navigation"; 
import { useSession } from "next-auth/react"

interface CardEventoProps {
  idEvento: number;
  titulo: string;
  descricao: string;
  data: string | Date;
  linkParticipacao: string;
  imagens?: string[]; // Array de URLs das imagens do evento
  isOwner: boolean;
  tipoParticipacao?: 'Ouvinte' | 'Palestrante' | 'Organizador';
  onEventoDeleted?: () => void;
  maxCaracteres?: number; // Opcional, padrão será 74
}

const CardEvento: React.FC<CardEventoProps> = ({
  idEvento, 
  titulo, 
  descricao, 
  data,
  linkParticipacao,
  imagens,
  isOwner,
  tipoParticipacao,
  onEventoDeleted,
  maxCaracteres = 74 
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

  // Formatar a data do evento
  const formatarData = (dataEvento: string | Date) => {
    const date = new Date(dataEvento);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Verifica se a imagem é base64 ou URL - usa a primeira imagem disponível
  const primeiraImagem = imagens && imagens.length > 0 ? imagens[0] : null;
  const isBase64 = primeiraImagem?.startsWith('data:image');
  const imageSrc = primeiraImagem 
    ? (isBase64 ? primeiraImagem : primeiraImagem?.startsWith('/') ? primeiraImagem : `/api/images?url=${encodeURIComponent(primeiraImagem)}`)
    : '/evento1.jpg'; // Imagem padrão para eventos

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
    router.push(`/evento/detalhes/${idEvento}`);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDeleteModal(true);
  };

  const handleParticipate = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.open(linkParticipacao, '_blank');
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
            src={imageSrc || "/placeholder.svg"} 
            className="w-full h-full object-cover"
            alt={titulo} 
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/event1.jpg';
            }}
          />
        </div>
        
        <div className="p-4 flex-1 flex flex-col">
          <div className="flex justify-between items-start mb-2 flex-shrink-0">
            <h5 className="text-lg font-semibold line-clamp-1 flex-1 mr-2 overflow-hidden">{titulo}</h5>
            {tipoParticipacao && (
              <span className={cn(
                "px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap flex-shrink-0",
                getParticipacaoBadgeColor(tipoParticipacao)
              )}>
                {tipoParticipacao}
              </span>
            )}
          </div>
          
          <div className="h-12 mb-2 flex-shrink-0">
            <p className="text-sm text-gray-700 line-clamp-2 overflow-hidden">{truncateText(descricao, maxCaracteres)}</p>
          </div>
          
          <p className="text-xs text-gray-500 mb-3 font-medium flex-shrink-0">{formatarData(data)}</p>
          
          {/* Botão de participação sempre visível */}
          {isLoggedIn && (
          <div className="mb-3 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
            <button 
              className="w-full bg-gray-900 hover:bg-gray-600 text-white py-2 px-4 rounded-md transition-colors duration-200 text-sm font-medium"
              onClick={handleParticipate}
            >
              Participar do Evento
            </button>
          </div>
          )}
          
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