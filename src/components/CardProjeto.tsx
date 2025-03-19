import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

interface CardProjetoProps {
  imagem: string;
  nome: string;
  descricao: string;
}

const CardProjeto: React.FC<CardProjetoProps> = ({ imagem, nome, descricao }) => {
  return (
    <div className="card card-projeto">
      <img src={imagem} className="card-img-top" alt={nome} />
      <div className="card-body">
        <h5 className="card-title">{nome}</h5>
        <p className="card-text">{descricao}</p>
      </div>
    </div>
  );
};

export default CardProjeto;
