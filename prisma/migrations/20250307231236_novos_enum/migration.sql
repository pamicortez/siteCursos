-- CreateEnum
CREATE TYPE "tipoLink" AS ENUM ('Instragram', 'Whatsapp', 'Linkedin', 'Facebook', 'Genérico');

-- CreateEnum
CREATE TYPE "funcaoProjeto" AS ENUM ('Coordenador', 'Colaborador', 'Bolsista', 'Voluntário');

-- AlterTable
ALTER TABLE "Link" ADD COLUMN     "tipo" "tipoLink" NOT NULL DEFAULT 'Genérico';

-- AlterTable
ALTER TABLE "Usuario" ALTER COLUMN "Titulacao" SET DEFAULT 'Bacharel';

-- AlterTable
ALTER TABLE "eventoUsuario" ALTER COLUMN "tipoParticipacao" SET DEFAULT 'Ouvinte';

-- AlterTable
ALTER TABLE "projetoUsuario" ADD COLUMN     "funcao" "funcaoProjeto" NOT NULL DEFAULT 'Colaborador';
