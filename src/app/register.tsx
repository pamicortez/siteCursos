"use client"

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Cadastro() {
  const [formData, setFormData] = useState({
    nomeCompleto: '',
    email: '',
    instituicaoEnsino: '',
    areasAtuacao: [''],
    linkCurriculo: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index?: number) => {
    const { name, value } = e.target;

    if (name === "areasAtuacao" && index !== undefined) {
      const newAreas = [...formData.areasAtuacao];
      newAreas[index] = value;
      setFormData(prevState => ({
        ...prevState,
        areasAtuacao: newAreas,
      }));
    } else {
      setFormData(prevState => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  const handleAddArea = () => {
    setFormData(prevState => ({
      ...prevState,
      areasAtuacao: [...prevState.areasAtuacao, ''],
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(formData);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="grid grid-cols-2 gap-8 w-full max-w-6xl p-8">
        {/* coluna da esquerda: imagem com tamanho fixo */}
        <div className="flex items-center justify-center">
          <img
            src="https://i.imgur.com/0KJtdDn.png" // imagem
            alt="Logo da UEFS"
            className="w-[248px] h-[393px] object-cover rounded-lg"
          />
        </div>

        {/* coluna da direita: formulario de cadastro */}
        <div className="flex flex-col justify-center">
          <h1 className="text-3xl font-bold mb-8 text-center">Cadastrar-se com e-mail</h1>

          {/* nome completo */}
          <div className="mb-6">
            <Input
              type="text"
              id="nomeCompleto"
              name="nomeCompleto"
              value={formData.nomeCompleto}
              onChange={handleChange}
              placeholder="Nome completo*"
              className="w-full shadow-md"
              required
            />
          </div>

          {/* e-mail */}
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

          {/* instituição de ensino */}
          <div className="mb-6">
            <Input
              type="text"
              id="instituicaoEnsino"
              name="instituicaoEnsino"
              value={formData.instituicaoEnsino}
              onChange={handleChange}
              placeholder="Instituição de ensino*"
              className="w-full shadow-md"
              required
            />
          </div>

          {/* areas de atuação */}
          <div className="mb-6">
            {formData.areasAtuacao.map((area, index) => (
              <div key={index} className="mb-4">
                <div className="flex items-center gap-2">
                  <Input
                    type="text"
                    id={`areaAtuacao-${index}`}
                    name="areasAtuacao"
                    value={area}
                    onChange={(e) => handleChange(e, index)}
                    placeholder={`Área de atuação`}
                    className="w-full shadow-md"
                    required
                  />
                  {/* botao +*/}
                  {index === formData.areasAtuacao.length - 1 && (
                    <Button
                      type="button"
                      onClick={handleAddArea}
                      className="w-10 h-10 p-0 flex items-center justify-center bg-gray-200 text-gray-700 hover:bg-gray-300"
                    >
                      +
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* link para currículo*/}
          <div className="mb-6">
            <Input
              type="url"
              id="linkCurriculo"
              name="linkCurriculo"
              value={formData.linkCurriculo}
              onChange={handleChange}
              placeholder="Link para currículo (Lattes ou LinkedIn)"
              className="w-full shadow-md"
            />
          </div>

          {/* botao concluir*/}
          <div className="flex justify-center">
            <Button
              type="submit"
              className="w-1/2 shadow-md" 
            >
              Concluir Cadastro
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}