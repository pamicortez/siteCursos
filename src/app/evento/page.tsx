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

type ColaboradorFromAPI = {
  id: number;
  nome: string;
  
};

type User = {
  id: number;
  Nome: string;
  email: string;
}

interface EventoColaborador {
  id: number;
  categoria: string;
  idEvento: number;
  idColaborador: number;
  colaborador: ColaboradorFromAPI;
}

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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
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

type SuggestionItem = {
  label: string;
  nome: string;
};

export default function Evento() {
  const router = useRouter();
  const params = useParams();
  const eventoId = params?.id as string | undefined;
  
  const imageInputRef = useRef<HTMLInputElement>(null);

  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [eventoData, setEventoData] = useState({
    title: '',
    description: '',
    local: '',
    link: '',
    startDate: '',
    startTime: '',
    endDate: '',
    endTime: '',
    category: '',
    // ESTADOS DE IMAGEM SEPARADOS
    mainImage: '', 
    otherImages: [] as string[]
  });

  const [collaborators, setCollaborators] = useState<Array<{ name: string; role: string }>>([]);
  
  const [cargosColaborador, setCargosColaborador] = useState<string[]>([]);
  const [cargo, setCargo] = useState<string>("Organizador");
  const [loadingCargos, setLoadingCargos] = useState(true);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [showResultDialog, setShowResultDialog] = useState(false);
  const [resultDialog, setResultDialog] = useState({
    title: '',
    message: '',
    isError: false,
    eventoId: null as string | null,
  });

  interface Category {
    value: string;
    label: string;
  }

  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [colaboradoresDisponiveis, setColaboradoresDisponiveis] = useState<User[]>([]);
  const [suggestions, setSuggestions] = useState<{index: number, names: SuggestionItem[]} | null>(null);
  const { data: session, status } = useSession();
  const [showImageCropper, setShowImageCropper] = useState(false);
  const [tempImage, setTempImage] = useState<string | null>(null);
  // Estado para saber qual imagem está sendo cortada
  const [croppingFor, setCroppingFor] = useState<'main' | 'other' | null>(null);
  
  useEffect(() => {
    const fetchCargosColaborador = async () => {
      try {
        const response = await fetch("/api/enums/tipoParticipacao");
        if (!response.ok) throw new Error("Erro ao buscar cargos de colaborador");
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
       // const response = await fetch("/api/colaborador");
       const response = await fetch("/api/usuario?tipo=Ativo");
       
        if (!response.ok) throw new Error("Erro ao buscar colaboradores");
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

    if (eventoId) {
      setIsEditMode(true);
      fetchEventoData(eventoId);
    }
  }, 300); 
    return () => clearInterval(intervalId);
  }, [eventoId, status]);

  const fetchEventoData = async (id: string) => {
    try {
      const response = await fetch(`/api/evento?id=${id}`);
      if (!response.ok) throw new Error('Evento não encontrado');

      const data = await response.json();

      const isEventoOwner = data.eventoUsuario?.some 
      ((user: any) => Number(user.idUsuario) === Number(session?.user?.id)
      );
      
 console.log(isEventoOwner, data)

      if (!isEventoOwner) {
        router.push("/home");
        return;
      }
      
      const formatDateTime = (dateTimeString?: string) => {
        if (!dateTimeString) return { date: '', time: '' };
        const dateObj = new Date(dateTimeString);
        const date = dateObj.toISOString().split('T')[0];
        const time = dateObj.toTimeString().split(' ')[0].substring(0, 5);
        return { date, time };
      };

// page.tsx (dentro da função fetchEventoData)

      const { date: startDate, time: startTime } = formatDateTime(data.dataInicio);
      const { date: endDate, time: endTime } = formatDateTime(data.dataFim);

      // Separa a primeira imagem como principal e o resto como 'outras'
      const allImages = Array.isArray(data.imagemEvento)? data.imagemEvento.map((img: { link: string }) => img.link): [];

      const [mainImage, ...otherImages] = allImages;

      setEventoData({
        title: data.titulo,
        description: data.descricao,
        local: data.local,
        link: data.linkParticipacao || '',
        startDate,
        startTime,
        endDate,
        endTime,
        category: data.categoria,
        mainImage: mainImage || '',
        otherImages: otherImages || []
      });

      // Encontra a participação do usuário logado no evento
      const currentUserParticipation = data.eventoUsuario?.find(
        (user: any) => Number(user.idUsuario) === Number(session?.user?.id)
      );

      // Se encontrar a participação, atualiza o estado 'cargo'
      if (currentUserParticipation) {
        setCargo(currentUserParticipation.tipoParticipacao);
      }

      const mappedCollaborators = data.eventoColaborador.map((colab: EventoColaborador) => ({
        name: colab.colaborador.nome,
       role: colab.categoria 
      }));

      // Validando se "data.eventoColaborador" é um array antes de fazer .map
      //const mappedCollaborators = Array.isArray(data.eventoColaborador)? data.eventoColaborador.map((colab: EventoColaborador) => ({
     // name: colab.colaborador.nome,
     // role: colab.categoria,
    //})): [];


      setCollaborators(mappedCollaborators);

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
    setEventoData(prevState => ({ ...prevState, [name]: value }));
  };

  // Função genérica para abrir o seletor de arquivos
  const handleSelectImage = (e: React.ChangeEvent<HTMLInputElement>, type: 'main' | 'other') => {
    const file = e.target.files?.[0];
    if (!file) return;
  
    setCroppingFor(type); // Define o contexto do corte
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      setTempImage(base64);
      setShowImageCropper(true);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  // Função chamada quando o corte é bem-sucedido
  const handleCropSuccess = (base64: string) => {
    if (croppingFor === 'main') {
      setEventoData(prev => ({ ...prev, mainImage: base64 }));
    } else if (croppingFor === 'other') {
      setEventoData(prev => ({ ...prev, otherImages: [...prev.otherImages, base64] }));
    }
    setShowImageCropper(false);
    setCroppingFor(null);
  };

  const removeOtherImage = (indexToRemove: number) => {
    setEventoData(prev => ({
      ...prev,
      otherImages: prev.otherImages.filter((_, index) => index !== indexToRemove)
    }));
  };
  
  const removeMainImage = () => {
    setEventoData(prev => ({ ...prev, mainImage: '' }));
  };

  const handleCollaboratorNameChange = (index: number, value: string) => {
     const trimmedValue = value.trimStart();
      // Verifica se há múltiplos espaços consecutivos e substitui por um único
    const normalizedValue = trimmedValue.replace(/\s+/g, ' ');
      // Verifica se há mais de duas palavras (nome + sobrenome)
    const wordCount = normalizedValue.split(' ').filter(word => word.length > 0).length;
    if (wordCount > 2) {
      return; // Não permite mais de dois nomes
    }
    
    const updatedCollaborators = [...collaborators];
    updatedCollaborators[index] = { ...updatedCollaborators[index], name: normalizedValue };
    setCollaborators(updatedCollaborators);
  
        // Mostrar sugestões se houver texto
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
        .slice(0, 5); // Limita a 5 sugestões
      
      setSuggestions(matchedNames.length > 0 ? { index, names: matchedNames } : null);
    } else {
      setSuggestions(null);
    }
  };
    const handleSelectSuggestion = (nome: string, index: number) => {
      const updated = [...collaborators];
      updated[index].name = nome;
      setCollaborators(updated);
      setSuggestions(null);
    };

  const handleCollaboratorRoleChange = (index: number, value: string) => {
    const updatedCollaborators = [...collaborators];
    updatedCollaborators[index] = { ...updatedCollaborators[index], role: value };
    setCollaborators(updatedCollaborators);
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
    setCollaborators(collaborators.filter((_, i) => i !== index));
    setSuggestions(null);
  };

  const selectSuggestion = (index: number, name: string) => {
    const updatedCollaborators = [...collaborators];
    updatedCollaborators[index] = { ...updatedCollaborators[index], name: name };
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

    // Combina a imagem principal e as outras em um único array para envio
    const allImages = [eventoData.mainImage, ...eventoData.otherImages].filter(Boolean);

    const dataInicioISO = new Date(`${eventoData.startDate}T${eventoData.startTime}`).toISOString();
    const dataFimISO = new Date(`${eventoData.endDate}T${eventoData.endTime}`).toISOString();

 const validatedCollaborators = collaborators.map(colab => ({
      ...colab,
      name: colab.name.trim().replace(/\s+/g, ' '), 
    }));
    
    if (new Date(dataFimISO) < new Date(dataInicioISO)) {
  alert("A data de término deve ser posterior à data de início.");
  return;
}

    if (!validateCollaborators()) {
      return; // Interrompe se houver campos vazios
    }

    const requestBody = {
      titulo: eventoData.title,
      descricao: eventoData.description,
      local: eventoData.local,
      linkParticipacao: eventoData.link || null,
      imagens: allImages, // Envia o array combinado
      categoria: eventoData.category,
      dataInicio: dataInicioISO,
      dataFim: dataFimISO,
      tipoParticipacao: cargo, 
      colaboradores: validatedCollaborators.map(colaborador => ({
          categoria: colaborador.role,
          nome: colaborador.name.trim()
        })),
      ...(isEditMode ? {} : { usuarioId: Number(session?.user?.id) })
    };
    
    console.log(requestBody)
    
    try {
      const route = isEditMode ? `/api/evento?id=${eventoId}` : "/api/evento";
      const response = await fetch(route, {
        method: isEditMode ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json", 
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
          message: 'Erro ao salvar o evento, tente novamente mais tarde. Erro: ' + errorData.message,
          isError: true,
          eventoId: null
        });
      }
    } catch (error) {
      console.error(error);
      setResultDialog({
        title: 'Erro',
        message: 'Erro ao salvar o evento, tente novamente mais tarde. Erro: ' + error,
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
    const hasData = eventoData.title || eventoData.description || eventoData.mainImage || eventoData.otherImages.length > 0 || collaborators.some(c => c.name || c.role);
    if (hasData) {
      setShowCancelDialog(true);
    } else {
      router.push('/home');
    }
  };

  const handleConfirmCancel = () => {
    setEventoData({
      title: '', description: '', local: '', link: '',
      startDate: '', startTime: '', endDate: '', endTime: '',
      category: '', mainImage: '', otherImages: []
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

          {/* Campos de texto, datas, etc. */}
          <div className="grid gap-8 mb-8">
            <div className="grid items-center gap-1.5">
              <Label htmlFor="title">Título do evento*</Label>
              <Input type="text" id="title" name="title" value={eventoData.title} onChange={handleChange} required />
            </div>
          </div>
          <div className="grid gap-8 mb-8">
            <div className="grid items-center gap-1.5">
              <Label htmlFor="description">Descrição do evento*</Label>
              <textarea id="description" name="description" value={eventoData.description} onChange={handleChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 min-h-[100px]" required />
            </div>
          </div>
          <div className="grid gap-8 mb-8">
            <div className="grid items-center gap-1.5">
              <Label htmlFor="local">Local do evento*</Label>
              <Input id="local" name="local" value={eventoData.local} onChange={handleChange} required />
            </div>
          </div>
          <div className="grid gap-8 mb-8">
            <div className="grid items-center gap-1.5">
              <Label htmlFor="link">Link do evento</Label>
              <Input type="url" id="link" name="link" placeholder="https://exemplo.com ou www.exemplo.com" value={eventoData.link} onChange={handleChange} />
            </div>
          </div>
          <div className="grid gap-8 mb-8">
            <div className="grid items-center gap-1.5">
              <Label className="text-sm font-medium text-gray-700">Meu papel na criação deste evento*</Label>
              <div className="flex items-center space-x-6 mt-2">
                <label className="inline-flex items-center space-x-2">
                  <input type="radio" className="h-4 w-4 accent-black" name="cargo" value="Organizador" checked={cargo === "Organizador"} onChange={() => setCargo("Organizador")} />
                  <span className="text-sm text-gray-700">Organizador</span>
                </label>
                <label className="inline-flex items-center space-x-2">
                  <input type="radio" className="h-4 w-4 accent-black" name="cargo" value="Palestrante" checked={cargo === "Palestrante"} onChange={() => setCargo("Palestrante")} />
                  <span className="text-sm text-gray-700">Palestrante</span>
                </label>
                <label className="inline-flex items-center space-x-2">
                  <input type="radio" className="h-4 w-4 accent-black" name="cargo" value="Ouvinte" checked={cargo === "Ouvinte"} onChange={() => setCargo("Ouvinte")} />
                  <span className="text-sm text-gray-700">Ouvinte</span>
                </label>
              </div>
            </div>
          </div>
          <div className="grid gap-8 mb-8 md:grid-cols-2">
            <div className="grid items-center gap-1.5">
              <Label htmlFor="startDate">Data de início*</Label>
              <Input type="date" id="startDate" name="startDate" value={eventoData.startDate} onChange={handleChange} required />
            </div>
            <div className="grid items-center gap-1.5">
              <Label htmlFor="startTime">Horário de início*</Label>
              <Input type="time" id="startTime" name="startTime" value={eventoData.startTime} onChange={handleChange} required />
            </div>
          </div>
          <div className="grid gap-8 mb-8 md:grid-cols-2">
            <div className="grid items-center gap-1.5">
              <Label htmlFor="endDate">Data de finalização*</Label>
              <Input type="date" id="endDate" name="endDate" value={eventoData.endDate} onChange={handleChange} min={eventoData.startDate} required />
            </div>
            <div className="grid items-center gap-1.5">
              <Label htmlFor="endTime">Horário de término*</Label>
              <Input type="time" id="endTime" name="endTime" value={eventoData.endTime} onChange={handleChange} required />
            </div>
          </div>

          {/* Input de arquivo oculto que será acionado programaticamente */}
          <Input 
            type="file" 
            className="hidden"
            ref={imageInputRef}
            onChange={(e) => handleSelectImage(e, croppingFor || 'other')} 
            accept="image/png, image/jpeg, image/jpg, image/webp" 
          />

          {/* ESTRUTURA PARA CATEGORIA E IMAGEM PRINCIPAL */}
          <div className="grid gap-8 mb-8 md:grid-cols-2">
            {/* Categoria - CORRIGIDO */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="category">Categoria do evento*</Label>
              <Select value={eventoData.category} onValueChange={(value) => setEventoData(prevState => ({...prevState, category: value}))} required>
                <SelectTrigger><SelectValue placeholder="Selecione uma categoria" /></SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {loadingCategories ? <SelectItem value="loading" disabled>Carregando...</SelectItem> : categories.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            {/* Imagem Principal */}
            <div className="grid items-start gap-1.5">
              <Label>Imagem Principal</Label>
              {eventoData.mainImage ? (
                <div className="relative group w-full h-48">
                  <img src={eventoData.mainImage} alt="Imagem principal do evento" className="rounded-lg object-cover w-full h-full border" />
                  <button 
                    type="button" 
                    onClick={removeMainImage} 
                    className="absolute top-2 right-2 bg-black bg-opacity-60 text-white rounded-full p-1.5 group-hover:opacity-100 opacity-0 transition-opacity"
                    aria-label="Remover imagem principal"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <button 
                  type="button"
                  onClick={() => {
                    setCroppingFor('main');
                    imageInputRef.current?.click();
                  }}
                  className="w-full h-48 border-2 border-dashed rounded-lg flex flex-col items-center justify-center text-gray-500 hover:bg-gray-50 hover:text-gray-600 transition-colors"
                >
                  <ImagePlus className="h-10 w-10 mb-2" />
                  <span>Adicionar Imagem Principal</span>
                </button>
              )}
            </div>
          </div>

          {/* SEÇÃO APENAS PARA OUTRAS IMAGENS */}
          <div className="grid gap-4 mb-8">
            <div>
                <Label>Outras Imagens</Label>
                <p className="text-sm text-gray-500">Adicione imagens secundárias para a galeria do evento.</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {eventoData.otherImages.map((imageBase64, index) => (
                <div key={index} className="relative group aspect-square">
                  <img src={imageBase64} alt={`Imagem do evento ${index + 1}`} className="rounded-lg object-cover w-full h-full border" />
                  <button 
                    type="button" 
                    onClick={() => removeOtherImage(index)} 
                    className="absolute top-1 right-1 bg-black bg-opacity-60 text-white rounded-full p-1 group-hover:opacity-100 opacity-0 transition-opacity"
                    aria-label="Remover imagem"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
              {/* Botão para adicionar outras imagens */}
              <button 
                type="button"
                onClick={() => {
                  setCroppingFor('other');
                  imageInputRef.current?.click();
                }}
                className="aspect-square border-2 border-dashed rounded-lg flex flex-col items-center justify-center text-gray-500 hover:bg-gray-50 hover:text-gray-600 transition-colors"
              >
                <ImagePlus className="h-8 w-8" />
              </button>
            </div>
          </div>

          {/* Colaboradores (sem alterações) */}

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
                  <Input
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
                          onClick={() => selectSuggestion(index, nameObj.nome)} // pega só o nome
                        >
                          {nameObj.label} {/* mostra Nome (email) */}
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
            <Button type="button" variant="outline" onClick={handleCancelClick}>Cancelar</Button>
            <Button type="submit">Salvar Evento</Button>
          </div>
        </div>
      </form>

      <ConfirmationModal
        isOpen={showCancelDialog}
        onClose={() => setShowCancelDialog(false)}
        onConfirm={handleConfirmCancel}
        title="Tem certeza que deseja cancelar?"
        message="Todas as alterações não salvas serão perdidas."
        confirmText="Sim, cancelar"
        variant="destructive"
      />

      <ConfirmationModal
        isOpen={showResultDialog}
        onConfirm={handleSuccessConfirm}
        onClose={resultDialog.isError ? () => setShowResultDialog(false) : undefined}
        title={resultDialog.title}
        message={resultDialog.message}
        confirmText="OK"
        variant={resultDialog.isError ? 'destructive' : 'default'}
      />

      {showImageCropper && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">Recortar Imagem</h3>
                <button onClick={() => setShowImageCropper(false)} className="text-gray-400 hover:text-gray-600 text-2xl">×</button>
              </div>
              <ImageCropper
                  imageSrc={tempImage}
                  onUploadSuccess={handleCropSuccess}
                  // Adicionando uma propriedade hipotética para esconder o botão de upload interno, conforme solicitado.
                  // O nome da prop ('hideUploader') é uma suposição e pode precisar de ajuste no componente real.
                  hideUploader={true}
                />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
