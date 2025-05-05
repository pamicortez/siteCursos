"use client"

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import ImageCropper from "@/components/ui/ImageCropper";

export default function Cadastro() {
  const [formData, setFormData] = useState({
    email: '',
    senha: '',
    confirmarSenha: '',
    nome: '',
    titulacao: '',
    instituicaoEnsino: '',
    formacaoAcademica: [''],
    resumoPessoal: '',
    fotoPerfil: '',
  });

  const [showImageCropper, setShowImageCropper] = useState(false);
  const [temporaryImage, setTemporaryImage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, index?: number) => {
    const { name, value } = e.target;

    if (name === "formacaoAcademica" && index !== undefined) {
      const newFormacoes = [...formData.formacaoAcademica];
      newFormacoes[index] = value;
      setFormData(prevState => ({
        ...prevState,
        formacaoAcademica: newFormacoes,
      }));
    } else {
      setFormData(prevState => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  const handleAddFormacao = () => {
    setFormData(prevState => ({
      ...prevState,
      formacaoAcademica: [...prevState.formacaoAcademica, ''],
    }));
  };

  const handleRemoveFormacao = (index: number) => {
    const newFormacoes = [...formData.formacaoAcademica];
    newFormacoes.splice(index, 1);
    setFormData(prevState => ({
      ...prevState,
      formacaoAcademica: newFormacoes,
    }));
  };

  const handleImageUploadSuccess = (url: string) => {
    setFormData(prevState => ({
      ...prevState,
      fotoPerfil: url,
    }));
    setShowImageCropper(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (formData.senha !== formData.confirmarSenha) {
      alert("As senhas não coincidem!");
      return;
    }
    
    console.log(formData);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="grid grid-cols-2 gap-8 w-full max-w-6xl p-8">
        {/* Left column: image with fixed size */}
        <div className="flex items-center justify-center">
          {formData.fotoPerfil ? (
            <div className="flex flex-col items-center">
              <img
                src={formData.fotoPerfil}
                alt="Foto de perfil"
                className="w-[248px] h-[248px] object-cover rounded-full mb-4"
              />
              <Button
                onClick={() => setShowImageCropper(true)}
                variant="outline"
                className="mt-2"
              >
                Alterar Foto
              </Button>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-full w-[248px] h-[248px]">
              <Button
                onClick={() => setShowImageCropper(true)}
                variant="outline"
              >
                Adicionar Foto
              </Button>
            </div>
          )}
        </div>

        {/* Right column: registration form */}
        <div className="flex flex-col justify-center">
          <h1 className="text-3xl font-bold mb-8 text-center">Cadastro</h1>

          {showImageCropper ? (
            <div className="mb-6">
              <ImageCropper 
                userId="temp" 
                onUploadSuccess={handleImageUploadSuccess} 
              />
              <Button
                onClick={() => setShowImageCropper(false)}
                variant="outline"
                className="mt-4"
              >
                Cancelar
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              {/* Email */}
              <div className="mb-6">
                <Input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="E-mail*"
                  className="w-full shadow-md"
                  required
                />
              </div>

              {/* Password */}
              <div className="mb-6">
                <Input
                  type="password"
                  id="senha"
                  name="senha"
                  value={formData.senha}
                  onChange={handleChange}
                  placeholder="Senha*"
                  className="w-full shadow-md"
                  required
                />
              </div>

              {/* Confirm Password */}
              <div className="mb-6">
                <Input
                  type="password"
                  id="confirmarSenha"
                  name="confirmarSenha"
                  value={formData.confirmarSenha}
                  onChange={handleChange}
                  placeholder="Confirmar Senha*"
                  className="w-full shadow-md"
                  required
                />
              </div>

              {/* Name */}
              <div className="mb-6">
                <Input
                  type="text"
                  id="nome"
                  name="nome"
                  value={formData.nome}
                  onChange={handleChange}
                  placeholder="Nome Completo*"
                  className="w-full shadow-md"
                  required
                />
              </div>

              {/* Titulação */}
              <div className="mb-6">
                <Input
                  type="text"
                  id="titulacao"
                  name="titulacao"
                  value={formData.titulacao}
                  onChange={handleChange}
                  placeholder="Titulação (ex: Dr., MSc, etc.)*"
                  className="w-full shadow-md"
                  required
                />
              </div>

              {/* Instituição de Ensino */}
              <div className="mb-6">
                <Input
                  type="text"
                  id="instituicaoEnsino"
                  name="instituicaoEnsino"
                  value={formData.instituicaoEnsino}
                  onChange={handleChange}
                  placeholder="Instituição de Ensino*"
                  className="w-full shadow-md"
                  required
                />
              </div>

              {/* Formação Acadêmica */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Formação Acadêmica*</label>
                {formData.formacaoAcademica.map((formacao, index) => (
                  <div key={index} className="mb-4">
                    <div className="flex items-center gap-2">
                      <Input
                        type="text"
                        name="formacaoAcademica"
                        value={formacao}
                        onChange={(e) => handleChange(e, index)}
                        placeholder={`Formação ${index + 1}`}
                        className="w-full shadow-md"
                        required
                      />
                      {formData.formacaoAcademica.length > 1 && (
                        <Button
                          type="button"
                          onClick={() => handleRemoveFormacao(index)}
                          className="w-10 h-10 p-0 flex items-center justify-center bg-red-200 text-red-700 hover:bg-red-300"
                        >
                          -
                        </Button>
                      )}
                      {index === formData.formacaoAcademica.length - 1 && (
                        <Button
                          type="button"
                          onClick={handleAddFormacao}
                          className="w-10 h-10 p-0 flex items-center justify-center bg-gray-200 text-gray-700 hover:bg-gray-300"
                        >
                          +
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Resumo Pessoal */}
              <div className="mb-6">
                <Textarea
                  id="resumoPessoal"
                  name="resumoPessoal"
                  value={formData.resumoPessoal}
                  onChange={handleChange}
                  placeholder="Resumo Pessoal*"
                  className="w-full shadow-md min-h-[120px]"
                  required
                />
              </div>

              {/* Submit Button */}
              <div className="flex justify-center">
                <Button
                  type="submit"
                  className="w-1/2 shadow-md" 
                >
                  Concluir Cadastro
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}