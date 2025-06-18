/*
  Warnings:

  - You are about to drop the column `data` on the `Evento` table. All the data in the column will be lost.
  - Added the required column `categoria` to the `Evento` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dataFim` to the `Evento` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dataInicio` to the `Evento` table without a default value. This is not possible if the table is not empty.
  - Added the required column `local` to the `Evento` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Evento" DROP COLUMN "data",
ADD COLUMN     "categoria" "categoriaCurso" NOT NULL,
ADD COLUMN     "dataFim" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "dataInicio" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "local" TEXT NOT NULL,
ALTER COLUMN "linkParticipacao" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Projeto" ALTER COLUMN "dataFim" DROP NOT NULL;

-- CreateTable
CREATE TABLE "eventoColaborador" (
    "id" SERIAL NOT NULL,
    "categoria" "colaboradorCategoria" NOT NULL,
    "idEvento" INTEGER NOT NULL,
    "idColaborador" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "eventoColaborador_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "eventoColaborador" ADD CONSTRAINT "eventoColaborador_idEvento_fkey" FOREIGN KEY ("idEvento") REFERENCES "Evento"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "eventoColaborador" ADD CONSTRAINT "eventoColaborador_idColaborador_fkey" FOREIGN KEY ("idColaborador") REFERENCES "Colaborador"("id") ON DELETE CASCADE ON UPDATE CASCADE;
