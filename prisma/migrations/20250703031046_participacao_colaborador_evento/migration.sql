/*
  Warnings:

  - Changed the type of `categoria` on the `eventoColaborador` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "eventoColaborador" DROP COLUMN "categoria",
ADD COLUMN     "categoria" "tipoParticipacao" NOT NULL;
