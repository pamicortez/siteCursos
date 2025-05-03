"use client"

import React, { useState, useEffect } from 'react';
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
import { useRouter, useParams } from 'next/navigation';

type Collaborator = {
  name: string;
  role: string;
};

function ConfirmationModal({ 
  isOpen, 
  onClose, 
  onConfirm,
  title,
  message,
  confirmText,
  variant = 'default'
}: { 
  isOpen: boolean; 
  onClose?: () => void; 
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText: string;
  variant?: 'default' | 'destructive';
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-md w-full shadow-xl border border-gray-200">
        <h2 className="text-xl font-bold mb-4">{title}</h2>
        <p className="mb-6">{message}</p>
        <div className="flex justify-end gap-4">
          {onClose && (
            <Button 
              variant="outline"
              onClick={onClose}
            >
              Continuar editando
            </Button>
          )}
          <Button 
            variant={variant}
            onClick={onConfirm}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function Projeto() {
  const router = useRouter();
  const params = useParams();
  const projectId = params?.id as string | undefined;

  const [isEditMode, setIsEditMode] = useState<boolean>(false);
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

  const [cargosColaborador, setCargosColaborador] = useState<string[]>([]);
  const [cargo, setCargo] = useState<string>("Coordenador");
  const [loadingCargos, setLoadingCargos] = useState(true);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [showResultDialog, setShowResultDialog] = useState(false);
  const [resultDialog, setResultDialog] = useState({
    title: '',
    message: '',
    isError: false,
    projectId: null as string | null,
  });
  const [categories, setCategories] = useState<string[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  useEffect(() => {
    const fetchCargosColaborador = async () => {
      try {
        const response = await fetch("/api/enums/colaboradorCategoria");
        if (!response.ok) {
          throw new Error("Erro ao buscar cargos de colaborador");
        }
        const data = await response.json();
        setCargosColaborador(data);
      } catch (error) {
        console.error("Erro:", error);
      } finally {
        setLoadingCargos(false);
      }
    };

    fetchCargosColaborador();
  }, []);

  useEffect(() => {
    if (projectId) {
      setIsEditMode(true);
      fetchProjectData(projectId);
    }
  }, [projectId]);

  const fetchProjectData = async (id: string) => {
    try {
      const response = await fetch(`/api/projeto?id=${id}`);
      if (!response.ok) throw new Error('Projeto não encontrado');

      const data = await response.json();
      setProjectData({
        title: data.titulo,
        description: data.descricao,
        startDate: data.dataInicio.split('T')[0],
        endDate: data.dataFim ? data.dataFim.split('T')[0] : '',
        category: data.categoria,
        image: data.imagem,
      });

      if (data.colaboradores) {
        setCollaborators(data.colaboradores);
      }
    } catch (error) {
      console.error("Erro ao carregar projeto:", error);
    }
  };
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/enums/categoriaCurso");
        if (!response.ok) {
          throw new Error("Erro ao buscar categorias de projeto");
        }
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error("Erro:", error);
      } finally {
        setLoadingCategories(false);
      }
    };
  
    fetchCategories();
  }, []);


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
      const reader = new FileReader();
      
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setProjectData(prevState => ({
          ...prevState,
          image: base64String 
        }));
      };
      
      reader.readAsDataURL(file);
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
      funcao: cargo,
      colaboradores: collaborators.map(colaborador => ({
        categoria: colaborador.role,
        nome: colaborador.name
      })),
      ...(isEditMode ? {} : { usuarioId: 1 })
    };
    
    console.log(requestBody)
  
    try {
      const rout = isEditMode? `/api/projeto?id=${projectId}`: "/api/projeto"
      const response = await fetch(rout, {
        method: isEditMode ? "PATCH":"POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });
  
      if (response.ok) {
        const data = await response.json();
        setResultDialog({
          title: 'Sucesso!',
          message: 'Projeto criado com sucesso.',
          isError: false,
          projectId: data.id 
        });
      } else {
        const errorData = await response.json();
        console.error("Erro da API:", errorData);
        setResultDialog({
          title: 'Erro',
          message: 'Erro ao salvar o projeto, tente novamente mais tarde.',
          isError: true,
          projectId: null
        });
      }
    } catch (error) {
      console.error(error);
      setResultDialog({
        title: 'Erro',
        message: 'Erro ao salvar o projeto, tente novamente mais tarde.',
        isError: true,
        projectId: null
      });
    } finally {
      setShowResultDialog(true);
    }
  };

  const handleSuccessConfirm = () => {
    if (resultDialog.projectId) {
      router.push(`/projeto/${resultDialog.projectId}`);
    } else {
      setShowResultDialog(false);
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
          <h1 className="text-3xl font-bold mb-12 text-center">  {isEditMode ? 'Editar Projeto' : 'Criar Projeto'}</h1>

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
          
          <div className="grid gap-8 mb-8">
            <div className="grid items-center gap-1.5">
              <Label className="text-sm font-medium text-gray-700">Meu cargo no projeto*</Label>
              <div className="flex items-center space-x-6 mt-2">
                <label className="inline-flex items-center space-x-2">
                  <input 
                    type="radio" 
                    className="h-4 w-4 accent-black border-gray-300 focus:ring-black cursor-pointer"
                    name="cargo"
                    value="Coordenador"
                    checked={cargo === "Coordenador"}
                    onChange={() => setCargo("Coordenador")}
                  />
                  <span className="text-sm text-gray-700">Coordenador</span>
                </label>
                <label className="inline-flex items-center space-x-2">
                  <input 
                    type="radio" 
                    className="h-4 w-4 accent-black border-gray-300 focus:ring-black cursor-pointer"
                    name="cargo"
                    value="Colaborador"
                    checked={cargo === "Colaborador"}
                    onChange={() => setCargo("Colaborador")}
                  />
                  <span className="text-sm text-gray-700">Colaborador</span>
                </label>
              </div>
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
                  {loadingCategories ? (
                    <SelectItem value="loading" disabled>Carregando categorias...</SelectItem>
                  ) : (
                    categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))
                  )}
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
                accept="image/png, image/jpeg, image/jpg, image/webp"
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
                        {loadingCargos ? (
                          <SelectItem value="loading" disabled>Carregando...</SelectItem>
                        ) : (
                          cargosColaborador.map((cargo) => (
                            <SelectItem key={cargo} value={cargo}>
                              {cargo}
                            </SelectItem>
                          ))
                        )}
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
        title="Tem certeza que deseja cancelar?"
        message="Todas as alterações não salvas serão perdidas."
        confirmText="Sim, cancelar"
        variant="destructive"
      />

      <ConfirmationModal
        isOpen={showResultDialog}
        onConfirm={handleSuccessConfirm}
        title={resultDialog.title}
        message={resultDialog.message}
        confirmText="OK"
        variant={resultDialog.isError ? 'destructive' : 'default'}
      />

    </div>
  );
}