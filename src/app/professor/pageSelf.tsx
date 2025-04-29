"use client"

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import Carrossel from "@/components/Carrossel";
import CardProjeto from "@/components/CardProjeto";
import Navbar from "@/components/Navbar";

interface Profile {
  nome: string;
  descricao: string;
  instituicao: string;
  foto: string | File;
}

interface Evento {
  id: string;
  nome: string;
  descricao: string;
  data: string;
}

interface Experiencia {
  id: string;
  cargo: string;
  instituicao: string;
  periodo: string;
  local: string;
}

interface Formacao {
  id: string;
  nivel: string;
  instituicao: string;
  periodo: string;
  local: string;
}

interface Post {
  id: string;
  citacao: string;
  referencia: string;
}

const CardEvento = ({ nome, descricao, data }: { nome: string; descricao: string; data: string }) => (
  <div className="bg-white rounded-lg shadow-md overflow-hidden mx-2 p-4" style={{ width: "17rem" }}>
    <div className="flex items-start gap-3">
      <div className="bg-blue-100 text-blue-800 rounded-lg p-2 min-w-[60px] text-center">
        <div className="font-bold">{data.split('/')[0]}</div>
        <div className="text-xs">{data.split('/')[1]}/{data.split('/')[2]}</div>
      </div>
      <div>
        <h5 className="text-lg font-semibold mb-1">{nome}</h5>
        <p className="text-sm text-gray-700">{descricao}</p>
      </div>
    </div>
  </div>
);

export default function ProfessorPortfolio() {
  const [profile, setProfile] = useState<Profile>({
    nome: "Nome do professor",
    descricao: "Descrição breve sobre o professor",
    instituicao: "Instituição de ensino",
    foto: "/default-profile.png"
  });

  const [eventosDisponiveis, setEventosDisponiveis] = useState<Evento[]>([]);
  const [experiencias, setExperiencias] = useState<Experiencia[]>([]);
  const [formacoes, setFormacoes] = useState<Formacao[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [visiblePosts, setVisiblePosts] = useState(3);
  
  const [editProfile, setEditProfile] = useState(false);
  const [editMode, setEditMode] = useState<{section: string, id: string | null, editing: boolean}>({section: '', id: null, editing: false});
  const [formData, setFormData] = useState<any>({});

  const projetos = [
    { imagem: "/proj1.jpg", nome: "Tecnologia da Informação", descricao: "Curso de introdução e especialização em TI.", cargahoraria: "80 horas" },
    { imagem: "/proj2.jpg", nome: "Física", descricao: "Projeto de pesquisa e desenvolvimento em física aplicada.", cargahoraria: "120 horas" },
    { imagem: "/proj3.jpg", nome: "Química", descricao: "Curso focado em experimentos e teoria química avançada.", cargahoraria: "100 horas" },
    { imagem: "/proj4.jpg", nome: "Matemática", descricao: "Projeto de inovação em métodos de ensino matemático.", cargahoraria: "90 horas" },
    { imagem: "/proj5.jpg", nome: "História", descricao: "Curso de história mundial e metodologias de pesquisa histórica.", cargahoraria: "70 horas" },
  ];

  useEffect(() => {
    // Simulação de dados da API
    setEventosDisponiveis([
      { id: '1', nome: 'Conferência Internacional de Tecnologia', descricao: 'Palestra sobre inovações em educação digital', data: '15/05/2024' },
      { id: '2', nome: 'Workshop de Desenvolvimento Web', descricao: 'Oficina prática para estudantes', data: '22/06/2024' },
      { id: '3', nome: 'Simpósio de Pesquisa Científica', descricao: 'Apresentação de trabalhos acadêmicos', data: '10/08/2024' }
    ]);

    setExperiencias([
      { id: '1', cargo: 'Professor Titular', instituicao: 'Universidade Federal', periodo: '2018 - Presente', local: 'São Paulo, SP' },
      { id: '2', cargo: 'Pesquisador', instituicao: 'Instituto de Tecnologia', periodo: '2015 - 2018', local: 'Campinas, SP' }
    ]);

    setFormacoes([
      { id: '1', nivel: 'Doutorado em Ciência da Computação', instituicao: 'USP', periodo: '2012 - 2016', local: 'São Paulo, SP' },
      { id: '2', nivel: 'Mestrado em Engenharia de Software', instituicao: 'UNICAMP', periodo: '2010 - 2012', local: 'Campinas, SP' }
    ]);

    // Posts de exemplo
    setPosts([
      { id: '1', citacao: "A educação é a arma mais poderosa que você pode usar para mudar o mundo.", referencia: "Nelson Mandela" },
      { id: '2', citacao: "O sucesso é a soma de pequenos esforços repetidos dia após dia.", referencia: "Robert Collier" },
      { id: '3', citacao: "A tecnologia é apenas uma ferramenta. Para levar as crianças a trabalhar juntas e motivá-las, o professor é o mais importante.", referencia: "Bill Gates" },
      { id: '4', citacao: "Ensinar não é transferir conhecimento, mas criar as possibilidades para a sua própria produção ou a sua construção.", referencia: "Paulo Freire" },
      { id: '5', citacao: "O aprendizado nunca esgota a mente.", referencia: "Leonardo da Vinci" },
      { id: '6', citacao: "A criatividade é a inteligência se divertindo.", referencia: "Albert Einstein" },
      { id: '7', citacao: "Educação não é preparação para a vida; educação é a vida em si.", referencia: "John Dewey" }
    ]);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        setProfile({
          ...profile,
          foto: event.target?.result as string
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveExperiencia = () => {
    if (editMode.id && editMode.editing) {
      setExperiencias(experiencias.map(exp => 
        exp.id === editMode.id ? formData : exp
      ));
    } else {
      setExperiencias([...experiencias, {
        ...formData,
        id: Date.now().toString()
      }]);
    }
    setEditMode({section: '', id: null, editing: false});
    setFormData({});
  };

  const handleSaveFormacao = () => {
    if (editMode.id && editMode.editing) {
      setFormacoes(formacoes.map(form => 
        form.id === editMode.id ? formData : form
      ));
    } else {
      setFormacoes([...formacoes, {
        ...formData,
        id: Date.now().toString()
      }]);
    }
    setEditMode({section: '', id: null, editing: false});
    setFormData({});
  };

  const handleSavePost = () => {
    setPosts([...posts, {
      ...formData,
      id: Date.now().toString()
    }]);
    setEditMode({section: '', id: null, editing: false});
    setFormData({});
  };

  const loadMorePosts = () => {
    setVisiblePosts(prev => prev + 3);
  };

  const showLessPosts = () => {
    setVisiblePosts(3);
  };

  return (
    <div className="container mx-auto p-4 space-y-12">
      <Navbar />
      {/* Seção Perfil */}
      <div className="bg-white p-8 rounded-lg shadow-md relative">
        <div className="flex items-start gap-8">
          <div className="relative group">
            <img
              src={typeof profile.foto === 'string' ? profile.foto : URL.createObjectURL(profile.foto)}
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
            </div>
          )}
        </div>
        <Button 
          onClick={() => setEditProfile(!editProfile)}
          className="absolute top-6 right-6"
          variant="outline"
          size="sm"
        >
          {editProfile ? "Salvar Perfil" : "Editar Perfil"}
        </Button>
      </div>

      {/* Seção Posts - Feed expansível */}
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
              <div key={post.id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <blockquote className="italic text-gray-800 text-lg">"{post.citacao}"</blockquote>
                <p className="mt-4 text-sm text-gray-600 font-medium">{post.referencia}</p>
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

      {/* Seção Projetos */}
      <div className="container space-y-4">
        <div className="mt-20">
          <h1 className="px-8 text-left text-3xl font-bold">Projetos</h1>
          <Carrossel linhas={1}>
            {projetos.map((projeto, index) => (
              <CardProjeto key={index} {...projeto} />
            ))}
          </Carrossel>
        </div>
      </div>

      {/* Seção Eventos */}
      <div className="mt-20">
        <h1 className="px-8 text-left text-3xl font-bold">Eventos</h1>
        <Carrossel linhas={1}>
          {eventosDisponiveis.map(evento => (
            <CardEvento key={evento.id} {...evento} />
          ))}
        </Carrossel>
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
                    onClick={() => setExperiencias(experiencias.filter(e => e.id !== exp.id))}
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
                    onClick={() => setFormacoes(formacoes.filter(f => f.id !== form.id))}
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