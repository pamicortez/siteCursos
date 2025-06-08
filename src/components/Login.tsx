"use client";

import { useSession } from "next-auth/react"
import React, { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import { getSession } from "next-auth/react";
import { useRouter } from "next/navigation"
import { User } from 'lucide-react'

interface LoginProps {
  logo: string;
}

interface Usuario {
  id: number
  fotoPerfil: string
  Nome: string
}

function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText,
  variant = 'default',
  showProfilePhoto = false,
  profilePhoto = null,
  showSpinner = false
}: {
  isOpen: boolean;
  onClose?: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText: string;
  variant?: 'default' | 'destructive';
  showProfilePhoto?: boolean;
  profilePhoto?: string | null;
  showSpinner?: boolean;
}) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 transition-all duration-700 ease-in-out bg-slate-600/40 backdrop-blur-sm opacity-100"
      style={{
        backdropFilter: 'blur(8px)',
        background: 'rgba(71, 85, 105, 0.4)'
      }}
    >
      <div className="bg-white p-6 rounded-lg max-w-md w-full shadow-xl border border-gray-200 transform transition-all duration-700 ease-in-out scale-100 opacity-100 translate-y-0">
        <h2 className="text-xl font-bold mb-4 text-center">{title}</h2>

        {/* Foto de Perfil */}
        {showProfilePhoto && (
          <div className="flex justify-center mb-4">
            <div className="relative group">
              <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                {profilePhoto ? (
                  <img
                    src={profilePhoto}
                    alt="Foto de perfil"
                    className="w-full h-full object-cover"
                    onLoad={() => console.log("Imagem carregada")} // debug
                  />
                ) : (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-500"></div>
                )}
              </div>
            </div>
          </div>
        )}


        <p className="mb-6 text-center">{message}</p>

        {/* Spinner */}
        {showSpinner && (
          <div className="flex justify-center mb-4">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-200"></div>
          </div>
        )}

        <div className="flex justify-end gap-4">
          {onClose && (
            <button
              className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition"
              onClick={onClose}
            >
              Continuar editando
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

const Login: React.FC<LoginProps> = ({ logo }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [usuario, setUsuario] = useState<Usuario | null>(null)
  const [erro, setErro] = useState("");
  const router = useRouter()
  const [justLoggedIn, setJustLoggedIn] = useState(false);
  const [showResultDialog, setShowResultDialog] = useState(false)
  const [fotoCarregando, setFotoCarregando] = useState(true);
  const [resultDialog, setResultDialog] = useState({
    title: '',
    message: '',
    isError: false,
    fotoPerfil: null as string | null,
  })
  const { data: session, status } = useSession();
  const photoToUse = usuario?.fotoPerfil || null;

  const fetchWithErrorHandling = async (url: string) => {
    try {
      const response = await fetch(url)

      // Verifica se a resposta é bem-sucedida
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      // Verifica o Content-Type para garantir que é JSON
      const contentType = response.headers.get("content-type")
      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text()
        console.error("Response is not JSON:", text)
        throw new Error("Response is not valid JSON")
      }

      return await response.json()
    } catch (error) {
      console.error(`Error fetching ${url}:`, error)
      throw error
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await signIn("credentials", {
      redirect: false,
      username,
      password,
    });

    if (result?.ok) {
      setJustLoggedIn(true);
      setErro("");

      // Aguardar a sessão ser atualizada antes de redirecionar
      const updatedSession = await getSession();
      if (updatedSession) {
        // Pequeno delay para garantir que o modal seja mostrado
        setTimeout(() => {
          if (result.url) {
            router.push(`/`)
          } else {
            router.push(`/`)
          }
        }, 2500); // Delay maior que o timeout do modal
      }
    } else {
      setErro("Usuário ou senha inválidos");
      console.log(result?.error);
    }
  };



  useEffect(() => {
    const fetchUsuario = async () => {
      if (session?.user?.id) {
        try {
          const data = await fetchWithErrorHandling(`/api/usuario?id=${session.user.id}`)
          setUsuario(data)
        } catch (error) {
          console.error("Erro ao carregar usuário:", error)
          setResultDialog({
            title: 'Erro',
            message: "Erro ao carregar dados do usuário",
            isError: true,
            fotoPerfil: usuario?.fotoPerfil || null,
          })
          setShowResultDialog(true)
        }
      }
    }

    fetchUsuario()
  }, [session])

  useEffect(() => {
    if (justLoggedIn && session?.user?.id && session?.user?.name && status === 'authenticated') {
      console.log("Session user image:", session.user.image); // Debug

      // Priorizar fotoPerfil do usuário se existir, senão usar session.user.image
      const photoToUse = usuario?.fotoPerfil || null;

      setResultDialog({
        title: 'Login realizado com sucesso!',
        message: `Bem vindo, ${session.user.name}`,
        isError: false,
        fotoPerfil: photoToUse,

      })
      setShowResultDialog(true)

      // Fechar o modal automaticamente após 2 segundos
      setTimeout(() => {
        setShowResultDialog(false)
      }, 2000)

      setJustLoggedIn(false);
    }
  }, [justLoggedIn, session, status, usuario]);

  // Debug para verificar os valores
  useEffect(() => {
    if (showResultDialog) {
      console.log("Modal aberto com:");
      console.log("- fotoPerfil:", resultDialog.fotoPerfil);
      console.log("- session.user.image:", session?.user?.image);
      console.log("- usuario.fotoPerfil:", usuario?.fotoPerfil);
      console.log("- showProfilePhoto:", !resultDialog.isError);
    }
  }, [showResultDialog, resultDialog.fotoPerfil, session?.user?.image, usuario?.fotoPerfil]);

  useEffect(() => {
    if (usuario?.fotoPerfil) {
      setResultDialog(prev => ({
        ...prev,
        fotoPerfil: usuario.fotoPerfil,
      }));
      setFotoCarregando(false);
    }
  }, [usuario?.fotoPerfil]);


  return (
    <form onSubmit={handleSubmit}>
      <div className="grid gap-6 mb-6 md:grid-cols-2">
        {/* LOGO */}
        <div className="grid items-center gap-1.5">
          <div className="p-3">
            <div className="bg-light rounded flex justify-center items-center" style={{ width: "100%", height: "40vw", color: "black" }}>
              <div className="rounded-[4rem] shadow-xl flex justify-center items-center" style={{ width: "20vw", height: "30vw", backgroundColor: "#eaeae4" }}>
                <img src={logo} alt="Logo" className="max-h-[80%] max-w-full object-contain" />
              </div>
            </div>
          </div>
        </div>

        {/* FORMULÁRIO */}
        <div className="grid items-center gap-1.5">
          <div className="p-3">
            <div className="bg-light rounded flex justify-center items-center" style={{ width: "100%", height: "40vw", color: "black" }}>
              <div className="flex flex-col justify-center w-1/2 h-4/5">
                <div className="btn font-bold px-3 py-2 w-full bg-white">
                  <h2 className="text-black mb-3 text-center text-2xl font-bold">Login</h2>
                </div>

                {/* E-mail */}
                <input
                  type="email"
                  id="username"
                  name="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="form-control rounded-lg shadow-lg mb-3 px-3 py-2 w-full text-black border border-gray-300"
                  placeholder="E-mail"
                />

                {/* Senha */}
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="form-control rounded-lg shadow-lg mb-3 px-3 py-2 w-full text-black border border-gray-300"
                  placeholder="Senha"
                />

                {/* Erro */}
                {erro && <p className="text-red-600 text-sm mb-3">{erro}</p>}

                {/* Botão */}
                <button
                  type="submit"
                  className="font-bold rounded-lg shadow-xl px-3 py-2 w-full mb-3 border-2 border-black text-black bg-white hover:bg-black hover:text-white active:scale-95 transition duration-150"
                >
                  Entrar com e-mail
                </button>

                {/* Links */}
                <div className="flex justify-between text-center space-x-2">
                  <a href="/criar-conta" className="text-black no-underline hover:text-gray-600 active:scale-95 transition duration-150">
                    Criar conta
                  </a>
                  <a href="/esqueci-senha" className="text-black no-underline hover:text-gray-600 active:scale-95 transition duration-150">
                    Esqueci minha senha
                  </a>
                </div>

              </div>
            </div>
          </div>
        </div>

        {/* Modal de Resultado */}
        <ConfirmationModal
          isOpen={showResultDialog}
          onConfirm={() => setShowResultDialog(false)}
          title={resultDialog.title}
          message={resultDialog.message}
          confirmText="OK"
          variant={resultDialog.isError ? 'destructive' : 'default'}
          showProfilePhoto={!resultDialog.isError}
          profilePhoto={resultDialog.fotoPerfil}
          showSpinner={fotoCarregando}
        />

      </div>
    </form>
  );
};

export default Login;