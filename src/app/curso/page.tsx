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


type OptionType = { value: string; label: string };

export default function Curso() {

  const [options, setOptions] = useState<OptionType[]>([
    { value: "op1", label: "Opção 1" },
    { value: "op2", label: "Opção 2" },
  ]);
  const [selectedOption, setSelectedOption] = useState<OptionType | null>(null);

  const handleCreate = (inputValue: string) => {
    const newOption = { value: inputValue.toLowerCase(), label: inputValue };
    setOptions((prev) => [...prev, newOption]);
    setSelectedOption(newOption);
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

  
  return (
    <div>
      <form>
      <div className="px-20 py-12">
        <h1 className="text-3xl font-bold mb-12 text-center">Criar Curso</h1>
          <div className="grid gap-6 mb-6 md:grid-cols-2">

            <div className="grid items-center gap-1.5">
              <Label htmlFor="titulo">Título</Label>
              <Input type="text"></Input>
            </div>

            <div className="grid items-center gap-1.5">
                <Label htmlFor="avaliação">Metodologia</Label>
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

            <div className="grid w-full gap-1.5">
              <Label htmlFor="message">Descrição</Label>
              <Textarea placeholder="" id="message" />
            </div>

            <div className="grid w-full gap-1.5">
              <Label htmlFor="message">Bibliografia</Label>
              <Textarea placeholder="" id="message" />
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
          <div className="flex justify-end">
            <Button>+ Adicionar mais</Button>
          </div>
         
          <div className="flex justify-between gap-5 mb-6 md:grid-cols-5">
            <div className="grid items-center gap-1.5 w-xs">
              <Label htmlFor="titulo">Título</Label>
              <Input type="text"></Input>
            </div>

            <div className="grid items-center gap-1.5 w-xs">
              <Label htmlFor="video">Link do Vídeo</Label>
              <Input type="text"></Input>
            </div>

            <div className="grid items-center gap-1.5 w-xs">
              <Label htmlFor="slide">Slide</Label>
              <Input type="file"></Input>
            </div>

            <div className="grid items-center gap-1.5 w-xs">
              <Label htmlFor="podcast">Link do Podcast</Label>
              <Input type="text"></Input>
            </div>

            <div className='grid items-center mt-6 w-10'>
              <Button>+</Button>
            </div>
          </div>

        <div className='justify-center items-center flex'><Button className='mt-8'>Salvar</Button></div>
      
      </div>
      
      </form>
    </div>
    
  );
}
