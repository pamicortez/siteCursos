"use client";

import React, { useState } from 'react';
import { signIn } from 'next-auth/react';

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const result = await signIn('credentials', {
            redirect: false,
            username,
            password,
        });

        if (result?.error) {
            setError('Usuário ou senha inválidos');
            console.log('erro');
            console.log(result.error);
        } else {
            setError('');
            window.location.href = '/dashboard'; // Redireciona para a página protegida
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f5f5f5' }}>
            <div style={{ width: '100%', maxWidth: '400px', padding: '20px', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
                <h2 style={{ textAlign: 'center', marginBottom: '20px', color: '#000'}}>Login</h2>
                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '15px' }}>
                        <label htmlFor="username" style={{ display: 'block', marginBottom: '5px', color: '#000' }}>Usuário</label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc', color: '#000' }}
                            placeholder="Digite seu usuário"
                        />
                    </div>
                    <div style={{ marginBottom: '15px' }}>
                        <label htmlFor="password" style={{ display: 'block', marginBottom: '5px', color: '#000'}}>Senha</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc', color: '#000' }}
                            placeholder="Digite sua senha"
                        />
                    </div>
                    {error && <p style={{ color: 'red', marginBottom: '15px' }}>{error}</p>}
                    <button
                        type="submit"
                        style={{
                            width: '100%',
                            padding: '10px',
                            backgroundColor: '#007bff',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                        }}
                    >
                        Entrar
                    </button>
                </form>
                <div style={{ marginTop: '15px', textAlign: 'center' }}>
                    <a href="/criar-conta" style={{ color: '#007bff', textDecoration: 'none', marginRight: '10px' }}>Criar conta</a>
                    <a href="/esqueci-senha" style={{ color: '#007bff', textDecoration: 'none' }}>Esqueci minha senha</a>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;