"use client"

import React, { useState, useEffect, useCallback, useRef } from 'react';
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
import { Trash2, ImagePlus } from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';
import { useSession } from "next-auth/react";
import ImageCropper from "@/components/ui/ImageCropperBase64";
import { ConfirmationModal } from '@/components/ConfirmationModal';

// ... (types mantidos iguais)
type ColaboradorFromAPI = {
  id: number;
  nome: string;
};

type User = {
  id: number;
  Nome: string;
  email: string;
}

interface ProjetoColaborador {
  id: number;
  categoria: string;
  idProjeto: number;
  idColaborador: number;
  colaborador: ColaboradorFromAPI;
}


type SuggestionItem = {
  label: string;
  nome: string;
};

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
    image: ''
  });

  const [collaborators, setCollaborators] = useState<Array<{ name: string; role: string }>>([]);

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

  interface Category {
    value: string;
    label: string;
  }

  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [colaboradoresDisponiveis, setColaboradoresDisponiveis] = useState<User[]>([]);
  const [suggestions, setSuggestions] = useState<{ index: number; names: SuggestionItem[] } | null>(null);
  const { data: session, status } = useSession();
  const [showImageCropper, setShowImageCropper] = useState(false);
  const [tempImage, setTempImage] = useState<string | null>(null);

  const imageInputRef = useRef<HTMLInputElement>(null);
  const [imagemBase64, setImagemBase64] = useState<string | null>(null);

  // ... (todos os useEffect e funções mantidos iguais até handleSubmit)

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

    const fetchColaboradores = async () => {
      try {
        const response = await fetch("/api/usuario?tipo=Ativo");
        if (!response.ok) {
          throw new Error("Erro ao buscar colaboradores");
        }
        const data = await response.json();
        setColaboradoresDisponiveis(data);
      } catch (error) {
        console.error("Erro ao buscar colaboradores:", error);
      }
    };

    fetchCargosColaborador();
    fetchColaboradores();
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      console.log("Verificando status...", status);

      if (status === "loading") {
        return;
      }

      clearInterval(intervalId);

      if (status !== "authenticated") {
        router.push("/404");
        return;
      }

      if (projectId) {
        setIsEditMode(true);
        fetchProjectData(projectId);
      }
    }, 300);
    return () => clearInterval(intervalId);
  }, [projectId, status]);

  const fetchProjectData = async (id: string) => {
    try {
      const response = await fetch(`/api/projeto?id=${id}`);
      if (!response.ok) throw new Error('Projeto não encontrado');

      const data = await response.json();

      const isProjectOwner = data.projetoUsuario?.some
        ((user: any) =>
          Number(user.idUsuario) === Number(session?.user?.id)
        );
      console.log(isProjectOwner, data)

      if (!isProjectOwner) {
        router.push("/home");
      }

      setProjectData({
        title: data.titulo,
        description: data.descricao,
        startDate: data.dataInicio.split('T')[0],
        endDate: data.dataFim ? data.dataFim.split('T')[0] : '',
        category: data.categoria,
        image: data.imagem
      });

      setImagemBase64(data.imagem);

      const mappedCollaborators = data.projetoColaborador.map((colab: ProjetoColaborador) => ({
        name: colab.colaborador.nome,
        role: colab.categoria
      }));

      setCollaborators(mappedCollaborators);

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
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      setTempImage(base64);
      setShowImageCropper(true);
    };
    reader.readAsDataURL(file);
  };

  const handleCollaboratorNameChange = (index: number, value: string) => {
    const trimmedValue = value.trimStart();
    const normalizedValue = trimmedValue.replace(/\s+/g, ' ');
    const wordCount = normalizedValue.split(' ').filter(word => word.length > 0).length;
    if (wordCount > 2) {
      return;
    }

    const updatedCollaborators = [...collaborators];
    updatedCollaborators[index] = {
      ...updatedCollaborators[index],
      name: normalizedValue,
    };
    setCollaborators(updatedCollaborators);

    if (normalizedValue.length > 0) {
      const matchedNames = colaboradoresDisponiveis
        .filter(colab => {
          const isNotCurrentUser = colab.id !== Number(session?.user?.id);
          const matchesNome = colab.Nome.toLowerCase().includes(normalizedValue.toLowerCase());
          const matchesEmail = colab.email.toLowerCase().includes(normalizedValue.toLowerCase());

          console.log({
            colabId: colab.id,
            sessionUserId: Number(session?.user?.id),
            isNotCurrentUser,
            matchesNome,
            matchesEmail,
            shouldInclude: isNotCurrentUser && (matchesNome || matchesEmail)
          });

          return isNotCurrentUser && (matchesNome || matchesEmail);
        })
        .map(colab => ({
          label: `${colab.Nome} (${colab.email})`,
          nome: colab.Nome
        }))
        .slice(0, 5);

      setSuggestions(matchedNames.length > 0 ? { index, names: matchedNames } : null);
    } else {
      setSuggestions(null);
    }
  };

  const handleSelectImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      setTempImage(base64);
      setShowImageCropper(true);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleSelectSuggestion = (nome: string, index: number) => {
    const updated = [...collaborators];
    updated[index].name = nome;
    setCollaborators(updated);
    setSuggestions(null);
  };

  const handleCollaboratorRoleChange = (index: number, value: string) => {
    const updatedCollaborators = [...collaborators];
    updatedCollaborators[index] = {
      ...updatedCollaborators[index],
      role: value,
    };
    setCollaborators(updatedCollaborators);
  };

  const handleCropSuccess = (base64: string) => {
    setImagemBase64(base64);
    setShowImageCropper(false);
  };

  const removeImage = () => {
    setImagemBase64(null);
    setProjectData(prevState => ({
      ...prevState,
      image: ''
    }));
  };

  const addCollaborator = useCallback(() => {
    const last = collaborators[collaborators.length - 1];

    if (last && (!last.name.trim() || !last.role.trim())) {
      alert("Preencha o nome e o cargo do colaborador antes de adicionar outro.");
      return;
    }
    setCollaborators([...collaborators, { name: '', role: '' }]);
  }, [collaborators]);

  const removeCollaborator = (index: number) => {
    const updatedCollaborators = collaborators.filter((_, i) => i !== index);
    setCollaborators(updatedCollaborators);
    setSuggestions(null);
  };

  const selectSuggestion = (index: number, name: string) => {
    const updatedCollaborators = [...collaborators];
    updatedCollaborators[index] = {
      ...updatedCollaborators[index],
      name: name,
    };
    setCollaborators(updatedCollaborators);
    setSuggestions(null);
  };

  function validateCollaborators() {
    for (const collaborator of collaborators) {
      if (!collaborator.name.trim() || !collaborator.role.trim()) {
        alert("Todos os colaboradores devem ter nome e cargo preenchidos.");
        return false;
      }
    }
    return true;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validatedCollaborators = collaborators.map(colab => ({
      ...colab,
      name: colab.name.trim().replace(/\s+/g, ' '),
    }));

    if (!validateCollaborators()) {
      return;
    }

    const requestBody = {
      titulo: projectData.title,
      imagem: imagemBase64 || projectData.image,
      descricao: projectData.description,
      categoria: projectData.category,
      dataInicio: new Date(projectData.startDate).toISOString(),
      dataFim: projectData.endDate ? new Date(projectData.endDate).toISOString() : null,
      funcao: cargo,
      colaboradores: validatedCollaborators.length > 0
        ? validatedCollaborators.map(colaborador => ({
          categoria: colaborador.role,
          nome: colaborador.name.trim()
        }))
        : [],
      ...(isEditMode ? {} : { usuarioId: Number(session?.user?.id) })
    };

    console.log(requestBody)

    try {
      const rout = isEditMode ? `/api/projeto?id=${projectId}` : "/api/projeto";
      const response = await fetch(rout, {
        method: isEditMode ? "PATCH" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (response.ok) {
        const data = await response.json();
        setResultDialog({
          title: 'Sucesso!',
          message: isEditMode ? 'Projeto atualizado com sucesso.' : 'Projeto criado com sucesso.',
          isError: false,
          projectId: data.id
        });
      } else {
        const errorData = await response.json();
        console.error("Erro da API:", errorData);
        setResultDialog({
          title: 'Erro',
          message: 'Erro ao salvar o projeto, tente novamente mais tarde. Erro: ' + errorData.message,
          isError: true,
          projectId: null
        });
      }
    } catch (error) {
      console.error(error);
      setResultDialog({
        title: 'Erro',
        message: 'Erro ao salvar o projeto, tente novamente mais tarde. Erro: ' + error,
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
      image: ''
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
          <h1 className="text-3xl font-bold mb-12 text-center">{isEditMode ? 'Editar Projeto' : 'Criar Projeto'}</h1>

          <div className="grid items-center gap-1.5 max-w-md mx-auto mb-12">
            <Label htmlFor="image">Imagem do projeto</Label>

            {/* Input oculto para seleção de arquivo */}
            <Input
              id="image-upload-input"
              type="file"
              className="hidden"
              ref={imageInputRef}
              onChange={handleSelectImage}
              accept="image/png, image/jpeg, image/jpg, image/webp"
            />

            {(imagemBase64 || projectData.image) ? (
              <div className="relative group w-full h-48">
                <img
                  src={imagemBase64 || projectData.image}
                  alt="Imagem do projeto"
                  className="rounded-lg object-cover w-full h-full border"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-2 right-2 bg-black bg-opacity-60 text-white rounded-full p-1.5 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity"
                  aria-label="Remover imagem"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => imageInputRef.current?.click()}
                className="w-full h-48 border-2 border-dashed rounded-lg flex flex-col items-center justify-center text-gray-500 hover:bg-gray-50 hover:text-gray-600 transition-colors"
              >
                <ImagePlus className="h-10 w-10 mb-2" />
                <span>Adicionar Imagem</span>
              </button>
            )}
          </div>


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
                <label htmlFor="cargo-coordenador" className="inline-flex items-center space-x-2">
                  <input
                    id="cargo-coordenador"
                    type="radio"
                    className="h-4 w-4 accent-black border-gray-300 focus:ring-black cursor-pointer"
                    name="cargo"
                    value="Coordenador"
                    checked={cargo === "Coordenador"}
                    onChange={() => setCargo("Coordenador")}
                  />
                  <span className="text-sm text-gray-700">Coordenador</span>
                </label>
                <label htmlFor="cargo-colaborador" className="inline-flex items-center space-x-2">
                  <input
                    id="cargo-colaborador"
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
                value={projectData.category}
                onValueChange={(value) => setProjectData(prevState => ({
                  ...prevState,
                  category: value,
                }))}
              >
                <SelectTrigger id="category" name="category" className="w-full">
                  <SelectValue placeholder="Selecione uma categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {loadingCategories ? (
                      <SelectItem value="loading" disabled>Carregando categorias...</SelectItem>
                    ) : (
                      categories.map((category) => (
                        <SelectItem key={category.value} value={category.value}>
                          {category.label}
                        </SelectItem>
                      ))
                    )}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

          </div>

          <div className="grid gap-8 mb-8">
            <div className="flex justify-between items-center">
              <Label>Colaboradores</Label>
              <Button type="button" onClick={addCollaborator} className="w-fit">
                + Adicionar colaborador
              </Button>
            </div>
            {collaborators.length === 0 && (
              <p className="text-gray-500">Nenhum colaborador adicionado.</p>
            )}

            {collaborators.map((collaborator, index) => (
              <div key={index} className="grid gap-6 md:grid-cols-2 items-end">
                <div className="grid items-center gap-1.5 relative">
                  <Label htmlFor={`collaborator-name-${index}`}>Nome do colaborador</Label>
                  <Input
                    id={`collaborator-name-${index}`}
                    name={`collaborator-name-${index}`}
                    type="text"
                    placeholder="Nome do colaborador"
                    value={collaborator.name}
                    onChange={(e) => handleCollaboratorNameChange(index, e.target.value)}
                  />
                  {suggestions?.index === index && (
                    <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-md shadow-lg z-10 mt-1">
                      {suggestions.names.map((nameObj, i) => (
                        <div
                          key={i}
                          className="p-2 hover:bg-gray-100 cursor-pointer"
                          onClick={() => selectSuggestion(index, nameObj.nome)}
                        >
                          {nameObj.label}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  <div className="flex-1">
                    <Label htmlFor={`collaborator-role-${index}`}>Cargo do colaborador</Label>
                    <Select
                      value={collaborator.role}
                      onValueChange={(value) => handleCollaboratorRoleChange(index, value)}
                    >
                      <SelectTrigger id={`collaborator-role-${index}`} name={`collaborator-role-${index}`} className="flex-1">
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
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => removeCollaborator(index)}
                    className="text-black hover:text-black hover:bg-gray-100 p-2 mt-6"
                    aria-label={`Remover colaborador ${index + 1}`}
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

      {showImageCropper && (
        <ImageCropper
          imageSrc={tempImage}
          onUploadSuccess={handleCropSuccess}
          isOpen={showImageCropper}
          onClose={() => setShowImageCropper(false)}
        />
      )}
    </div>
  );
}