import { useState } from "react";

type UserManagementCardProps = {
  id_user: number;
  name: string;
  email: string;
  institution: string;
  lattes: string;
};

export default function UserAproveCard({
  id_user,
  name,
  email,
  institution,
  lattes,
}: UserManagementCardProps) {
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleAccept = () => {
    setShowModal(true);
  };

  const updateUserType = async (tipo: "Normal" | "Super") => {
    try {
      const response = await fetch(`http://localhost:3000/api/usuario?id=${id_user}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tipo,
        }),
      });

      if (!response.ok) {
        throw new Error(`Erro ao atualizar o usuário para tipo ${tipo}.`);
      }

      console.log(`Usuário atualizado para tipo ${tipo}:`, email);
      window.location.reload();
    } catch (error) {
      console.error(error);
    } finally {
      setShowModal(false);
    }
  };

  const confirmDelete = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/usuario?id=${id_user}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Erro ao excluir usuário");
      }

      console.log("Usuário excluído:", email);
      window.location.reload();
    } catch (error) {
      console.error("Erro:", error);
    } finally {
      setShowDeleteModal(false);
    }
  };

  return (
    <>
      <div className="bg-white p-4 rounded-lg shadow-md flex flex-1">
        <div className="flex flex-col flex-1">
          <label className="block text-lg font-bold mb-2">{name}</label>
          <label className="block text-sm font-medium mb-2">{email}</label>
          <label className="block text-sm font-medium mb-2">{institution}</label>
          <label className="block text-sm font-medium">
            <a
              href={lattes}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              {lattes}
            </a>
          </label>
        </div>

        <div className="flex flex-col items-end flex-1">
          <button
            onClick={handleAccept}
            className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 w-25 mb-2"
          >
            ACEITAR
          </button>
          <button
            onClick={() => setShowDeleteModal(true)} // Abre o modal de exclusão
            className="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 w-25"
          >
            NEGAR
          </button>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">Deseja aceitar esse usuário?</h2>
            <div className="flex flex-col gap-2">
              <button
                onClick={() => updateUserType("Normal")}
                className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded"
              >
                Sim
              </button>
              <button
                onClick={() => updateUserType("Super")}
                className="bg-yellow-400 hover:bg-yellow-500 text-black py-2 px-4 rounded"
              >
                Tornar Administrador
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-300 hover:bg-gray-400 text-black py-2 px-4 rounded"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">Deseja realmente negar esse usuário?</h2>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowDeleteModal(false)} // Fecha o modal de negação
                className="bg-gray-300 hover:bg-gray-400 text-black py-2 px-4 rounded"
              >
                Cancelar
              </button>
              <button
                onClick={confirmDelete} // Chama a função para excluir o usuário
                className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded"
              >
                Sim
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
