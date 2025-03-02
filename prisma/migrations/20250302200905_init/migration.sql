-- CreateEnum
CREATE TYPE "Titulacao" AS ENUM ('Bacharel', 'Licenciado', 'Especialista', 'Mestre', 'Doutor');

-- CreateEnum
CREATE TYPE "tipoParticipacao" AS ENUM ('Ouvinte', 'Palestrante', 'Organizador');

-- CreateTable
CREATE TABLE "Projeto" (
    "id" SERIAL NOT NULL,
    "titulo" TEXT NOT NULL,
    "imagem" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "categoria" TEXT NOT NULL,
    "dataInicio" TIMESTAMP(3) NOT NULL,
    "dataFim" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Projeto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Curso" (
    "id" SERIAL NOT NULL,
    "titulo" TEXT NOT NULL,
    "imagem" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "categoria" TEXT NOT NULL,
    "cargaHoraria" DOUBLE PRECISION NOT NULL,
    "linkInscricao" TEXT NOT NULL,
    "vagas" INTEGER NOT NULL,
    "bibliografia" TEXT NOT NULL,
    "metodologia" TEXT NOT NULL,
    "metodoAvaliacao" TEXT NOT NULL,
    "idProjeto" INTEGER NOT NULL,
    "idUsuario" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Curso_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Aula" (
    "id" SERIAL NOT NULL,
    "titulo" TEXT NOT NULL,
    "linkPdf" TEXT NOT NULL,
    "linkVideo" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Aula_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Usuario" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "fotoPerfil" TEXT NOT NULL,
    "senha" TEXT NOT NULL,
    "Nome" TEXT NOT NULL,
    "Titulacao" "Titulacao" NOT NULL,
    "instituicaoEnsino" TEXT NOT NULL,
    "formacaoAcademica" TEXT NOT NULL,
    "resumoPessoal" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Link" (
    "id" SERIAL NOT NULL,
    "link" TEXT NOT NULL,
    "idUsuario" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Link_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Publicacao" (
    "id" SERIAL NOT NULL,
    "descricao" TEXT NOT NULL,
    "link" TEXT NOT NULL,
    "idUsuario" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Publicacao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Evento" (
    "id" SERIAL NOT NULL,
    "titulo" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "data" TIMESTAMP(3) NOT NULL,
    "linkParticipacao" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Evento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "imagemEvento" (
    "id" SERIAL NOT NULL,
    "link" TEXT NOT NULL,
    "idEvento" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "imagemEvento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "eventoUsuario" (
    "id" SERIAL NOT NULL,
    "idUsuario" INTEGER NOT NULL,
    "idEvento" INTEGER NOT NULL,
    "tipoParticipacao" "tipoParticipacao" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "eventoUsuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cursoUsuario" (
    "id" SERIAL NOT NULL,
    "idCurso" INTEGER NOT NULL,
    "idUsuario" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cursoUsuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "projetoUsuario" (
    "id" SERIAL NOT NULL,
    "idProjeto" INTEGER NOT NULL,
    "idUsuario" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "projetoUsuario_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_email_key" ON "Usuario"("email");
