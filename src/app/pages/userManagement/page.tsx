"use client";

import UserAproveCard from '@/components/ui/userAproveCard';
import UserBlockCard from '@/components/ui/userBlockCard';
import UserDeleteCard from '@/components/ui/userDeleteCard';
import { useState } from 'react';

type User = {
  name: string;
  email: string;
  institution: string;
  lattes: string;
};

export default function UserManagement() {
  const approvalUsers: User[] = [
    {
      name: "Luis Fernando do Rosario Cintra",
      email: "lfrcintra@ecomp.uefs.br",
      institution: "Universidade Estadual de Feira de Santana",
      lattes: "http://lattes.cnpq.br/7557089886188189"
    },
    {
      name: "Maria Silva",
      email: "maria.silva@universidade.edu",
      institution: "Universidade Federal da Bahia",
      lattes: "http://lattes.cnpq.br/1234567890000001"
    },
    {
      name: "Carlos Eduardo",
      email: "carlos.edu@ifba.edu.br",
      institution: "Instituto Federal da Bahia",
      lattes: "http://lattes.cnpq.br/1234567890000004"
    },
    {
      name: "Fernanda Lima",
      email: "fernanda.lima@uesc.br",
      institution: "Universidade Estadual de Santa Cruz",
      lattes: "http://lattes.cnpq.br/1234567890000005"
    }
  ];

  const blockedUsers: User[] = [
    {
      name: "João Pereira",
      email: "joao.pereira@instituto.edu",
      institution: "Instituto Federal de São Paulo",
      lattes: "http://lattes.cnpq.br/1234567890000002"
    },
    {
      name: "Juliana Gomes",
      email: "juliana.gomes@ufba.br",
      institution: "Universidade Federal da Bahia",
      lattes: "http://lattes.cnpq.br/1234567890000006"
    },
    {
      name: "Ricardo Martins",
      email: "ricardo.martins@ufrj.br",
      institution: "Universidade Federal do Rio de Janeiro",
      lattes: "http://lattes.cnpq.br/1234567890000007"
    },
    {
      name: "Tatiane Rocha",
      email: "tatiane.rocha@ifsp.edu.br",
      institution: "Instituto Federal de São Paulo",
      lattes: "http://lattes.cnpq.br/1234567890000008"
    }
  ];

  const excludedUsers: User[] = [
    {
      name: "Ana Costa",
      email: "ana.costa@faculdade.edu",
      institution: "Faculdade de Tecnologia de São Paulo",
      lattes: "http://lattes.cnpq.br/1234567890000003"
    },
    {
      name: "Bruno Oliveira",
      email: "bruno.oliveira@ufmg.br",
      institution: "Universidade Federal de Minas Gerais",
      lattes: "http://lattes.cnpq.br/1234567890000009"
    },
    {
      name: "Sabrina Freitas",
      email: "sabrina.freitas@unesp.br",
      institution: "Universidade Estadual Paulista",
      lattes: "http://lattes.cnpq.br/1234567890000010"
    },
    {
      name: "Eduardo Mendes",
      email: "eduardo.mendes@ufscar.br",
      institution: "Universidade Federal de São Carlos",
      lattes: "http://lattes.cnpq.br/1234567890000011"
    }
  ];

  const [selectedButton, setSelectedButton] = useState<string>('aprovação');

  const handleButtonClick = (button: string) => {
    setSelectedButton(button);
  };

  const getUsersToDisplay = () => {
    switch (selectedButton) {
      case 'bloqueio':
        return blockedUsers;
      case 'exclusao':
        return excludedUsers;
      case 'aprovação':
      default:
        return approvalUsers;
    }
  };

  const renderUserCard = (user: User, index: number) => {
    switch (selectedButton) {
      case 'bloqueio':
        return (
          <UserBlockCard
            key={index}
            name={user.name}
            email={user.email}
            institution={user.institution}
            lattes={user.lattes}
          />
        );
      case 'exclusao':
        return (
          <UserDeleteCard
            key={index}
            name={user.name}
            email={user.email}
            institution={user.institution}
            lattes={user.lattes}
          />
        );
      case 'aprovação':
      default:
        return (
          <UserAproveCard
            key={index}
            name={user.name}
            email={user.email}
            institution={user.institution}
            lattes={user.lattes}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="w-180">
        <h1 className="text-4xl font-bold text-center mt-8 mb-8 text-left">GERENCIAMENTO DE USUÁRIOS</h1>
        {/* Botões de seleção */}
        <div className="bg-white p-4 rounded-lg shadow-md flex mb-4">
          <button
            onClick={() => handleButtonClick('aprovação')}
            className={`flex-1 py-2 px-4 rounded-lg border-2 ${selectedButton === 'aprovação' ? 'border-black' : 'border-transparent'}`}>
            Aprovação
          </button>
          <button
            onClick={() => handleButtonClick('bloqueio')}
            className={`flex-1 py-2 px-4 rounded-lg border-2 ${selectedButton === 'bloqueio' ? 'border-black' : 'border-transparent'}`}>
            Bloqueio
          </button>
          <button
            onClick={() => handleButtonClick('exclusao')}
            className={`flex-1 py-2 px-4 rounded-lg border-2 ${selectedButton === 'exclusao' ? 'border-black' : 'border-transparent'}`}>
            Exclusão
          </button>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-md mb-4">
            <input
                type="text"
                placeholder="Pesquisar..."
                className="w-full p-2 border border-gray-300 rounded-lg"
                // Adicione lógica de filtro no onChange se quiser
            />
        </div>

        {/* Lista de usuários com componentes dinâmicos */}
        <div className="space-y-4">
          {getUsersToDisplay().map((user, index) => renderUserCard(user, index))}
        </div>
      </div>
    </div>
  );
}
