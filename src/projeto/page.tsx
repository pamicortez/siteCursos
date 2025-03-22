"use client"

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Trash2 } from 'lucide-react'; // Ícone para o botão de remover

type Collaborator = {
  name: string;
  role: string;
};

export default function Projeto() {
  const [projectData, setProjectData] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    category: '',
    image: '',
  });

  const [collaborators, setCollaborators] = useState<Collaborator[]>([
    { name: '', role: '' }, // Inicia com um colaborador vazio
  ]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProjectData(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProjectData(prevState => ({
        ...prevState,
        image: URL.createObjectURL(file),
      }));
    }
  };

  const handleCollaboratorChange = (index: number, field: string, value: string) => {
    const updatedCollaborators = [...collaborators];
    updatedCollaborators[index] = {
      ...updatedCollaborators[index],
      [field]: value,
    };
    setCollaborators(updatedCollaborators);
  };

  const addCollaborator = React.useCallback(() => {
    setCollaborators([...collaborators, { name: '', role: '' }]);
  }, [collaborators]);

  const removeCollaborator = (index: number) => {
    const updatedCollaborators = collaborators.filter((_, i) => i !== index);
    setCollaborators(updatedCollaborators);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({
      ...projectData,
      collaborators,
    });
    // Aqui você pode adicionar a lógica para salvar os dados
  };

  const handleCancel = () => {
    // Lógica para cancelar (limpar o formulário ou redirecionar)
    setProjectData({
      title: '',
      description: '',
      startDate: '',
      endDate: '',
      category: '',
      image: '',
    });
    setCollaborators([{ name: '', role: '' }]);
    console.log("Formulário cancelado");
  };

  return (
    <div className="flex justify-center">
      <form onSubmit={handleSubmit} className="w-full max-w-4xl px-4">
        <div className="py-12">
          <h1 className="text-3xl font-bold mb-12 text-center">Criar Projeto</h1>

          {/* Linha 1: Título do projeto */}
          <div className="grid gap-8 mb-8"> {/* Aumentei o gap para 8 */}
            <div className="grid items-center gap-1.5">
              <Label htmlFor="title">Título do projeto*</Label>
              <Input
                type="text"
                id="title"
                name="title"
                value={projectData.title}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Linha 2: Descrição do projeto */}
          <div className="grid gap-8 mb-8"> {/* Aumentei o gap para 8 */}
            <div className="grid items-center gap-1.5">
              <Label htmlFor="description">Descrição do projeto*</Label>
              <textarea
                id="description"
                name="description"
                value={projectData.description}
                onChange={handleChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                required
              />
            </div>
          </div>

          {/* Linha 3: Datas de início e finalização */}
          <div className="grid gap-8 mb-8 md:grid-cols-2"> {/* Aumentei o gap para 8 */}
            <div className="grid items-center gap-1.5">
              <Label htmlFor="startDate">Data de início do projeto*</Label>
              <Input
                type="date"
                id="startDate"
                name="startDate"
                value={projectData.startDate}
                onChange={handleChange}
                required
              />
            </div>

            <div className="grid items-center gap-1.5">
              <Label htmlFor="endDate">Data de finalização do projeto</Label>
              <Input
                type="date"
                id="endDate"
                name="endDate"
                value={projectData.endDate}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Linha 4: Categoria e Imagem */}
          <div className="grid gap-8 mb-8 md:grid-cols-2"> {/* Aumentei o gap para 8 */}
            <div className="grid items-center gap-1.5">
              <Label htmlFor="category">Categoria do projeto*</Label>
              <Select
                onValueChange={(value) => setProjectData(prevState => ({
                  ...prevState,
                  category: value,
                }))}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione uma categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="informatica">Informática</SelectItem>
                    <SelectItem value="design">Design</SelectItem>
                    <SelectItem value="marketing">Marketing</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div className="grid items-center gap-1.5">
              <Label htmlFor="image">Imagem do projeto</Label>
              <Input
                type="file"
                id="image"
                name="image"
                onChange={handleImageChange}
              />
            </div>
          </div>

          {/* Linha 5: Colaboradores */}
          <div className="grid gap-8 mb-8"> {/* Aumentei o gap para 8 */}
            <div className="flex justify-between items-center">
              <Label>Colaboradores</Label>
              <Button type="button" onClick={addCollaborator} className="w-fit">
                + Adicionar colaborador
              </Button>
            </div>
            {collaborators.map((collaborator, index) => (
              <div key={index} className="grid gap-6 md:grid-cols-2 items-end">
                <div className="grid items-center gap-1.5">
                  <Input
                    type="text"
                    placeholder="Nome do colaborador"
                    value={collaborator.name}
                    onChange={(e) => handleCollaboratorChange(index, 'name', e.target.value)}
                  />
                </div>
                <div className="flex items-center gap-1">
                  <Select
                    value={collaborator.role}
                    onValueChange={(value) => handleCollaboratorChange(index, 'role', value)}
                  >
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Selecione o cargo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="coordenador">Coordenador(a)</SelectItem>
                        <SelectItem value="colaborador">Colaborador(a)</SelectItem>
                        <SelectItem value="bolsista">Bolsista</SelectItem>
                        <SelectItem value="voluntario">Voluntário</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => removeCollaborator(index)}
                    className="text-black hover:text-black hover:bg-gray-100 p-2"
                  >
                    <Trash2 className="h-4 w-4" /> {/* Ícone de lixeira */}
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* Linha 6: Botões Cancelar (esquerda) e Salvar (direita) */}
          <div className="flex justify-between mt-8"> {/* Adicionei margem superior */}
            <Button type="button" variant="outline" onClick={handleCancel}>
              Cancelar
            </Button>
            <Button type="submit">Salvar</Button>
          </div>
        </div>
      </form>
    </div>
  );
}