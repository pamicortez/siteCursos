
"use client"

import React, { useState, useEffect, useCallback } from 'react';
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

type ColaboradorFromAPI = {
  id: number;
  nome: string;
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

export default function Evento() {
  const router = useRouter();
  const params = useParams();
  const eventoId = params?.id as string | undefined;

  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [eventoData, setEventoData] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    category: '',
    image: '',
    local: '',
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
    eventoId: null as string | null,
  });
  const [categories, setCategories] = useState<string[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [colaboradoresDisponiveis, setColaboradoresDisponiveis] = useState<ColaboradorFromAPI[]>([]);
  const [suggestions, setSuggestions] = useState<{index: number, names: string[]} | null>(null);

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
        const response = await fetch("/api/colaborador");
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
    if (eventoId) {
      setIsEditMode(true);
      fetchEventoData(eventoId);
    }
  }, [eventoId]);

  const fetchEventoData = async (id: string) => {
    try {
      const response = await fetch(`/api/evento?id=${id}`);
      if (!response.ok) throw new Error('Evento não encontrado');

      const data = await response.json();
      setEventoData({
        title: data.titulo,
        description: data.descricao,
        startDate: data.dataInicio.split('T')[0],
        endDate: data.dataFim ? data.dataFim.split('T')[0] : '',
        category: data.categoria,
        image: data.imagem,
        local: data.local,
      });

      if (data.colaboradores) {
        setCollaborators(data.colaboradores);
      }
    } catch (error) {
      console.error("Erro ao carregar evento:", error);
    }
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/enums/categoriaCurso");
        if (!response.ok) {
          throw new Error("Erro ao buscar categorias de evento");
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
    setEventoData(prevState => ({
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
        setEventoData(prevState => ({
          ...prevState,
          image: base64String 
        }));
      };
      
      reader.readAsDataURL(file);
    }
  };

  const handleCollaboratorNameChange = (index: number, value: string) => {
    // Permite espaços entre palavras, mas remove espaços extras no início/final
    const trimmedValue = value.trimStart(); // Mantém espaços no meio, mas remove no início
    
    // Verifica se há múltiplos espaços consecutivos e substitui por um único
    const normalizedValue = trimmedValue.replace(/\s+/g, ' ');
    
    // Verifica se há mais de duas palavras (nome + sobrenome)
    const wordCount = normalizedValue.split(' ').filter(word => word.length > 0).length;
    if (wordCount > 2) {
      return; // Não permite mais de dois nomes
    }
  
    const updatedCollaborators = [...collaborators];
    updatedCollaborators[index] = {
      ...updatedCollaborators[index],
      name: normalizedValue,
    };
    setCollaborators(updatedCollaborators);
  
    // Mostrar sugestões se houver texto
    if (normalizedValue.length > 0) {
      const matchedNames = colaboradoresDisponiveis
        .filter(colab => colab.nome.toLowerCase().includes(normalizedValue.toLowerCase()))
        .map(colab => colab.nome)
        .slice(0, 5); // Limita a 5 sugestões
      
      setSuggestions(matchedNames.length > 0 ? {index, names: matchedNames} : null);
    } else {
      setSuggestions(null);
    }
  };

  const handleCollaboratorRoleChange = (index: number, value: string) => {
    const updatedCollaborators = [...collaborators];
    updatedCollaborators[index] = {
      ...updatedCollaborators[index],
      role: value,
    };
    setCollaborators(updatedCollaborators);
  };

  const addCollaborator = useCallback(() => {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validação dos nomes dos colaboradores (remove espaços extras)
    const validatedCollaborators = collaborators.map(colab => ({
      ...colab,
      name: colab.name.trim().replace(/\s+/g, ' '), 
    }));

    const requestBody = {
      titulo: eventoData.title,
      imagem: eventoData.image,
      descricao: eventoData.description,
      categoria: eventoData.category,
      dataInicio: new Date(eventotData.startDate).toISOString(),
      dataFim: eventoData.endDate ? new Date(eventotData.endDate).toISOString() : null,
      funcao: cargo,
      colaboradores: validatedCollaborators.map(colaborador => ({
        categoria: colaborador.role,
        nome: colaborador.name.trim() // Garante que não há espaços extras
      })),
      ...(isEditMode ? {} : { usuarioId: 1 })
    };
    
    console.log(requestBody)
  
    try {
      const rout = isEditMode ? `/api/evento?id=${eventoId}` : "/api/evento";
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
          message: isEditMode ? 'Evento atualizado com sucesso.' : 'Evento criado com sucesso.',
          isError: false,
          eventoId: data.id 
        });
      } else {
        const errorData = await response.json();
        console.error("Erro da API:", errorData);
        setResultDialog({
          title: 'Erro',
          message: 'Erro ao salvar o evento, tente novamente mais tarde.',
          isError: true,
          eventoId: null
        });
      }
    } catch (error) {
      console.error(error);
      setResultDialog({
        title: 'Erro',
        message: 'Erro ao salvar o evento, tente novamente mais tarde.',
        isError: true,
        eventoId: null
      });
    } finally {
      setShowResultDialog(true);
    }
  };

  const handleSuccessConfirm = () => {
    if (resultDialog.eventoId) {
      router.push(`/evento/${resultDialog.eventoId}`);
    } else {
      setShowResultDialog(false);
    }
  };

  const handleCancelClick = () => {
    const hasData = eventoData.title || 
                    eventoData.description || 
                    eventoData.startDate || 
                    eventoData.endDate || 
                    eventoData.category || 
                    eventoData.image || 
                   collaborators.some(c => c.name || c.role);
    
    if (hasData) {
      setShowCancelDialog(true);
    } else {
      router.push('/home');
    }
  };

  const handleConfirmCancel = () => {
    setEventoData({
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
          <h1 className="text-3xl font-bold mb-12 text-center">{isEditMode ? 'Editar Evento' : 'Criar Evento'}</h1>

          <div className="grid gap-8 mb-8">
            <div className="grid items-center gap-1.5">
              <Label htmlFor="title">Título do evento*</Label>
              <Input
                type="text"
                id="title"
                name="title"
                value={eventoData.title}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="grid gap-8 mb-8">
            <div className="grid items-center gap-1.5">
              <Label htmlFor="description">Descrição do evento*</Label>
              <textarea
                id="description"
                name="description"
                value={eventoData.description}
                onChange={handleChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                required
              />
            </div>
          </div>

          <div className="grid gap-8 mb-8">
            <div className="grid items-center gap-1.5">
              <Label htmlFor="description">Local do evento*</Label>
              <textarea
                id="description"
                name="description"
                value={eventoData.local}
                onChange={handleChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                required
              />
            </div>
          </div>
          
          <div className="grid gap-8 mb-8">
            <div className="grid items-center gap-1.5">
              <Label className="text-sm font-medium text-gray-700">Meu cargo no evento*</Label>
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
              <Label htmlFor="startDate">Data de início do evento*</Label>
              <Input
                type="date"
                id="startDate"
                name="startDate"
                value={eventoData.startDate}
                onChange={handleChange}
                required
              />
            </div>

            <div className="grid items-center gap-1.5">
              <Label htmlFor="endDate">Data de finalização do evento</Label>
              <Input
                type="date"
                id="endDate"
                name="endDate"
                value={eventoData.endDate}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="grid gap-8 mb-8 md:grid-cols-2">
            <div className="grid items-center gap-1.5">
              <Label htmlFor="category">Categoria do evento*</Label>
              <Select
                value={eventoData.category}
                onValueChange={(value) => setEventoData(prevState => ({
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
              <Label htmlFor="image">Imagem do evento</Label>
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
                <div className="grid items-center gap-1.5 relative">
                  <Input
                    type="text"
                    placeholder="Nome do colaborador"
                    value={collaborator.name}
                    onChange={(e) => handleCollaboratorNameChange(index, e.target.value)}
                  />
                  {suggestions?.index === index && (
                    <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-md shadow-lg z-10 mt-1">
                      {suggestions.names.map((name, i) => (
                        <div 
                          key={i}
                          className="p-2 hover:bg-gray-100 cursor-pointer"
                          onClick={() => selectSuggestion(index, name)}
                        >
                          {name}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  <Select
                    value={collaborator.role}
                    onValueChange={(value) => handleCollaboratorRoleChange(index, value)}
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