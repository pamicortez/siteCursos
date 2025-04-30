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

  const handleAccept = () => {
    setShowModal(true);
  };

  const confirmAccept = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/usuario", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: id_user,
          atributo: "tipo",
          novoValor: "Normal", // ou o valor correspondente ao tipo desejado
        }),
      });

      if (!response.ok) {
        throw new Error("Erro ao aprovar o usuário.");
      }

      console.log("Usuário aceito:", email);

      window.location.reload();

    } catch (error) {
      console.error(error);
    } finally {
      setShowModal(false);
    }
  };

  const makeAdmin = () => {
    console.log("Usuário tornado administrador:", email);
    setShowModal(false);
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
            className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 w-25 mb-2"
          >
            ACEITAR
          </button>
          <button className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 w-25">
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
                onClick={confirmAccept}
                className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded"
              >
                Sim
              </button>
              <button
                onClick={makeAdmin}
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
    </>
  );
}
