"use client"

import React, {useState, useEffect} from 'react'
import { useSearchParams, useRouter, notFound } from 'next/navigation';
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
  video: string;
  slide: File | null;
  podcast: string;
};

enum Categoria {
  Agricultura = "Agricultura",
  Silvicultura = "Silvicultura",
  PescaEVeterinaria = "Pesca e Veterinária",
  ArtesEHumanidades = "Artes e Humanidades",
  CienciasSociais = "Ciências Sociais",
  ComunicacaoEInformacao = "Comunicação e Informação",
  CienciasNaturais = "Ciências Naturais",
  MatematicaEEstatistica = "Matemática e Estatística",
  ComputacaoETecnologiaDaInformacao = "Computação e TI",
  Engenharia = "Engenharia",
  ProducaoEConstrucao = "Produção e Construção",
  SaudeEBemEstar = "Saúde e Bem-Estar",
  Educacao = "Educação",
  NegociosAdministracaoEDireito = "Negócios, Administração e Direito",
  Servicos = "Serviços",
  ProgramasBasicos = "Programas Básicos",
}


export default function Curso() {

  const searchParams = useSearchParams();
  const idProjeto = searchParams.get('idProjeto')
  const router = useRouter();

  // useEffect(() => {
  //   if (!user) {
  //     router.replace('/'); // (fazer isso tbm caso nao esteja logado)
  //   }
  // }, [idProjeto, router]);

  if (!idProjeto) {
    notFound(); // Retorna 404 se nao tiver o idProjeto
  }

  const categoriasOptions = Object.entries(Categoria).map(([value, label]) => ({
  value,
  label,
}));

  const [options, setOptions] = useState<OptionType[]>(categoriasOptions);
  const [selectedOption, setSelectedOption] = useState<OptionType | null>(null);
  const [imagemBase64, setImagemBase64] = useState<string | null>(null);
  const [linkApostila, setLinkApostila] = useState<string | null>(null);

  const [aulas, setAulas] = useState<AulaType[]>([{titulo: "", video: "", slide: null, podcast: "" }]);

  const handleCreate = (inputValue: string) => {
    const newOption = { value: inputValue.toLowerCase(), label: inputValue };
    setOptions((prev) => [...prev, newOption]);
    setSelectedOption(newOption);
  };

  const handleInputChange = (index: number, field: keyof AulaType, value: string | File | null) => {
    const updatedAulas = [...aulas];
    updatedAulas[index] = {
      ...updatedAulas[index],
      [field]: value,
    };
    setAulas(updatedAulas);
  };



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


    const customStyles = {
    control: (provided: any, state: any) => ({
      ...provided,
      backgroundColor: "white",
      borderWidth: "1px",
      borderRadius: "6px",
      minHeight: "30px",
    }),
    menu: (provided: any) => ({
      ...provided,
      backgroundColor: "white",
      borderRadius: "6px",
      boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
    }),
    option: (provided: any, state: { isFocused: any; }) => ({
      ...provided,
      backgroundColor: state.isFocused ? "#EEF2FF" : "white",
      color: "#111827",
      padding: "10px",
      cursor: "pointer",
    }),
    placeholder: (provided: any) => ({
      ...provided,
      color: "#9CA3AF", // Cinza do Tailwind
      fontSize: "14px",
    }),
  };

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
        return Object.values(aula).every((valor) => {
          if (typeof valor === "string") {
            return valor.trim() !== "";
          }
          return valor !== null || valor !== undefined;
        });
      });
    }

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

    // Pega os arquivos
    const slideFile = formData.get("slide") as File | null;
    const apostilaFile = formData.get("apostila") as File | null;

    // Converte pra string base64
    const slideBase64 = await fileToBase64(slideFile);
    const apostilaBase64 = await fileToBase64(apostilaFile)

    const data = {
      titulo: formData.get("titulo"),
      metodologia: formData.get("metodologia"),
      categoria: selectedOption?.value, // Seleção feita com react-select
      descricao: formData.get('descricao'),
      bibliografia: formData.get('bibliografia'),
      imagem: imagemBase64,
      aulas: aulasConvertidas,
      idProjeto: Number(idProjeto), // recebe via query param ?idprojeto
      idUsuario: 1, // como pegar
      linkInscricao: formData.get('inscricao'),
      vagas: Number(formData.get('vagas')),
      metodoAvaliacao: formData.get('avaliacao'),
      linkApostila: apostilaBase64,
      cargaHoraria: Number(formData.get('cargaHoraria'))
    };

    console.log(data)

    try {
      const response = await fetch('/api/curso', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        alert('Curso criado com sucesso!');
        const res = await response.json();
        router.replace(`/curso/detalhes/${res.id}`)
      } else {
        alert('Erro ao criar o curso');
      }
    } catch (error) {
      alert('Erro ao enviar os dados para a API');
    }
}

  
  return (
    <div>
      <form onSubmit={handleSubmit}>
      <div className="px-20 py-12">
        <h1 className="text-3xl font-bold mb-12 text-center">Criar Curso</h1>
          <div className="grid gap-6 mb-6 md:grid-cols-3">

            <div className="grid items-center gap-1.5">
              <Label htmlFor="titulo">Título</Label>
              <Input type="text" name="titulo"/>
            </div>

            <div className="grid items-center gap-1.5">
                <Label htmlFor="metodologia">Metodologia</Label>
                <Select name="metodologia">
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Escolha..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="Opção 1">Opção 1</SelectItem>
                      <SelectItem value="Opção 2">Opção 2</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
            </div>

            <div className="grid items-center gap-1.5">
              <Label htmlFor="inscricao">Link de Inscrição</Label>
              <Input type="text" name="inscricao"/>
            </div>

          </div>

          <div className="grid gap-6 mb-6 md:grid-cols-2">

              <div className="grid w-full gap-1.5">
                <Label htmlFor="message">Descrição</Label>
                <Textarea placeholder="" name="descricao" />
              </div>

              <div className="grid w-full gap-1.5">
                <Label htmlFor="bibliografia">Bibliografia</Label>
                <Textarea placeholder="" name="bibliografia" />
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
                  }
                }} 
              />
            </div>

            <div className="grid items-center gap-1.5">
              <Label htmlFor="Carga horaria">Carga Horária</Label>
              <Input type="number" name="cargaHoraria"></Input>
            </div>

            <div>
                <label className="block mb-2 text-sm font-medium text-gray-900">Categoria</label>
                <CreatableSelect name="categoria"
                isClearable
                styles={customStyles}
                options={options}
                value={selectedOption}
                onChange={setSelectedOption}
                onCreateOption={handleCreate}
                placeholder="Selecione ou crie..."
                required />
            </div>

          </div>

          <div className="grid gap-6 mb-6 md:grid-cols-3">

            <div className="grid items-center gap-1.5">
              <Label htmlFor="apostila">Apostila</Label>
              <Input type="file" name="apostila"></Input>
            </div>

            <div className="grid items-center gap-1.5">
              <Label htmlFor="Vagas">Número de Vagas</Label>
              <Input type="number" name="vagas"></Input>
            </div>

            <div className="grid items-center gap-1.5">
                <Label htmlFor="avaliação">Método de Avaliação</Label>
                <Select name="avaliacao">
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="apple">Apple</SelectItem>
                      <SelectItem value="banana">Banana</SelectItem>
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
              <Input type="text" value={aula.titulo} onChange={(e) => handleInputChange(index, 'titulo', e.target.value)}></Input>
            </div>

            <div className="grid items-center gap-1.5 w-xs">
              <Label htmlFor="video">Link do Vídeo</Label>
              <Input type="text" value={aula.video} onChange={(e) => handleInputChange(index, 'video', e.target.value)}></Input>
            </div>

            <div className="grid items-center gap-1.5 w-xs">
              <Label htmlFor="slide">Slide</Label>
              <Input type="file" onChange={(e) => handleInputChange(index, 'slide', e.target.files?.[0] || null)}></Input>
            </div>

            <div className="grid items-center gap-1.5 w-xs">
              <Label htmlFor="podcast">Link do Podcast</Label>
              <Input type="text" value={aula.podcast} onChange={(e) => handleInputChange(index, 'podcast', e.target.value)}></Input>
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
// add link inscrição como um campo, pegar o idprojeto e idusuario (se der), corrigir o bug nos campos de aula
// quando eu clico p add aula depois de ja ter preenchido tudo, tá dando post pra api