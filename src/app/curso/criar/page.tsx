"use client"

import React, {useState, useEffect} from 'react'
import {useSession} from "next-auth/react"
import { useSearchParams, useRouter, notFound } from 'next/navigation';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import ImageCropper from "@/components/ui/ImageCropperBase64"

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Trash2 } from 'lucide-react';
import { ConfirmationModal } from '@/components/ConfirmationModal';


type AulaType = {
  titulo: string;
  video: string;
  slide: File | null;
  podcast: string;
};

// enum Categoria {
//   SaudeEBemEstar = "Saúde e Bem-estar",
//   CienciasBiologicasENaturais = "Ciências Biológicas e Naturais",
//   TecnologiaEComputacao = "Tecnologia e Computação",
//   EngenhariaEProducao = "Engenharia e Produção",
//   CienciasSociaisENegocios = "Ciências Sociais Aplicadas e Negócios",
//   EducacaoEFormacao = "Educação e Formação de Professores",
//   CienciasExatas = "Ciências Exatas",
//   CienciasHumanas = "Ciências Humanas",
//   MeioAmbienteESustentabilidade = "Meio Ambiente e Sustentabilidade",
//   LinguagensLetrasEComunicacao = "Linguagens, Letras e Comunicação",
//   ArtesECultura = "Artes e Cultura",
//   CienciasAgrarias = "Ciências Agrárias",
//   PesquisaEInovacao = "Pesquisa e Inovação",
//   ServicosSociaisEComunitarios = "Serviços Sociais e Comunitários",
//   GestaoEPlanejamento = "Gestão e Planejamento",
// }



export default function Curso() {

  const searchParams = useSearchParams();
  const idProjeto = searchParams.get('idProjeto')
  const router = useRouter();

  const { data: session, status } = useSession();
  const [categories, setCategories] = useState<string[]>([]);
  const [projeto, setProjeto] = useState({})
  const [loadingInitial, setLoadingInitial] = useState(true); // Novo estado para controle inicial de carregamento
  const [resultDialog, setResultDialog] = useState({
    title: '',
    message: '',
    isError: false,
    cursoId: null as string | null,
  });
  const [showResultDialog, setShowResultDialog] = useState(false);
  


  if (!idProjeto) {
    notFound(); // Retorna 404 se nao tiver o idProjeto
  }

  // Proteção da pagina, acesso apenas para usuarios autenticados
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
      return
    }

    async function loadProjeto() {
    
        try {
          const res = await fetch(`/api/projeto?id=${idProjeto}`); 
          if (!res.ok) {
            throw new Error('Falha ao carregar projeto');
          }
          const data = await res.json();
          setProjeto(data);
          console.log("Dados do projeto carregados:", data);
        } catch (error) {
          console.error("Erro ao carregar projeto:", error);
        } finally {
          setLoadingInitial(false); // Marca o carregamento inicial como concluído
        }
      console.log(projeto)
    }

    async function loadCategories() {
      try {
        const response = await fetch("/api/enums/categoriaCurso");
        if (!response.ok) {
          throw new Error("Erro ao buscar categorias de evento");
        }
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error("Erro:", error);
      }
    };
  
    loadCategories();

    loadProjeto()

  }, [status, router]);




  const [imagemBase64, setImagemBase64] = useState<string | null>(null);

  const [aulas, setAulas] = useState<AulaType[]>([{titulo: "", video: "", slide: null, podcast: "" }]);
  const [showImageCropper, setShowImageCropper] = useState(false);
  

  const handleAulasInputChange = (index: number, field: keyof AulaType, value: string | File | null) => {
    const updatedAulas = [...aulas];
    updatedAulas[index] = {
      ...updatedAulas[index],
      [field]: value,
    };
    setAulas(updatedAulas);
  };

  // const categoriaOptions = Object.entries(Categoria).map(([key, value]) => ({
  //   label: value,
  //   value: key,
  // }));




  const addAula = () => {
    setAulas((prev) => [
      ...prev,
      {titulo: "", video: "", slide: null, podcast: "" }
    ]);
  };

  const removeAula = (index: number) => {
    const updatedAulas = aulas.filter((_, i) => i !== index);
    setAulas(updatedAulas);
  };

  // Submit do form completo
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);


     // Função auxiliar para transformar um File em base64
    const fileToBase64 = (file: File | null) => {
      return new Promise<string | null>((resolve, reject) => {
        if (!file) return resolve(null);
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = error => reject(error);
      });
    };

    // remove aulas vazias (caso tenha clicado pra add uma nova e nao preencher)
    function removerAulasVazias(aulas: AulaType[]) {
      return aulas.filter((aula) => {
           return (
              aula.titulo.trim() !== "" ||
              aula.video.trim() !== "" ||
              aula.slide !== null ||
              aula.podcast.trim() !== ""
            );
    })}

    const aulasFiltradas = removerAulasVazias(aulas)

    const aulasConvertidas = await Promise.all(
      aulasFiltradas.map(async (aula) => {
        const slideBase64 = await fileToBase64(aula.slide);
        return {
          titulo: aula.titulo,
          linkVideo: aula.video,
          linkPdf: slideBase64,
          linkPodcast: aula.podcast
          };
        })
    );

    const apostilaFile = formData.get("apostila") as File | null;

    // Converte pra string base64
    const apostilaBase64 = await fileToBase64(apostilaFile)

    const data = {
      titulo: formData.get("titulo"),
      metodologia: formData.get("metodologia"),
      categoria: formData.get('categoria'),
      descricao: formData.get('descricao'),
      bibliografia: formData.get('bibliografia'),
      imagem: imagemBase64,
      aulas: aulasConvertidas,
      idProjeto: Number(idProjeto),
      idUsuario: Number(session?.user.id),
      linkInscricao: formData.get('inscricao'),
      vagas: Number(formData.get('vagas')),
      metodoAvaliacao: formData.get('avaliacao'),
      linkApostila: apostilaBase64,
      cargaHoraria: Number(formData.get('cargaHoraria'))
    };

    try {
      const response = await fetch('/api/curso', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const res = await response.json();
        setResultDialog({
          title: 'Sucesso!',
          message: 'Curso criado com sucesso.',
          isError: false,
          cursoId: res.id 
        });
      } else {
        //alert('Erro ao criar o curso');
        const errorData = await response.json();
        console.error("Erro da API:", errorData);
        setResultDialog({
          title: 'Erro',
          message: 'Erro ao salvar o curso',
          isError: true,
          cursoId: null
        });
      }
    } catch (error) {
      alert('Erro ao enviar os dados para a API');
    } finally {
      setShowResultDialog(true)
    }


  }

  const handleSuccessConfirm = () => {
    if (resultDialog.cursoId) {
      router.push(`/curso/detalhes/${resultDialog.cursoId}`);
    } else {
      setShowResultDialog(false);
    }
  };



  if (loadingInitial) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold">Carregando...</h2>
      </div>
    );
  }


  // Verifica se o projeto foi carregado e se o usuário é o dono
  const isProjectOwner = projeto?.projetoUsuario?.some(
    (user: any) => Number(user.idUsuario) === Number(session?.user?.id)
  );
  
  if (!isProjectOwner) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold">Acesso Negado</h2>
        <p className="mt-4">Você não tem permissão para criar curso nesse projeto.</p>
        <Button onClick={() => window.history.back()} className="mt-6">Voltar</Button>
      </div>
    );
  }
  

  return (
    <div>
      <form onSubmit={handleSubmit}>
      <div className="px-20 py-12">
        <h1 className="text-3xl font-bold mb-12 text-center">Criar Curso</h1>
          <div className="grid gap-6 mb-6 md:grid-cols-3">

            <div className="grid items-center gap-1.5">
              <Label htmlFor="titulo">Título*</Label>
              <Input type="text" name="titulo"/>
            </div>

            <div className="grid items-center gap-1.5">
              <Label htmlFor="metodologia">Metodologia*</Label>
              <Input type="text" name="metodologia"/>
            </div>

            <div className="grid items-center gap-1.5">
              <Label htmlFor="inscricao">Link de Inscrição*</Label>
              <Input type="text" name="inscricao"/>
            </div>

          </div>

          <div className="grid gap-6 mb-6 md:grid-cols-2">

              <div className="grid w-full gap-1.5">
                <Label htmlFor="message">Descrição*</Label>
                <Textarea name="descricao" />
              </div>

              <div className="grid w-full gap-1.5">
                <Label htmlFor="bibliografia">Bibliografia*</Label>
                <Textarea  name="bibliografia" />
              </div>

          </div>

          <div className="grid gap-6 mb-6 md:grid-cols-3">

            <div className="grid items-center gap-1.5">
              <Label htmlFor="imagem">Imagem*</Label>
              <Input 
                type="file" 
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      setImagemBase64(reader.result as string);
                      setShowImageCropper(true);
                      console.log("chegou aqui")
                    };
                    reader.readAsDataURL(file); // Converte para base64
                  }
                }} 
              />
            </div>

            <div className="grid items-center gap-1.5">
              <Label htmlFor="Carga horaria">Carga Horária*</Label>
              <Input type="number" name="cargaHoraria"></Input>
            </div>

            <div>
                <label className="block mb-2 text-sm font-medium text-gray-900">Categoria*</label>
                <Select name="categoria">
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Escolha..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {categories.map((opt) => (
                        <SelectItem key={opt} value={opt}>
                          {opt}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>

            </div>

          </div>

          <div className="grid gap-6 mb-6 md:grid-cols-3">

            <div className="grid items-center gap-1.5">
              <Label htmlFor="apostila">Apostila</Label>
              <Input type="file" accept=".pdf" name="apostila"></Input>
            </div>

            <div className="grid items-center gap-1.5">
              <Label htmlFor="Vagas">Número de Vagas*</Label>
              <Input type="number" name="vagas"></Input>
            </div>

            <div className="grid items-center gap-1.5">
              <Label htmlFor="avaliacao">Método de Avaliação*</Label>
              <Input type="text" name="avaliacao"/>
            </div>

          </div>


          <h1 className="text-3xl font-bold mb-3 mt-20 text-center">Aulas</h1>
          <div className="mb-5 flex justify-end"> 
            <Button type="button" onClick={addAula}>+ Adicionar aula</Button>
          </div>
         
         {aulas.map((aula, index) => (
          <div key={index} className="flex justify-between gap-5 mb-6 md:grid-cols-5">
            <div className="grid items-center gap-1.5 w-xs">
              <Label htmlFor="titulo">Título</Label>
              <Input type="text" value={aula.titulo} onChange={(e) => handleAulasInputChange(index, 'titulo', e.target.value)}></Input>
            </div>

            <div className="grid items-center gap-1.5 w-xs">
              <Label htmlFor="video">Link do Vídeo</Label>
              <Input type="text" value={aula.video} onChange={(e) => handleAulasInputChange(index, 'video', e.target.value)}></Input>
            </div>

            <div className="grid items-center gap-1.5 w-xs">
              <Label htmlFor="slide">Slide</Label>
              <Input type="file" onChange={(e) => handleAulasInputChange(index, 'slide', e.target.files?.[0] || null)}></Input>
            </div>

            <div className="grid items-center gap-1.5 w-xs">
              <Label htmlFor="podcast">Link do Podcast</Label>
              <Input type="text" value={aula.podcast} onChange={(e) => handleAulasInputChange(index, 'podcast', e.target.value)}></Input>
            </div>
            <div className="grid items-center mt-6 w-10">
              <Button
                type="button"
                onClick={() => removeAula(index)}
                className="hover:cursor-pointer p-2"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}

        <div className='justify-center items-center flex'><Button className='mt-8' type="submit">Salvar</Button></div>
      
      </div>
      
      </form>

      <ConfirmationModal
        isOpen={showResultDialog}
        onConfirm={handleSuccessConfirm}
        title={resultDialog.title}
        message={resultDialog.message}
        confirmText="OK"
        variant={resultDialog.isError ? 'destructive' : 'default'}
      />


      {/* Modal do Image Cropper */}
          {showImageCropper && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-semibold">Ajustar Imagem</h3>
                    <button
                      onClick={() => setShowImageCropper(false)}
                      className="text-gray-400 hover:text-gray-600 text-2xl"
                    >
                      ×
                    </button>
                  </div>
            <ImageCropper
                imageSrc={imagemBase64} // imagem original
                onUploadSuccess={(base64) => {
                  setImagemBase64(base64);
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