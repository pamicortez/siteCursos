"use client"

import React, {useState, useEffect} from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useSession } from "next-auth/react"
import CreatableSelect from 'react-select/creatable';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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


type OptionType = { value: string; label: string };
type AulaType = {
  titulo: string;
  linkVideo: string;
  linkPdf: File | null;
  linkPodcast: string;
};


enum Categoria {
  SaudeEBemEstar = "Saúde e Bem-estar",
  CienciasBiologicasENaturais = "Ciências Biológicas e Naturais",
  TecnologiaEComputacao = "Tecnologia e Computação",
  EngenhariaEProducao = "Engenharia e Produção",
  CienciasSociaisENegocios = "Ciências Sociais Aplicadas e Negócios",
  EducacaoEFormacao = "Educação e Formação de Professores",
  CienciasExatas = "Ciências Exatas",
  CienciasHumanas = "Ciências Humanas",
  MeioAmbienteESustentabilidade = "Meio Ambiente e Sustentabilidade",
  LinguagensLetrasEComunicacao = "Linguagens, Letras e Comunicação",
  ArtesECultura = "Artes e Cultura",
  CienciasAgrarias = "Ciências Agrárias",
  PesquisaEInovacao = "Pesquisa e Inovação",
  ServicosSociaisEComunitarios = "Serviços Sociais e Comunitários",
  GestaoEPlanejamento = "Gestão e Planejamento",
}



export default function Curso() {

  const params = useParams()
  const router = useRouter();
  const id = params.id

  const [aulas, setAulas] = useState<AulaType[]>([{titulo: "", linkVideo: "", linkPdf: null, linkPodcast: "" }]);
  const [curso, setCurso] = useState([]);
  const [loadingInitial, setLoadingInitial] = useState(true); // Novo estado para controle inicial de carregamento
  
  
  const categoriasOptions = Object.entries(Categoria).map(([value, label]) => ({
  value,
  label,
  }));

  const { data: session, status } = useSession();

  useEffect(() => {

    if (status === 'unauthenticated') {
      router.push('/login');
    }

    async function loadCurso() {
      
        try {
          const res = await fetch(`/api/curso?id=${id}`); 

          if (!res.ok) {
            throw new Error('Falha ao carregar curso');
          }

          const data = await res.json();

          setCurso(data)
          setAulas(data.aula);
          setImagemBase64(data.imagem)
          setLinkApostila(data.linkApostila)

        } catch (error) {
            console.error("Erro ao carregar curso :", error);
        } finally {
            setLoadingInitial(false); // Marca o carregamento inicial como concluído
        }
    }
    loadCurso()



  }, [id])

  const [options, setOptions] = useState<OptionType[]>(categoriasOptions);
  const [selectedOption, setSelectedOption] = useState<OptionType | null>(null);
  const [imagemBase64, setImagemBase64] = useState<string | null>(null);
  const [linkApostila, setLinkApostila] = useState<string | null>(null);


  const handleInputAulasChange = (index: number, field: keyof AulaType, value: string | File | null) => {
    const updatedAulas = [...aulas];
    updatedAulas[index] = {
      ...updatedAulas[index],
      [field]: value,
    };
    setAulas(updatedAulas);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement> , setState: any, field: string) => {
    const { value } = e.target;

    setState((prev: any) => {
      const newValue = typeof prev[field] === 'object' && prev[field] !== null
        ? { label: value, value }
        : value;

      return {
        ...prev,
        [field]: newValue,
      };
    });
  }




  const addAula = () => {
    setAulas((prev) => [
      ...prev,
      {titulo: "", linkVideo: "", linkPdf: null, linkPodcast: "" }
    ]);
  };

  const removeAula = (index: number) => {
    const updatedAulas = aulas.filter((_, i) => i !== index);
    setAulas(updatedAulas);
  };


  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);


     // Função auxiliar para transformar um File em base64
    const fileToBase64 = (file: File | null) => {
      return new Promise<string | null>((resolve, reject) => {
        if (!file || typeof file === "string") return resolve(null); // se for string é pq ja existe o base64
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = error => reject(error);
      });
    };

    // remove aulas vazias (caso tenha clicado pra add uma nova e nao preencher)
    function removerAulasVazias(aulas: AulaType[]) {
      return aulas.filter((aula) => {
        return Object.values(aula).every((valor) => {
          if (typeof valor === "string") {
            return valor.trim() !== "";
          }
          return valor !== null || valor !== undefined;
        });
      });
    }


    const aulasFiltradas = removerAulasVazias(aulas)
    console.log(aulasFiltradas)

  // conversão em base64
    const aulasConvertidas = await Promise.all(
      aulasFiltradas.map(async (aula) => {
        let slideBase64 = null;

        if (aula.linkPdf != null) {
          slideBase64 = await fileToBase64(aula.linkPdf);
        }

        if (!aula.id) { // se nao tiver id é aula nova, monta o obj
          return {
            titulo: aula.titulo,
            linkVideo: aula.linkVideo,
            linkPdf: slideBase64,
            linkPodcast: aula.linkPodcast
          };
        } else return aula // se ja existir, retorna como ja estava
      })
    );

    // Pega os arquivos
    const apostilaFile = formData.get("apostila") as File | null;
    let apostilaBase64 = null;
    if (apostilaFile != null) {
      apostilaBase64 = await fileToBase64(apostilaFile)
    }
    

    const data = {
      titulo: formData.get("titulo"),
      metodologia: formData.get("metodologia"),
      categoria: formData.get('categoria'),
      descricao: formData.get('descricao'),
      bibliografia: formData.get('bibliografia'),
      imagem: imagemBase64,
      aulas: aulasConvertidas,
      linkInscricao: formData.get('inscricao'),
      vagas: Number(formData.get('vagas')),
      metodoAvaliacao: formData.get('avaliacao'),
      linkApostila: apostilaBase64,
      cargaHoraria: Number(formData.get('cargaHoraria'))
    };

    console.log(data)

    try {
      const response = await fetch(`/api/curso?id=${curso.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        alert('Curso editado com sucesso!');
      } else {
        alert('Erro ao editar o curso');
      }
    } catch (error) {
      alert('Erro ao enviar os dados para a API');
    }
}

  if (loadingInitial) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold">Carregando...</h2>
      </div>
    );
  }
  

  // Verifica se o projeto foi carregado e se o usuário é o dono
  const isCourseOwner = curso?.idUsuario == session?.user.id
  
  if (!isCourseOwner) {
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
      <form onSubmit={handleUpdate}>
      <div className="px-20 py-12">
        <h1 className="text-3xl font-bold mb-12 text-center">Editar Curso</h1>
          <div className="grid gap-6 mb-6 md:grid-cols-3">

            <div className="grid items-center gap-1.5">
              <Label htmlFor="titulo">Título</Label>
              <Input type="text" name="titulo" value={curso.titulo ?? ""} onChange={(e) => handleInputChange(e, setCurso, "titulo")}/>
            </div>

            <div className="grid items-center gap-1.5">
                <Label htmlFor="metodologia">Metodologia</Label>
                <Select name="metodologia"
                  value={curso.metodologia ?? ""}
                  onValueChange={(value) => setCurso((prev) => ({ ...prev, metodologia: value }))}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Escolha..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="Metodologia prática">Metodologia prática</SelectItem>
                      <SelectItem value="Outro">Outro</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
            </div>

            <div className="grid items-center gap-1.5">
              <Label htmlFor="inscricao">Link de Inscrição</Label>
              <Input type="text" name="inscricao" value={curso.linkInscricao ?? ""} onChange={(e) => handleInputChange(e, setCurso, "linkInscricao")}/>
            </div>

          </div>

          <div className="grid gap-6 mb-6 md:grid-cols-2">

              <div className="grid w-full gap-1.5">
                <Label htmlFor="message">Descrição</Label>
                <Textarea placeholder="" name="descricao" value={curso.descricao ?? ""} onChange={(e) => handleInputChange(e, setCurso, "descricao")}/>
              </div>

              <div className="grid w-full gap-1.5">
                <Label htmlFor="bibliografia">Bibliografia</Label>
                <Textarea placeholder="" name="bibliografia" value={curso.bibliografia ?? ""} onChange={(e) => handleInputChange(e, setCurso, "bibliografia")} />
              </div>

          </div>

          <div className="grid gap-6 mb-6 md:grid-cols-3">

            <div className="grid items-center gap-1.5">
              <Label htmlFor="imagem">Imagem</Label>
              <Input 
                type="file" 
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      setImagemBase64(reader.result as string); // base64 com prefixo data:image/...
                    };
                    reader.readAsDataURL(file); // Converte para base64
                    console.log(file.name)
                  }
                }} 
              />
            
            </div>

            <div className="grid items-center gap-1.5">
              <Label htmlFor="Carga horaria">Carga Horária</Label>
              <Input type="number" name="cargaHoraria" value={curso.cargaHoraria ?? ""} onChange={(e) => handleInputChange(e, setCurso, "cargaHoraria")}/>
            </div>

            <div>
                <label className="block mb-2 text-sm font-medium text-gray-900">Categoria</label>
                <Select name="categoria" value={curso.categoria ?? ""} onValueChange={(value) => setCurso((prev) => ({ ...prev, categoria: value }))}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Escolha..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {categoriasOptions.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
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
              <Input type="file" name="apostila"></Input>
            </div>

            <div className="grid items-center gap-1.5">
              <Label htmlFor="Vagas">Número de Vagas</Label>
              <Input type="number" name="vagas" value={curso.vagas ?? ""} onChange={(value) => setCurso((prev) => ({ ...prev, vagas: value }))}/>
            </div>

            <div className="grid items-center gap-1.5">
                <Label htmlFor="avaliação">Método de Avaliação</Label>
                <Select name="avaliacao"  value={curso.metodoAvaliacao ?? ""}
                  onValueChange={(value) => setCurso((prev) => ({ ...prev, metodoAvaliacao: value }))}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Escolha..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="Provas e projetos">Provas e projetos</SelectItem>
                      <SelectItem value="Outro">Outro</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
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
              <Input type="text" value={aula.titulo ?? ""} onChange={(e) => handleInputAulasChange(index, 'titulo', e.target.value)}></Input>
            </div>

            <div className="grid items-center gap-1.5 w-xs">
              <Label htmlFor="video">Link do Vídeo</Label>
              <Input type="text" value={aula.linkVideo ?? ""}  onChange={(e) => handleInputAulasChange(index, 'linkVideo', e.target.value)}></Input>
            </div>

            <div className="grid items-center gap-1.5 w-xs">
              <Label htmlFor="slide">Slide</Label>
              <Input type="file" onChange={(e) => handleInputAulasChange(index, 'linkPdf', e.target.files?.[0] || null)}></Input>
            </div>

            <div className="grid items-center gap-1.5 w-xs">
              <Label htmlFor="podcast">Link do Podcast</Label>
              <Input type="text" value={aula.linkPodcast ?? ""} onChange={(e) => handleInputAulasChange(index, 'linkPodcast', e.target.value)}></Input>
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
    </div>
    
  );
}

// corrigir o setaulas
// no select precisa ser um valor ja existente no selectitem