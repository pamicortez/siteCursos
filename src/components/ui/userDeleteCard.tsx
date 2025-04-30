import { useState } from "react";

type UserManagementCardProps = {
  id_user: number;
  name: string;
  email: string;
  institution: string;
  lattes: string;
};

export default function UserDeleteCard({
  id_user,
  name,
  email,
  institution,
  lattes,
}: UserManagementCardProps) {
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleUnblock = () => {
    setShowModal(true);
  };

  const handleDelete = () => {
    setShowDeleteModal(true);
  };

  const confirmUnblock = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/usuario", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: id_user,
          atributo: "tipo",
          novoValor: "Normal",
        }),
      });

      if (!response.ok) {
        throw new Error("Erro ao desbloquear usuário");
      }

      console.log("Usuário desbloqueado:", email);
      window.location.reload();
    } catch (error) {
      console.error("Erro:", error);
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
            onClick={handleUnblock}
            className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 w-35 mb-2"
          >
            DESBLOQUEAR
          </button>
          <button
            onClick={handleDelete}
            className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 w-35"
          >
            EXCLUIR
          </button>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">
              Deseja realmente desbloquear este usuário?
            </h2>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-300 hover:bg-gray-400 text-black py-2 px-4 rounded"
              >
                Cancelar
              </button>
              <button
                onClick={confirmUnblock}
                className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded"
              >
                Sim
              </button>
            </div>
          </div>
        </div>
      )}

      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">
              Deseja realmente excluir este usuário?
            </h2>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="bg-gray-300 hover:bg-gray-400 text-black py-2 px-4 rounded"
              >
                Cancelar
              </button>
              <button
                onClick={confirmDelete}
                className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded"
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
