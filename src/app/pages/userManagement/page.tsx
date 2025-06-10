"use client";

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import UserAproveCard from '@/components/ui/userAproveCard';
import UserBlockCard from '@/components/ui/userBlockCard';
import UserDeleteCard from '@/components/ui/userDeleteCard';
import axios from 'axios';

type User = {
  id: number;
  email: string;
  fotoPerfil: string;
  senha: string;
  Nome: string;
  Titulacao: string;
  instituicaoEnsino: string;
  formacaoAcademica: string;
  resumoPessoal: string;
  createdAt: string;
  updatedAt: string;
  tipo: string;
  link: { id: number; link: string; idUsuario: number; tipo: string }[];
  publicacao: { id: number; descricao: string; link: string; idUsuario: number }[];
};

export default function UserManagement() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [userLoading, setUserLoading] = useState(false);
  const [usuario, setUsuario] = useState(null);

  const [selectedButton, setSelectedButton] = useState<string>('aprovação');
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Verifica se está autenticado e se é super
  useEffect(() => {
    const fetchUsuario = async () => {
      if (status === 'authenticated' && session?.user?.id) {
        setUserLoading(true);
        try {
          const response = await axios.get(`/api/usuario?id=${session.user.id}`);
          setUsuario(response.data);

          // Verifica o tipo do usuário do retorno da API
          if (response.data.tipo !== 'Super') {
            router.push('/home'); // acesso negado
          }
        } catch (error) {
          console.error('Erro ao carregar usuário:', error);
          router.push('/login'); // ou outra ação em caso de erro
        } finally {
          setUserLoading(false);
        }
      }

      if (status === 'unauthenticated') {
        router.push('/login');
      }
    };

    fetchUsuario();
  }, [status, session, router]);

  useEffect(() => {
    const storedButton = localStorage.getItem('selectedButton');
    if (storedButton) {
      setSelectedButton(storedButton);
    }
  }, []);

  useEffect(() => {
    const tipoMap: Record<string, string> = {
      'aprovação': 'Pendente',
      'bloqueio': 'Normal',
      'exclusao': 'Bloqueado'
    };

    const tipo = tipoMap[selectedButton];

    fetch(`http://localhost:3000/api/usuario?tipo=${tipo}`)
      .then(res => res.json())
      .then(data => setUsers(data))
      .catch(err => {
        console.error('Erro ao buscar usuários:', err);
        setUsers([]);
      });

    localStorage.setItem('selectedButton', selectedButton);
  }, [selectedButton]);

  const handleButtonClick = (button: string) => {
    setSelectedButton(button);
  };

  const renderUserCard = (user: User, index: number) => {
    const props = {
      id_user: user.id,
      name: user.Nome,
      email: user.email,
      institution: user.instituicaoEnsino,
      lattes: user.link.find(l => l.tipo === 'Genérico')?.link || ''
    };

    switch (selectedButton) {
      case 'bloqueio':
        return <UserBlockCard key={index} {...props} />;
      case 'exclusao':
        return <UserDeleteCard key={index} {...props} />;
      case 'aprovação':
      default:
        return <UserAproveCard key={index} {...props} />;
    }
  };

  const filteredUsers = users.filter(user =>
    user.Nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-100 flex items-top justify-center">
      <div className="w-180">
        <h1 className="text-4xl font-bold text-center mt-8 mb-8 text-left">GERENCIAMENTO DE USUÁRIOS</h1>

        <div className="bg-white p-4 rounded-lg shadow-md flex mb-4">
          <button
            onClick={() => handleButtonClick('aprovação')}
            className={`flex-1 py-2 px-4 rounded-lg border-2 ${selectedButton === 'aprovação' ? 'border-black' : 'border-transparent'}`}>
            Aprovar
          </button>
          <button
            onClick={() => handleButtonClick('bloqueio')}
            className={`flex-1 py-2 px-4 rounded-lg border-2 ${selectedButton === 'bloqueio' ? 'border-black' : 'border-transparent'}`}>
            Bloquear
          </button>
          <button
            onClick={() => handleButtonClick('exclusao')}
            className={`flex-1 py-2 px-4 rounded-lg border-2 ${selectedButton === 'exclusao' ? 'border-black' : 'border-transparent'}`}>
            Excluir
          </button>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-md mb-4">
          <input
            type="text"
            placeholder="Pesquisar..."
            className="w-full p-2 border border-gray-300 rounded-lg"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="space-y-4">
          {filteredUsers.map((user, index) => renderUserCard(user, index))}
        </div>
      </div>
    </div>
  );
}
