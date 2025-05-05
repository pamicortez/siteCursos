import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { ConfirmationModal } from "./ConfirmationModal";
import { useRouter } from "next/navigation"; 

interface CardCursoWithButtonProps {
  idCurso: number;
  imagem: string;
  nome: string;
  descricao: string;
  cargahoraria: string;
  isOwner: boolean;
  onCursoDeleted?: () => void;
}

const CardCursoWithButton: React.FC<CardCursoWithButtonProps> = ({
  idCurso, 
  imagem, 
  nome, 
  descricao, 
  cargahoraria, 
  isOwner,
  onCursoDeleted
}) => {
  const router = useRouter(); 
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Verifica se a imagem é uma URL ou base64
  const isBase64 = imagem.startsWith('data:image');
  const imageSrc = isBase64 ? imagem : `/api/images?url=${encodeURIComponent(imagem)}`;

  const handleDelete = async () => {
    setIsDeleting(true);
    
    try {
      const response = await fetch(`/api/curso?id=${idCurso}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Falha ao excluir curso');

      onCursoDeleted?.() || window.location.reload();
    } catch (error) {
      console.error('Erro ao excluir curso:', error);
      alert('Ocorreu um erro ao excluir o curso');
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };

  const handleEdit = () => {
    router.push(`/curso/editar/${idCurso}`);
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-md overflow-hidden" style={{ width: "17rem", margin: "0 auto" }}>
        <img 
          src={imageSrc} 
          className="w-full h-[150px] object-cover" 
          alt={nome} 
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/proj1.jpg';
          }}
        />
        <div className="p-4">
          <h5 className="text-xl font-semibold mb-2">{nome}</h5>
          <p className="text-base text-gray-700 mb-2">{descricao}</p>
          <p className="text-sm text-gray-500 mb-3">{cargahoraria}</p>
          
          {isOwner && (
            <div className="flex justify-between">
              <button 
                className="p-0 border-none bg-transparent cursor-pointer"
                onClick={handleEdit}
              >
                <img src="/pen.png" alt="Editar" className="w-6 h-6" />
              </button>
              <button 
                className="p-0 border-none bg-transparent cursor-pointer"
                onClick={() => setShowDeleteModal(true)}
                disabled={isDeleting}
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
        title={`Excluir "${nome}"?`}
        message="Tem certeza que deseja excluir este curso? Esta ação não pode ser desfeita."
        confirmText={isDeleting ? "Excluindo..." : "Confirmar Exclusão"}
        cancelText="Cancelar"
        variant="destructive"
      />
    </>
  );
};

export default CardCursoWithButton;