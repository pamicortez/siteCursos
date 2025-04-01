"use client"

import { useEffect, useState } from "react";

export default function Home() {
  const [professores, setProfessores] = useState([]);
  const [cursos, setCursos] = useState([]);
  const [projetos, setProjetos] = useState([]);

  useEffect(() => {
    // Buscar professores
    fetch("http://localhost:3000/api/usuario")
      .then((res) => res.json())
      .then((data) => setProfessores(data));

    // Buscar cursos de tecnologia
    fetch("http://localhost:3000/api/curso?categoria=Tecnologia")
      .then((res) => res.json())
      .then((data) => setCursos(data));

    // Buscar projetos de tecnologia
    fetch("http://localhost:3000/api/projeto?categoria=Tecnologia")
      .then((res) => res.json())
      .then((data) => setProjetos(data));
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Lista de Professores</h1>
      <ul>
        {professores.map((prof) => (
          <li key={prof.id} className="border p-2 my-2">
            <strong>{prof.Nome}</strong> - {prof.Titulacao}
          </li>
        ))}
      </ul>

      <h1 className="text-2xl font-bold mt-6">Cursos de Tecnologia</h1>
      <ul>
        {cursos.map((curso) => (
          <li key={curso.id} className="border p-2 my-2">
            <strong>{curso.titulo}</strong> - {curso.descricao}
          </li>
        ))}
      </ul>

      <h1 className="text-2xl font-bold mt-6">Projetos de Tecnologia</h1>
      <ul>
        {projetos.map((projeto) => (
          <li key={projeto.id} className="border p-2 my-2">
            <strong>{projeto.titulo}</strong> - {projeto.descricao}
          </li>
        ))}
      </ul>
    </div>
  );
}
