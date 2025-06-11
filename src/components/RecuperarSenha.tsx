"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { User, Mail, Lock, ArrowLeft } from 'lucide-react';

interface RecuperarSenhaProps {
  logo: string;
}

function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText,
  variant = 'default',
  showSpinner = false
}: {
  isOpen: boolean;
  onClose?: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText: string;
  variant?: 'default' | 'destructive';
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
        <p className="mb-6 text-center">{message}</p>

        {/* Spinner */}
        {showSpinner && (
          <div className="flex justify-center mb-4">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-500"></div>
          </div>
        )}

        <div className="flex justify-end gap-4">
          {onClose && (
            <button
              className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition"
              onClick={onClose}
            >
              Fechar
            </button>
          )}
          <button
            className={`px-4 py-2 rounded-md transition ${
              variant === 'destructive' 
                ? 'bg-red-600 text-white hover:bg-red-700' 
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

const RecuperarSenha: React.FC<RecuperarSenhaProps> = ({ logo }) => {
  const [step, setStep] = useState<'email' | 'reset'>('email');
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);
  const [showResultDialog, setShowResultDialog] = useState(false);
  const [resultDialog, setResultDialog] = useState({
    title: '',
    message: '',
    isError: false,
  });

  const router = useRouter();
  const searchParams = useSearchParams();

  // Verificar se há token na URL (ajustado para a rota existente)
  useEffect(() => {
    const tokenFromUrl = searchParams.get('token');
    if (tokenFromUrl) {
      setToken(tokenFromUrl);
      setStep('reset');
    }
  }, [searchParams]);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErro("");

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setResultDialog({
          title: 'E-mail enviado!',
          message: data.message || 'Verifique sua caixa de entrada e clique no link para redefinir sua senha.',
          isError: false,
        });
        setShowResultDialog(true);
      } else {
        setErro(data.error || "Erro ao enviar e-mail");
      }
    } catch (error) {
      console.error("Erro:", error);
      setErro("Erro de conexão. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro("");

    if (newPassword !== confirmPassword) {
      setErro("As senhas não coincidem");
      return;
    }

    if (newPassword.length < 6) {
      setErro("A senha deve ter pelo menos 6 caracteres");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, newPassword }),
      });

      const data = await response.json();

      if (response.ok) {
        setResultDialog({
          title: 'Senha redefinida!',
          message: 'Sua senha foi alterada com sucesso. Você pode fazer login com a nova senha.',
          isError: false,
        });
        setShowResultDialog(true);
        
        // Redirecionar para login após 3 segundos
        setTimeout(() => {
          router.push('/login');
        }, 3000);
      } else {
        setErro(data.error || "Erro ao redefinir senha");
      }
    } catch (error) {
      console.error("Erro:", error);
      setErro("Erro de conexão. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleBackToLogin = () => {
    router.push('/login');
  };

  const handleBackToEmail = () => {
    setStep('email');
    setToken('');
    setNewPassword('');
    setConfirmPassword('');
    setErro('');
  };

  return (
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
              
              {/* Botão Voltar */}
              <button
                type="button"
                onClick={step === 'email' ? handleBackToLogin : handleBackToEmail}
                className="flex items-center text-black hover:text-gray-600 mb-4 transition duration-150"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                {step === 'email' ? 'Voltar ao Login' : 'Voltar'}
              </button>

              <div className="btn font-bold px-3 py-2 w-full bg-white mb-4">
                <h2 className="text-black mb-3 text-center text-2xl font-bold">
                  {step === 'email' ? 'Recuperar Senha' : 'Nova Senha'}
                </h2>
                <p className="text-gray-600 text-sm text-center">
                  {step === 'email' 
                    ? 'Digite seu e-mail para receber o link de recuperação'
                    : 'Digite sua nova senha'
                  }
                </p>
              </div>

              {step === 'email' ? (
                <form onSubmit={handleEmailSubmit}>
                  {/* E-mail */}
                  <div className="relative mb-3">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="form-control rounded-lg shadow-lg pl-10 pr-3 py-2 w-full text-black border border-gray-300"
                      placeholder="Seu e-mail"
                      required
                    />
                  </div>

                  {/* Erro */}
                  {erro && <p className="text-red-600 text-sm mb-3">{erro}</p>}

                  {/* Botão */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="font-bold rounded-lg shadow-xl px-3 py-2 w-full mb-3 border-2 border-black text-black bg-white hover:bg-black hover:text-white active:scale-95 transition duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Enviando...' : 'Enviar Link de Recuperação'}
                  </button>
                </form>
              ) : (
                <form onSubmit={handlePasswordReset}>
                  {/* Nova Senha */}
                  <div className="relative mb-3">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="password"
                      id="newPassword"
                      name="newPassword"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="form-control rounded-lg shadow-lg pl-10 pr-3 py-2 w-full text-black border border-gray-300"
                      placeholder="Nova senha"
                      required
                      minLength={6}
                    />
                  </div>

                  {/* Confirmar Nova Senha */}
                  <div className="relative mb-3">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="password"
                      id="confirmPassword"
                      name="confirmPassword"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="form-control rounded-lg shadow-lg pl-10 pr-3 py-2 w-full text-black border border-gray-300"
                      placeholder="Confirmar nova senha"
                      required
                      minLength={6}
                    />
                  </div>

                  {/* Erro */}
                  {erro && <p className="text-red-600 text-sm mb-3">{erro}</p>}

                  {/* Botão */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="font-bold rounded-lg shadow-xl px-3 py-2 w-full mb-3 border-2 border-black text-black bg-white hover:bg-black hover:text-white active:scale-95 transition duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Redefinindo...' : 'Redefinir Senha'}
                  </button>
                </form>
              )}

              {/* Link adicional apenas na primeira etapa */}
              {step === 'email' && (
                <div className="text-center">
                  <button
                    type="button"
                    onClick={handleBackToLogin}
                    className="text-black no-underline hover:text-gray-600 active:scale-95 transition duration-150"
                  >
                    Lembrou da senha? Fazer login
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Resultado */}
      <ConfirmationModal
        isOpen={showResultDialog}
        onConfirm={() => {
          setShowResultDialog(false);
          if (!resultDialog.isError && step === 'email') {
            // redirecionar após envio do email
          }
        }}
        title={resultDialog.title}
        message={resultDialog.message}
        confirmText="OK"
        variant={resultDialog.isError ? 'destructive' : 'default'}
        showSpinner={loading}
      />
    </div>
  );
};

export default RecuperarSenha;