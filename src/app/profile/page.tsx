"use client"

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import Carrossel from "@/components/Carrossel";
import CardProjeto from "@/components/CardProjeto";
import CardEvento from "@/components/CardEvento";
import Navbar from "@/components/Navbar";
import { useRouter } from "next/navigation";

interface Profile {
  id: string;
  nome: string;
  descricao: string;
  instituicao: string;
  foto: string;
  email: string;
}

interface Evento {
  id: string;
  nome: string;
  descricao: string;
  data: string;
  userId: string;
}

interface Projeto {
  id: string;
  nome: string;
  descricao: string;
  imagem: string;
  userId: string;
}

interface Experiencia {
  id: string;
  cargo: string;
  instituicao: string;
  periodo: string;
  local: string;
  userId: string;
}

interface Formacao {
  id: string;
  nivel: string;
  instituicao: string;
  periodo: string;
  local: string;
  userId: string;
}

interface Post {
  id: string;
  citacao: string;
  referencia: string;
  userId: string;
}

interface ProjetoColaborador {
  id: number;
  categoria: string;
  idProjeto: number;
  idColaborador: number;
  projeto: {
    id: number;
    titulo: string;
    imagem: string;
    descricao: string;
    categoria: string;
    dataInicio: string;
    dataFim: string;
  };
}

export default function ProfessorPortfolio() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);
  
  const [profile, setProfile] = useState<Profile>({
    id: '',
    nome: "",
    descricao: "",
    instituicao: "",
    foto: "/default-profile.png",
    email: ""
  });

  const [eventos, setEventos] = useState<Evento[]>([]);
  const [projetos, setProjetos] = useState<Projeto[]>([]);
  const [experiencias, setExperiencias] = useState<Experiencia[]>([]);
  const [formacoes, setFormacoes] = useState<Formacao[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [visiblePosts, setVisiblePosts] = useState(3);
  
  const [editProfile, setEditProfile] = useState(false);
  const [editMode, setEditMode] = useState<{section: string, id: string | null, editing: boolean}>({section: '', id: null, editing: false});
  const [formData, setFormData] = useState<any>({});

  const [projetosColaborados, setProjetosColaborados] = useState<ProjetoColaborador[]>([]);
  const [projetoSelecionado, setProjetoSelecionado] = useState<number | null>(null);

  const router = useRouter();

  const handleProjetoClick = (projetoId: string) => {
    router.push(`/projeto/${projetoId}`);
  };
  
  const handleEventoClick = (eventoId: string) => {
    router.push(`/evento/${eventoId}`);
  };

  const fetchProjetosColaborados = async (userId: string) => {
    try {
      const response = await fetch(`/api/colaborador/semProjetoUsuario?id=${userId}`);
      const data = await response.json();
      setProjetosColaborados(data.projetoColaborador || []);
    } catch (error) {
      console.error("Erro ao buscar projetos colaborados:", error);
    }
  };

  // Buscar dados do usuário
  const fetchUserData = async (userId: string) => {
    try {
      setLoading(true);
      
      const [profileRes, eventosRes, projetosRes, experienciasRes, formacoesRes, postsRes] = await Promise.all([
        fetch(`/api/professor/${userId}`),
        fetch(`/api/eventos?userId=${userId}`),
        fetch(`/api/projetos?userId=${userId}`),
        fetch(`/api/experiencias?userId=${userId}`),
        fetch(`/api/formacoes?userId=${userId}`),
        fetch(`/api/posts?userId=${userId}`)
      ]);

      const profileData = await profileRes.json();
      const eventosData = await eventosRes.json();
      const projetosData = await projetosRes.json();
      const experienciasData = await experienciasRes.json();
      const formacoesData = await formacoesRes.json();
      const postsData = await postsRes.json();
      
      setProfile(profileData);
      setEventos(eventosData);
      setProjetos(projetosData);
      setExperiencias(experienciasData);
      setFormacoes(formacoesData);
      setPosts(postsData);
      
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
    } finally {
      setLoading(false);
    }
  };

  // Atualizar perfil
  const updateProfile = async (updatedProfile: Profile) => {
    try {
      const response = await fetch(`/api/professor/${updatedProfile.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedProfile),
      });
      
      if (!response.ok) throw new Error('Erro ao atualizar perfil');
      return await response.json();
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error);
      throw error;
    }
  };

  // Upload de foto
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const formData = new FormData();
      formData.append('file', e.target.files[0]);
      formData.append('userId', profile.id);
      
      try {
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });
        
        const data = await response.json();
        
        if (response.ok) {
          const updatedProfile = {
            ...profile,
            foto: data.fileUrl
          };
          setProfile(updatedProfile);
          await updateProfile(updatedProfile);
        }
      } catch (error) {
        console.error("Erro ao fazer upload da imagem:", error);
      }
    }
  };

  // Salvar perfil
  const handleSaveProfile = async () => {
    try {
      const updatedProfile = await updateProfile(profile);
      setProfile(updatedProfile);
      setEditProfile(false);
    } catch (error) {
      console.error("Erro ao salvar perfil:", error);
    }
  };

  // Operações CRUD para experiências
  const handleSaveExperiencia = async () => {
    try {
      const url = editMode.id 
        ? `/api/experiencias/${editMode.id}`
        : '/api/experiencias';
      
      const method = editMode.id ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          userId: profile.id
        }),
      });
      
      if (!response.ok) throw new Error('Erro ao salvar experiência');
      
      const savedData = await response.json();
      
      if (editMode.id) {
        setExperiencias(experiencias.map(exp => 
          exp.id === editMode.id ? savedData : exp
        ));
      } else {
        setExperiencias([...experiencias, savedData]);
      }
      
      setEditMode({section: '', id: null, editing: false});
      setFormData({});
    } catch (error) {
      console.error("Erro ao salvar experiência:", error);
    }
  };

  const handleDeleteExperiencia = async (id: string) => {
    try {
      const response = await fetch(`/api/experiencias/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) throw new Error('Erro ao deletar experiência');
      
      setExperiencias(experiencias.filter(exp => exp.id !== id));
    } catch (error) {
      console.error("Erro ao deletar experiência:", error);
    }
  };

  // Operações CRUD para formações
  const handleSaveFormacao = async () => {
    try {
      const url = editMode.id 
        ? `/api/formacoes/${editMode.id}`
        : '/api/formacoes';
      
      const method = editMode.id ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          userId: profile.id
        }),
      });
      
      if (!response.ok) throw new Error('Erro ao salvar formação');
      
      const savedData = await response.json();
      
      if (editMode.id) {
        setFormacoes(formacoes.map(form => 
          form.id === editMode.id ? savedData : form
        ));
      } else {
        setFormacoes([...formacoes, savedData]);
      }
      
      setEditMode({section: '', id: null, editing: false});
      setFormData({});
    } catch (error) {
      console.error("Erro ao salvar formação:", error);
    }
  };

  const handleDeleteFormacao = async (id: string) => {
    try {
      const response = await fetch(`/api/formacoes/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) throw new Error('Erro ao deletar formação');
      
      setFormacoes(formacoes.filter(form => form.id !== id));
    } catch (error) {
      console.error("Erro ao deletar formação:", error);
    }
  };

  // Operações CRUD para posts
  const handleSavePost = async () => {
    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          userId: profile.id
        }),
      });
      
      if (!response.ok) throw new Error('Erro ao salvar post');
      
      const savedData = await response.json();
      setPosts([...posts, savedData]);
      setEditMode({section: '', id: null, editing: false});
      setFormData({});
    } catch (error) {
      console.error("Erro ao salvar post:", error);
    }
  };

  const handleDeletePost = async (id: string) => {
    try {
      const response = await fetch(`/api/posts/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) throw new Error('Erro ao deletar post');
      
      setPosts(posts.filter(post => post.id !== id));
    } catch (error) {
      console.error("Erro ao deletar post:", error);
    }
  };

  // Carregar mais/menos posts
  const loadMorePosts = () => {
    setVisiblePosts(prev => prev + 3);
  };

  const showLessPosts = () => {
    setVisiblePosts(3);
  };

  useEffect(() => {
    if (session?.user?.email) {
      fetch(`/api/usuario?email=${session.user.email}`)
        .then(res => res.json())
        .then(data => {
          if (data.id) {
            fetchUserData(data.id);
            fetchProjetosColaborados(data.id);
          }
        })
        .catch(err => console.error("Erro ao buscar ID do usuário:", err));
    }
  }, [session]);

  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <Navbar />
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="container mx-auto p-4">
        <Navbar />
        <div className="flex justify-center items-center h-screen">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Acesso não autorizado</h1>
            <p className="mb-4">Você precisa estar logado para acessar esta página</p>
            <Button onClick={() => window.location.href = '/login'}>Ir para página de login</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 space-y-12">
      <Navbar />
      
      {/* Seção Perfil */}
      <div className="bg-white p-8 rounded-lg shadow-md relative">
        <div className="flex items-start gap-8">
          <div className="relative group">
            <img
              src={profile.foto || "/default-profile.png"}
              alt="Foto do professor"
              className="w-48 h-48 rounded-full cursor-pointer object-cover border-4 border-gray-100"
            />
            {editProfile && (
              <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-white text-sm font-medium">Alterar Foto</span>
                <input
                  type="file"
                  accept="image/*"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  onChange={handleFileChange}
                />
              </div>
            )}
          </div>
          
          {editProfile ? (
            <div className="flex-1 space-y-4">
              <Input
                placeholder="Nome"
                value={profile.nome}
                onChange={(e) => setProfile({ ...profile, nome: e.target.value })}
                className="text-2xl font-bold"
              />
              <Input
                placeholder="Instituição"
                value={profile.instituicao}
                onChange={(e) => setProfile({ ...profile, instituicao: e.target.value })}
                className="text-xl"
              />
              <Textarea
                placeholder="Descrição"
                value={profile.descricao}
                onChange={(e) => setProfile({ ...profile, descricao: e.target.value })}
                className="text-gray-700 min-h-[100px]"
              />
            </div>
          ) : (
            <div className="flex-1 space-y-3">
              <h1 className="text-3xl font-bold text-gray-900">{profile.nome}</h1>
              <p className="text-xl text-blue-600 font-medium">{profile.instituicao}</p>
              <p className="text-gray-700 text-lg">{profile.descricao}</p>
              <p className="text-gray-500 text-sm">Email: {profile.email || session.user?.email}</p>
            </div>
          )}
        </div>
        <Button 
          onClick={editProfile ? handleSaveProfile : () => setEditProfile(true)}
          className="absolute top-6 right-6"
          variant="outline"
          size="sm"
        >
          {editProfile ? "Salvar Perfil" : "Editar Perfil"}
        </Button>
      </div>

      {/* Seção Projetos */}
      <div className="container space-y-4">
        <div className="mt-20">
          <h1 className="px-8 text-left text-3xl font-bold">Projetos</h1>
          <Carrossel linhas={1}>
            {projetos.map((projeto) => (
              <div 
                key={projeto.id} 
                onClick={() => handleProjetoClick(projeto.id)}
                className="cursor-pointer"
              >
                <CardProjeto 
                  nome={projeto.nome}
                  descricao={projeto.descricao}
                  imagem={projeto.imagem}
                />
              </div>
            ))}
          </Carrossel>
        </div>
      </div>

      {/* Seção Projetos Colaborados*/}
      <div className="container space-y-4 mt-12">
        <div className="mt-8">
          <h1 className="px-8 text-left text-3xl font-bold">Projetos Colaborados</h1>
          {projetosColaborados.length > 0 ? (
            <>
              <Carrossel linhas={1}>
                {projetosColaborados.map((colaboracao) => (
                  <div 
                    key={colaboracao.id} 
                    className={`relative ${projetoSelecionado === colaboracao.id ? 'ring-2 ring-blue-500' : ''}`}
                    onClick={() => handleProjetoClick(colaboracao.projeto.id.toString())}
                  >
                    <CardProjeto 
                      nome={colaboracao.projeto.titulo}
                      descricao={colaboracao.projeto.descricao}
                      imagem={colaboracao.projeto.imagem}
                    />
                    <div className="absolute bottom-2 right-2 bg-white px-2 py-1 rounded text-sm">
                      {colaboracao.categoria}
                    </div>
                  </div>
                ))}
              </Carrossel>
              
              {projetoSelecionado && (
                <div className="flex justify-center gap-4 mt-6">
                  <Button 
                    variant="outline" 
                    onClick={() => console.log('Sim selecionado para projeto', projetoSelecionado)}
                  >
                    Sim
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => console.log('Não selecionado para projeto', projetoSelecionado)}
                  >
                    Não
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-8 text-gray-500">
              Nenhum projeto colaborado encontrado
            </div>
          )}
        </div>
      </div>

      {/* Seção Eventos */}
      <div className="mt-20">
        <h1 className="px-8 text-left text-3xl font-bold">Eventos</h1>
        <Carrossel linhas={1}>
          {eventos.map((evento) => (
            <div 
              key={evento.id}
              onClick={() => handleEventoClick(evento.id)}
              className="cursor-pointer"
            >
              <CardEvento 
                nome={evento.nome}
                descricao={evento.descricao}
                data={evento.data}
              />
            </div>
          ))}
        </Carrossel>
      </div>

      {/* Seção Posts */}
      <div className="mt-8">
        <div className="flex justify-between items-center mb-6 px-4">
          <h1 className="text-3xl font-bold">Publicações</h1>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                Adicionar Publicação
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Adicionar Nova Publicação</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Textarea
                  placeholder="Digite a citação no formato ABNT"
                  value={formData.citacao || ''}
                  onChange={(e) => setFormData({...formData, citacao: e.target.value})}
                  className="min-h-[150px]"
                />
                <Input
                  placeholder="Referência (link)"
                  value={formData.referencia || ''}
                  onChange={(e) => setFormData({...formData, referencia: e.target.value})}
                />
                <Button
                  onClick={handleSavePost}
                  className="w-full"
                  disabled={!formData.citacao}
                >
                  Adicionar Publicação
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        
        {posts.length > 0 ? (
          <div className="space-y-6">
            {posts.slice(0, visiblePosts).map(post => (
              <div key={post.id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 group relative">
                <blockquote className="italic text-gray-800 text-lg">"{post.citacao}"</blockquote>
                <p className="mt-4 text-sm text-gray-600 font-medium">{post.referencia}</p>
                <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleDeletePost(post.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Remover
                  </Button>
                </div>
              </div>
            ))}
            
            <div className="flex justify-center gap-4">
              {visiblePosts < posts.length && (
                <Button 
                  variant="outline" 
                  onClick={loadMorePosts}
                >
                  Ver mais ({Math.min(3, posts.length - visiblePosts)})
                </Button>
              )}
              
              {visiblePosts > 3 && (
                <Button 
                  variant="ghost" 
                  onClick={showLessPosts}
                >
                  Ver menos
                </Button>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            Nenhuma publicação adicionada ainda
          </div>
        )}
      </div>

      {/* Seção Experiências */}
      <div className="bg-white p-6 rounded-lg shadow-md relative mt-12">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Experiência Profissional</h1>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                Adicionar Experiência
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editMode.editing ? "Editar Experiência" : "Adicionar Experiência"}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Input
                  placeholder="Cargo/Posição"
                  value={formData.cargo || ''}
                  onChange={(e) => setFormData({...formData, cargo: e.target.value})}
                />
                <Input
                  placeholder="Instituição/Empresa"
                  value={formData.instituicao || ''}
                  onChange={(e) => setFormData({...formData, instituicao: e.target.value})}
                />
                <Input
                  placeholder="Período (ex: 2020 - 2023)"
                  value={formData.periodo || ''}
                  onChange={(e) => setFormData({...formData, periodo: e.target.value})}
                />
                <Input
                  placeholder="Local/Cidade"
                  value={formData.local || ''}
                  onChange={(e) => setFormData({...formData, local: e.target.value})}
                />
                <Button
                  onClick={handleSaveExperiencia}
                  className="w-full"
                  disabled={!formData.cargo || !formData.instituicao}
                >
                  {editMode.editing ? "Atualizar Experiência" : "Adicionar Experiência"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        
        <div className="space-y-6">
          {experiencias.map(exp => (
            <div key={exp.id} className="border-b pb-6 group relative last:border-b-0">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <h3 className="font-bold text-lg">{exp.cargo}</h3>
                  <p className="text-gray-800">{exp.instituicao}</p>
                  <p className="text-gray-600 text-sm">{exp.periodo}</p>
                  <p className="text-gray-500 text-sm">{exp.local}</p>
                </div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => {
                      setEditMode({section: 'experiencia', id: exp.id, editing: true});
                      setFormData(exp);
                    }}
                  >
                    Editar
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="text-red-500 hover:text-red-700"
                    onClick={() => handleDeleteExperiencia(exp.id)}
                  >
                    Remover
                  </Button>
                </div>
              </div>
            </div>
          ))}
          
          {experiencias.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              Nenhuma experiência adicionada
            </div>
          )}
        </div>
      </div>

      {/* Seção Formação */}
      <div className="bg-white p-6 rounded-lg shadow-md relative mt-12">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Formação Acadêmica</h1>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                Adicionar Formação
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editMode.editing ? "Editar Formação" : "Adicionar Formação"}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Input
                  placeholder="Nível de formação (ex: Graduação, Mestrado)"
                  value={formData.nivel || ''}
                  onChange={(e) => setFormData({...formData, nivel: e.target.value})}
                />
                <Input
                  placeholder="Instituição de Ensino"
                  value={formData.instituicao || ''}
                  onChange={(e) => setFormData({...formData, instituicao: e.target.value})}
                />
                <Input
                  placeholder="Período (ex: 2016 - 2020)"
                  value={formData.periodo || ''}
                  onChange={(e) => setFormData({...formData, periodo: e.target.value})}
                />
                <Input
                  placeholder="Local/Cidade"
                  value={formData.local || ''}
                  onChange={(e) => setFormData({...formData, local: e.target.value})}
                />
                <Button
                  onClick={handleSaveFormacao}
                  className="w-full"
                  disabled={!formData.nivel || !formData.instituicao}
                >
                  {editMode.editing ? "Atualizar Formação" : "Adicionar Formação"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        
        <div className="space-y-6">
          {formacoes.map(form => (
            <div key={form.id} className="border-b pb-6 group relative last:border-b-0">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <h3 className="font-bold text-lg">{form.nivel}</h3>
                  <p className="text-gray-800">{form.instituicao}</p>
                  <p className="text-gray-600 text-sm">{form.periodo}</p>
                  <p className="text-gray-500 text-sm">{form.local}</p>
                </div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => {
                      setEditMode({section: 'formacao', id: form.id, editing: true});
                      setFormData(form);
                    }}
                  >
                    Editar
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="text-red-500 hover:text-red-700"
                    onClick={() => handleDeleteFormacao(form.id)}
                  >
                    Remover
                  </Button>
                </div>
              </div>
            </div>
          ))}
          
          {formacoes.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              Nenhuma formação adicionada
            </div>
          )}
        </div>
      </div>
    </div>
  );
}