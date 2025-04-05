"use client"

import React, {useState} from 'react'
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

export default function Curso() {

  const [options, setOptions] = useState<OptionType[]>([
    { value: "op1", label: "Opção 1" },
    { value: "op2", label: "Opção 2" },
  ]);
  const [selectedOption, setSelectedOption] = useState<OptionType | null>(null);


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
      {titulo: "", video: "", slide: null, podcast: "" },
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

     const data = {
    //   titulo: e.target.titulo.value,
    //   metodologia: e.target.categoria,
    //   categoria: selectedOption?.value, // Seleção feita com react-select
    //   descricao: e.target.descricao.value,
    //   bibliografia: e.target.bibliografia.value,
      // aulas: aulas.map((aula) => ({
      //   titulo: aula.titulo,
      //   video: aula.video,
      //   slide: aula.slide, 
      //   podcast: aula.podcast,
      // })),
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
        alert('Curso criado com sucesso!');
      } else {
        alert('Erro ao criar o curso');
      }
    } catch (error) {
      alert('Erro ao enviar os dados para a API');
    }
  };

  
  return (
    <div>
      <form onSubmit={handleSubmit}>
      <div className="px-20 py-12">
        <h1 className="text-3xl font-bold mb-12 text-center">Criar Curso</h1>
          <div className="grid gap-6 mb-6 md:grid-cols-2">

            <div className="grid items-center gap-1.5">
              <Label htmlFor="titulo">Título</Label>
              <Input type="text" name="titulo"/>
            </div>

            <div className="grid items-center gap-1.5">
                <Label htmlFor="avaliação">Metodologia</Label>
                <Select>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Escolha..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="apple">Apple</SelectItem>
                      <SelectItem value="banana">Banana</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
            </div>

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
              <Input type="file"></Input>
            </div>

            <div className="grid items-center gap-1.5">
              <Label htmlFor="Carga horaria">Carga Horária</Label>
              <Input type="number"></Input>
            </div>

            <div>
                <label className="block mb-2 text-sm font-medium text-gray-900">Categoria</label>
                <CreatableSelect
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
              <Label htmlFor="imagem">Apostila</Label>
              <Input type="file"></Input>
            </div>

            <div className="grid items-center gap-1.5">
              <Label htmlFor="Vagas">Número de Vagas</Label>
              <Input type="number"></Input>
            </div>

            <div className="grid items-center gap-1.5">
                <Label htmlFor="avaliação">Método de Avaliação</Label>
                <Select>
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
            <Button onClick={addAula}>+ Adicionar aula</Button>
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
              <Input type="file" onChange={(e) => handleInputChange(index, 'slide', e.target.value)}></Input>
            </div>

            <div className="grid items-center gap-1.5 w-xs">
              <Label htmlFor="podcast">Link do Podcast</Label>
              <Input type="text" value={aula.podcast} onChange={(e) => handleInputChange(index, 'podcast', e.target.value)}></Input>
            </div>
            <div className="grid items-center mt-6 w-10">
              <Button
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
