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
import { useSession } from "next-auth/react";
import ImageCropper from "@/components/ui/ImageCropperBase64";

type ColaboradorFromAPI = {
  id: number;
  nome: string;
};


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

export default function Evento() {
  const router = useRouter();
  const params = useParams();
  const eventoId = params?.id as string | undefined;

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
    image: ''
  });

  const [collaborators, setCollaborators] = useState<Array<{ name: string; role: string }>>([]);
  const [cargosColaborador, setCargosColaborador] = useState<string[]>([]);
  // Este estado não é mais enviado diretamente, mas pode ser mantido para lógica de UI se necessário.
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
  const [colaboradoresDisponiveis, setColaboradoresDisponiveis] = useState<ColaboradorFromAPI[]>([]);
  const [suggestions, setSuggestions] = useState<{index: number, names: string[]} | null>(null);
  const { data: session, status } = useSession();
  const [showImageCropper, setShowImageCropper] = useState(false);
  const [tempImage, setTempImage] = useState<string | null>(null);
  
  
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
        const response = await fetch("/api/colaborador");
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
    if (status === "loading") return;

    if (status !== "authenticated") {
      router.push("/404");
      return;
    }

    if (eventoId) {
      setIsEditMode(true);
      fetchEventoData(eventoId);
    }
  }, [eventoId, status]);

  const fetchEventoData = async (id: string) => {
    try {
      const response = await fetch(`/api/evento?id=${id}`);
      if (!response.ok) throw new Error('Evento não encontrado');

      const data = await response.json();

      const isEventoOwner = data.eventoUsuario?.some(
        (user: any) => Number(user.idUsuario) === Number(session?.user?.id)
      );
      
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

      const { date: startDate, time: startTime } = formatDateTime(data.dataInicio);
      const { date: endDate, time: endTime } = formatDateTime(data.dataFim);

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
        image: data.imagem || ''    
      });

      const mappedCollaborators = data.eventoColaborador.map((colab: EventoColaborador) => ({
        name: colab.colaborador.nome,
        role: colab.categoria 
      }));

      setCollaborators(mappedCollaborators);

    } catch (error) {
      console.error("Erro ao carregar evento:", error);
    }
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/enums/categoriaCurso");
        if (!response.ok) throw new Error("Erro ao buscar categorias de evento");
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
    const updatedCollaborators = [...collaborators];
    updatedCollaborators[index] = { ...updatedCollaborators[index], name: value };
    setCollaborators(updatedCollaborators);
  
    if (value.length > 0) {
      const matchedNames = colaboradoresDisponiveis
        .filter(colab => colab.nome.toLowerCase().includes(value.toLowerCase()))
        .map(colab => colab.nome)
        .slice(0, 5);
      
      setSuggestions(matchedNames.length > 0 ? {index, names: matchedNames} : null);
    } else {
      setSuggestions(null);
    }
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const dataInicioISO = new Date(`${eventoData.startDate}T${eventoData.startTime}`).toISOString();
    const dataFimISO = new Date(`${eventoData.endDate}T${eventoData.endTime}`).toISOString();

    const validatedCollaborators = collaborators
      .filter(c => c.name.trim() && c.role)
      .map(colab => ({
        ...colab,
        name: colab.name.trim().replace(/\s+/g, ' '), 
      }));

    const requestBody = {
      titulo: eventoData.title,
      descricao: eventoData.description,
      local: eventoData.local,
      linkParticipacao: eventoData.link || null,
      imagem: eventoData.image || null,
      categoria: eventoData.category,
      dataInicio: dataInicioISO,
      dataFim: dataFimISO,
      // ===== CORREÇÃO PRINCIPAL =====
      // Enviando um valor VÁLIDO para o enum `tipoParticipacao` do schema.
      tipoParticipacao: 'Organizador', 
      colaboradores: validatedCollaborators.map(colaborador => ({
          categoria: colaborador.role,
          nome: colaborador.name.trim()
        })),
      ...(isEditMode ? {} : { usuarioId: Number(session?.user?.id) })
    };
  
    try {
      const route = isEditMode ? `/api/evento?id=${eventoId}` : "/api/evento";
      const response = await fetch(route, {
        method: isEditMode ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });
  
      const data = await response.json();
      if (response.ok) {
        setResultDialog({
          title: 'Sucesso!',
          message: isEditMode ? 'Evento atualizado com sucesso.' : 'Evento criado com sucesso.',
          isError: false,
          eventoId: data.id 
        });
      } else {
        throw new Error(data.message || 'Erro desconhecido da API');
      }
    } catch (error: any) {
      console.error("Erro ao submeter:", error);
      setResultDialog({
        title: 'Erro',
        message: 'Erro ao salvar o evento. ' + error.message,
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
    const hasData = Object.values(eventoData).some(val => val !== '') || collaborators.some(c => c.name || c.role);
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
      category: '', image: ''
    });
    setCollaborators([]);
    setShowCancelDialog(false);
    router.push('/home');
  };

  return (
    <div className="flex justify-center">
      <form onSubmit={handleSubmit} className="w-full max-w-4xl px-4">
        <div className="py-12">
          <h1 className="text-3xl font-bold mb-12 text-center">{isEditMode ? 'Editar Evento' : 'Criar Evento'}</h1>

          {/* Título */}
          <div className="grid gap-8 mb-8">
            <div className="grid items-center gap-1.5">
              <Label htmlFor="title">Título do evento*</Label>
              <Input type="text" id="title" name="title" value={eventoData.title} onChange={handleChange} required />
            </div>
          </div>

          {/* Descrição */}
          <div className="grid gap-8 mb-8">
            <div className="grid items-center gap-1.5">
              <Label htmlFor="description">Descrição do evento*</Label>
              <textarea id="description" name="description" value={eventoData.description} onChange={handleChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 min-h-[100px]" required />
            </div>
          </div>

          {/* Local */}
          <div className="grid gap-8 mb-8">
            <div className="grid items-center gap-1.5">
              <Label htmlFor="local">Local do evento*</Label>
              <Input id="local" name="local" value={eventoData.local} onChange={handleChange} required />
            </div>
          </div>

          {/* Link do Evento */}
          <div className="grid gap-8 mb-8">
            <div className="grid items-center gap-1.5">
              <Label htmlFor="link">Link do evento</Label>
              <Input type="url" id="link" name="link" placeholder="https://exemplo.com ou www.exemplo.com" value={eventoData.link} onChange={handleChange} />
            </div>
          </div>
          
          {/* Cargo do Usuário (UI Apenas, a lógica foi corrigida no handleSubmit) */}
          <div className="grid gap-8 mb-8">
            <div className="grid items-center gap-1.5">
              <Label className="text-sm font-medium text-gray-700">Meu papel na criação deste evento*</Label>
              <div className="flex items-center space-x-6 mt-2">
                <label className="inline-flex items-center space-x-2">
                  <input type="radio" className="h-4 w-4 accent-black" name="cargo" value="Organizador" checked={cargo === "Organizador"} onChange={() => setCargo("Organizador")} />
                  <span className="text-sm text-gray-700">Organizador</span>
                </label>
              </div>
            </div>
          </div>

          {/* Data e Hora de Início */}
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

          {/* Data e Hora de Término */}
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

          {/* Categoria e Imagem */}
          <div className="grid gap-8 mb-8 md:grid-cols-2">
            <div className="grid items-center gap-1.5">
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
            <div className="grid items-center gap-1.5">
              <Label htmlFor="image">Imagem do evento</Label>
              <Input type="file" id="image" name="image" onChange={handleImageChange} accept="image/png, image/jpeg, image/jpg, image/webp" />
            </div>
          </div>

          {/* Colaboradores */}
          <div className="grid gap-8 mb-8">
            <div className="flex justify-between items-center">
              <Label>Colaboradores</Label>
              <Button type="button" onClick={addCollaborator} className="w-fit">+ Adicionar colaborador</Button>
            </div>
            {collaborators.length === 0 && <p className="text-gray-500">Nenhum colaborador adicionado.</p>}
            {collaborators.map((collaborator, index) => (
              <div key={index} className="grid gap-6 md:grid-cols-2 items-end">
                <div className="grid items-center gap-1.5 relative">
                  <Input type="text" placeholder="Nome do colaborador" value={collaborator.name} onChange={(e) => handleCollaboratorNameChange(index, e.target.value)} />
                  {suggestions?.index === index && (
                    <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-md shadow-lg z-10 mt-1">
                      {suggestions.names.map((name, i) => (
                        <div key={i} className="p-2 hover:bg-gray-100 cursor-pointer" onClick={() => selectSuggestion(index, name)}>{name}</div>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  <Select value={collaborator.role} onValueChange={(value) => handleCollaboratorRoleChange(index, value)}>
                    <SelectTrigger><SelectValue placeholder="Selecione o cargo" /></SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {loadingCargos ? <SelectItem value="loading" disabled>Carregando...</SelectItem> : cargosColaborador.map((cargo) => (
                          <SelectItem key={cargo} value={cargo}>{cargo}</SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <Button type="button" variant="ghost" onClick={() => removeCollaborator(index)} className="text-black hover:text-black hover:bg-gray-100 p-2"><Trash2 className="h-4 w-4" /></Button>
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
                <h3 className="text-xl font-semibold">Alterar Imagem do Evento</h3>
                <button onClick={() => setShowImageCropper(false)} className="text-gray-400 hover:text-gray-600 text-2xl">×</button>
              </div>
              <ImageCropper
                  imageSrc={tempImage}
                  onUploadSuccess={(base64) => {
                    setEventoData(prev => ({ ...prev, image: base64 }));
                    setShowImageCropper(false);
                  }}
                />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}