"use client";

import React, { useState } from "react";
import { signIn } from "next-auth/react";

interface LoginProps {
  logo: string;
}

const Login: React.FC<LoginProps> = ({ logo }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [erro, setErro] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await signIn("credentials", {
      redirect: false, // Evita redirecionamento automático do NextAuth
      username,
      password,
    });

    if (result?.error) {
      setErro("Usuário ou senha inválidos");
      console.log(result.error);
    } else {
      setErro("");
      if (result?.url) {
        window.location.href = result.url; // Redireciona para a URL fornecida
      } else {
        // Caso não tenha a URL no resultado, redireciona diretamente
        window.location.href = "/";
      }
    }
  };

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
      </div>
    </form>
  );
};

export default Login;
