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

  
  return (
    <div>
      <form>
      <div className="px-28 py-12">
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
                    <SelectValue placeholder="Select a fruit" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="apple">Apple</SelectItem>
                      <SelectItem value="banana">Banana</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
            </div>

            <div>
                <label className="block mb-2 text-sm font-medium text-gray-900">Descrição</label>
                <textarea className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" required />
            </div>

            <div>
                <label className="block mb-2 text-sm font-medium text-gray-900">Bibliografia</label>
                <textarea className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" required />
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
                    <SelectValue placeholder="Select a fruit" />
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


          <h1 className="text-3xl font-bold mb-5 text-center">Aulas</h1>
          <div className="flex justify-end">
            <Button>+ Adicionar mais</Button>
          </div>
         
          <div className="grid gap-6 mb-6 md:grid-cols-5">

            
            <div className="grid items-center gap-1.5">
              <Label htmlFor="titulo">Link Vídeo</Label>
              <Input type="text"></Input>
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-900">Título</label>
              <input type="text" id="first_name" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="John" required />
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-900">Slide</label>
              <input className="block w-full p-2 text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50" id="file_input" type="file"/>
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-900">Link Podcast</label>
              <input type="text" id="first_name" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="John" required />
            </div>

            <div className='flex justify-between items-center mt-6'>
              <Button>+</Button>
            </div>

          </div>

      </div>
      </form>
    </div>
    
  );
}
