-- CreateEnum
CREATE TYPE "categoriaCarreira" AS ENUM ('Formação acadêmica', 'Experiencia profissional');

-- CreateTable
CREATE TABLE "Carreira" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "categoria" "categoriaCarreira" NOT NULL,
    "dataInicio" TIMESTAMP(3) NOT NULL,
    "dataFim" TIMESTAMP(3) NOT NULL,
    "idUsuario" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Carreira_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Carreira" ADD CONSTRAINT "Carreira_idUsuario_fkey" FOREIGN KEY ("idUsuario") REFERENCES "Usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;
