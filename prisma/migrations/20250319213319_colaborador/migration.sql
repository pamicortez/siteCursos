-- CreateEnum
CREATE TYPE "colaboradorCategoria" AS ENUM ('Cordenador(a)', 'Colaborador(a)', 'Bolsista', 'Voluntário');

-- CreateTable
CREATE TABLE "Colaborador" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "categoria" "colaboradorCategoria" NOT NULL,

    CONSTRAINT "Colaborador_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "projetoColaborador" (
    "id" SERIAL NOT NULL,
    "idProjeto" INTEGER NOT NULL,
    "idColaborador" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "projetoColaborador_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "projetoColaborador" ADD CONSTRAINT "projetoColaborador_idProjeto_fkey" FOREIGN KEY ("idProjeto") REFERENCES "Projeto"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "projetoColaborador" ADD CONSTRAINT "projetoColaborador_idColaborador_fkey" FOREIGN KEY ("idColaborador") REFERENCES "Colaborador"("id") ON DELETE CASCADE ON UPDATE CASCADE;
