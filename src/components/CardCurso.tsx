import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

interface CardCursoProps {
  imagem: string;
  nome: string;
  descricao: string;
  cargahoraria: string;
}

const CardCurso: React.FC<CardCursoProps> = ({ imagem, nome, descricao, cargahoraria }) => {
  return (
    <div className="card card-curso">
      <img src={imagem} className="card-img-top" alt={nome} />
      <div className="card-body">
        <h5 className="card-title">{nome}</h5>
        <p className="card-text">{descricao}</p>
        <p className="card-text">{cargahoraria}</p>
      </div>
    </div>
  );
};

export default CardCurso;
