"use client"

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function Cadastro() {
  const router = useRouter();
  const titulacoes = [
    { value: 'Bacharel', label: 'Bacharel' },
    { value: 'Licenciado', label: 'Licenciado' },
    { value: 'Especialista', label: 'Especialista' },
    { value: 'Mestre', label: 'Mestre' },
    { value: 'Doutor', label: 'Doutor' }
  ];

  const [formData, setFormData] = useState({
    email: '',
    Nome: '',
    Titulacao: '',
    instituicaoEnsino: '',
    formacaoAcademica: '',
    resumoPessoal: '',
    fotoPerfil: '',
    senha: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleTitulacaoChange = (value: string) => {
    setFormData(prev => ({ ...prev, Titulacao: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
  
    if (!file.type.match(/image\/(jpeg|png|jpg)/)) {
      toast.error('Formato inválido. Use JPEG ou PNG');
      return;
    }
  
    if (file.size > 2 * 1024 * 1024) {
      toast.error('A imagem deve ter menos de 2MB');
      return;
    }
  
    setIsUploading(true);
    const reader = new FileReader();
  
    reader.onload = (event: ProgressEvent<FileReader>) => {
      const result = event.target?.result;
      if (typeof result === 'string') {
        setFormData(prev => ({
          ...prev,
          fotoPerfil: result
        }));
      }
      setIsUploading(false);
    };
  
    reader.onerror = () => {
      toast.error('Erro ao ler a imagem');
      setIsUploading(false);
    };
  
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (formData.senha.length < 6) {
      toast.error('A senha deve ter pelo menos 6 caracteres');
      setIsSubmitting(false);
      return;
    }

    if (!formData.fotoPerfil) {
      toast.error('A foto de perfil é obrigatória');
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch('/api/usuario', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Erro no cadastro');
      }

      toast.success('Cadastro realizado com sucesso!');
      router.push('/login');
    } catch (error: any) {
      toast.error(error.message || 'Erro ao cadastrar');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="grid grid-cols-2 gap-8 w-full max-w-6xl p-8">
        {/* Coluna esquerda */}
        <div className="flex items-center justify-center">
          <img
            src="https://i.imgur.com/0KJtdDn.png"
            alt="Logo UEFS"
            className="w-[248px] h-[393px] object-cover rounded-lg"
          />
        </div>

        {/* Coluna direita - Formulário */}
        <div className="flex flex-col justify-center">
          <h1 className="text-3xl font-bold mb-8 text-center">Cadastro</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="E-mail*"
              required
              className="shadow-md"
            />

            <Input
              type="text"
              name="Nome"
              value={formData.Nome}
              onChange={handleChange}
              placeholder="Nome Completo*"
              required
              className="shadow-md"
            />

            <Input
              type="password"
              name="senha"
              value={formData.senha}
              onChange={handleChange}
              placeholder="Senha (mínimo 6 caracteres)*"
              required
              minLength={6}
              className="shadow-md"
            />

            <div>
              <label className="block text-sm font-medium mb-2">Titulação*</label>
              <Select
                value={formData.Titulacao}
                onValueChange={handleTitulacaoChange}
                required
              >
                <SelectTrigger className="w-full shadow-md">
                  <SelectValue placeholder="Selecione sua titulação" />
                </SelectTrigger>
                <SelectContent>
                  {titulacoes.map((tit) => (
                    <SelectItem key={tit.value} value={tit.value}>
                      {tit.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Input
              type="text"
              name="instituicaoEnsino"
              value={formData.instituicaoEnsino}
              onChange={handleChange}
              placeholder="Instituição de Ensino*"
              required
              className="shadow-md"
            />

            <Input
              type="text"
              name="formacaoAcademica"
              value={formData.formacaoAcademica}
              onChange={handleChange}
              placeholder="Formação Acadêmica"
              className="shadow-md"
            />

            <Textarea
              name="resumoPessoal"
              value={formData.resumoPessoal}
              onChange={handleChange}
              placeholder="Resumo Pessoal"
              className="shadow-md min-h-[120px]"
            />

            {/* Upload de Foto Obrigatória */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Foto de Perfil*</h2>
              <div className="flex items-center gap-4">
                {formData.fotoPerfil ? (
                  <img 
                    src={formData.fotoPerfil} 
                    alt="Preview" 
                    className="w-16 h-16 rounded-full object-cover border"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
                    <span className="text-xs text-gray-500">Sem foto</span>
                  </div>
                )}
                <label className="flex-1">
                  <input
                    type="file"
                    accept="image/jpeg,image/png"
                    onChange={handleFileChange}
                    className="hidden"
                    required
                  />
                  <div className={`w-full p-2 border rounded-md cursor-pointer text-center ${
                    isUploading ? 'bg-gray-100' : 'hover:bg-gray-50'
                  }`}>
                    {isUploading ? 'Processando...' : 
                     formData.fotoPerfil ? 'Alterar Imagem' : 'Selecionar Imagem*'}
                  </div>
                </label>
              </div>
              {!formData.fotoPerfil && (
                <p className="text-sm text-red-500 mt-2">Foto de perfil é obrigatória</p>
              )}
              <p className="text-xs text-gray-500 mt-2">Formatos: JPEG, PNG (até 2MB)</p>
            </div>

            <div className="flex justify-center pt-4">
              <Button
                type="submit"
                className="w-1/2 shadow-md"
                disabled={isSubmitting || isUploading}
              >
                {isSubmitting ? 'Cadastrando...' : 'Concluir Cadastro'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}