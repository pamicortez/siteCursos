-- AlterTable
ALTER TABLE "Aula" ADD COLUMN     "linkPodcast" TEXT,
ALTER COLUMN "linkPdf" DROP NOT NULL,
ALTER COLUMN "linkVideo" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Curso" ADD COLUMN     "linkApostila" TEXT;
