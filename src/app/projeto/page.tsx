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
import { Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

type Collaborator = {
  name: string;
  role: string;
};

function ConfirmationModal({ 
  isOpen, 
  onClose, 
  onConfirm 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  onConfirm: () => void 
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-md w-full shadow-xl border border-gray-200">
        <h2 className="text-xl font-bold mb-4">Tem certeza que deseja cancelar?</h2>
        <p className="mb-6">Todas as alterações não salvas serão perdidas.</p>
        <div className="flex justify-end gap-4">
          <Button 
            variant="outline"
            onClick={onClose}
          >
            Continuar editando
          </Button>
          <Button 
            variant="destructive"
            onClick={onConfirm}
          >
            Sim, cancelar
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function Projeto() {
  const router = useRouter();
  const [projectData, setProjectData] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    category: '',
    image: '',
  });

  const [collaborators, setCollaborators] = useState<Collaborator[]>([
    { name: '', role: '' },
  ]);

  const [showCancelDialog, setShowCancelDialog] = useState(false);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const requestBody = {
      titulo: projectData.title,
      imagem: projectData.image,
      descricao: projectData.description,
      categoria: projectData.category,
      dataInicio: new Date(projectData.startDate).toISOString(),
      dataFim: projectData.endDate ? new Date(projectData.endDate).toISOString() : null,
      usuarioId: 1,
      projetoColaborador: {
        create: collaborators.map(collab => ({
          nome: collab.name,
          cargo: collab.role
        }))
      }
    };
  
    try {
      console.log(JSON.stringify(requestBody))
      const response = await fetch("/api/projeto", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Erro da API:", errorData);
        throw new Error("Erro ao salvar o projeto.");
      }
  
      console.log("Projeto salvo com sucesso!");
    } catch (error) {
      console.error(error);
    }
  };

  const handleCancelClick = () => {
    const hasData = projectData.title || 
                   projectData.description || 
                   projectData.startDate || 
                   projectData.endDate || 
                   projectData.category || 
                   projectData.image || 
                   collaborators.some(c => c.name || c.role);
    
    if (hasData) {
      setShowCancelDialog(true);
    } else {
      router.push('/home');
    }
  };

  const handleConfirmCancel = () => {
    setProjectData({
      title: '',
      description: '',
      startDate: '',
      endDate: '',
      category: '',
      image: '',
    });
    setCollaborators([{ name: '', role: '' }]);
    setShowCancelDialog(false);
    router.push('/home');
  };

  const handleContinueEditing = () => {
    setShowCancelDialog(false);
  };

  return (
    <div className="flex justify-center">
      <form onSubmit={handleSubmit} className="w-full max-w-4xl px-4">
        <div className="py-12">
          <h1 className="text-3xl font-bold mb-12 text-center">Criar Projeto</h1>

          <div className="grid gap-8 mb-8">
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

          <div className="grid gap-8 mb-8">
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

          <div className="grid gap-8 mb-8 md:grid-cols-2">
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

          <div className="grid gap-8 mb-8 md:grid-cols-2">
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

          <div className="grid gap-8 mb-8">
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
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-between mt-8">
            <Button type="button" variant="outline" onClick={handleCancelClick}>
              Cancelar
            </Button>
            <Button type="submit">Salvar</Button>
          </div>
        </div>
      </form>

      <ConfirmationModal
        isOpen={showCancelDialog}
        onClose={handleContinueEditing}
        onConfirm={handleConfirmCancel}
      />
    </div>
  );
}