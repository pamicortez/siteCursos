/*
  Warnings:

  - You are about to drop the column `categoria` on the `Colaborador` table. All the data in the column will be lost.
  - Added the required column `categoria` to the `projetoColaborador` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
ALTER TYPE "tipoUser" ADD VALUE 'Bloqueado';

-- AlterTable
ALTER TABLE "Colaborador" DROP COLUMN "categoria";

-- AlterTable
ALTER TABLE "projetoColaborador" ADD COLUMN     "categoria" "colaboradorCategoria" NOT NULL;
