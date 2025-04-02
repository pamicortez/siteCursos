-- CreateEnum
CREATE TYPE "tipoUser" AS ENUM ('Pendente', 'Normal', 'Super');

-- AlterTable
ALTER TABLE "Aula" ADD COLUMN     "deletedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Curso" ADD COLUMN     "deletedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Evento" ADD COLUMN     "deletedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Link" ADD COLUMN     "deletedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Projeto" ADD COLUMN     "deletedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Publicacao" ADD COLUMN     "deletedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Usuario" ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "tipo" "tipoUser" NOT NULL DEFAULT 'Pendente';

-- AlterTable
ALTER TABLE "cursoUsuario" ADD COLUMN     "deletedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "eventoUsuario" ADD COLUMN     "deletedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "imagemEvento" ADD COLUMN     "deletedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "projetoColaborador" ADD COLUMN     "deletedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "projetoUsuario" ADD COLUMN     "deletedAt" TIMESTAMP(3);
