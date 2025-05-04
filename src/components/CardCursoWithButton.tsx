import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { ConfirmationModal } from "./ConfirmationModal"; 

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
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    
    try {
      const response = await fetch(`/api/curso?id=${idCurso}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Falha ao excluir curso');
      }

      if (onCursoDeleted) {
        onCursoDeleted();
      } else {
        window.location.reload();
      }
    } catch (error) {
      console.error('Erro ao excluir curso:', error);
      alert('Ocorreu um erro ao excluir o curso');
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-md overflow-hidden" style={{ width: "17rem", margin: "0 auto" }}>
        <img src={imagem} className="w-full h-[150px] object-cover" alt={nome} />
        <div className="p-4">
          <h5 className="text-xl font-semibold mb-2">{nome}</h5>
          <p className="text-base text-gray-700 mb-2">{descricao}</p>
          <p className="text-sm text-gray-500 mb-3">{cargahoraria}</p>
          
          {isOwner && (
            <div className="flex justify-between">
              <button className="p-0 border-none bg-transparent cursor-pointer">
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

      {/* Modal de Confirmação */}
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