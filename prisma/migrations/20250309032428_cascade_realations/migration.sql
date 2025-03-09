-- DropForeignKey
ALTER TABLE "Aula" DROP CONSTRAINT "Aula_idCurso_fkey";

-- DropForeignKey
ALTER TABLE "Link" DROP CONSTRAINT "Link_idUsuario_fkey";

-- DropForeignKey
ALTER TABLE "Publicacao" DROP CONSTRAINT "Publicacao_idUsuario_fkey";

-- DropForeignKey
ALTER TABLE "cursoUsuario" DROP CONSTRAINT "cursoUsuario_idCurso_fkey";

-- DropForeignKey
ALTER TABLE "cursoUsuario" DROP CONSTRAINT "cursoUsuario_idUsuario_fkey";

-- DropForeignKey
ALTER TABLE "eventoUsuario" DROP CONSTRAINT "eventoUsuario_idEvento_fkey";

-- DropForeignKey
ALTER TABLE "eventoUsuario" DROP CONSTRAINT "eventoUsuario_idUsuario_fkey";

-- DropForeignKey
ALTER TABLE "imagemEvento" DROP CONSTRAINT "imagemEvento_idEvento_fkey";

-- DropForeignKey
ALTER TABLE "projetoUsuario" DROP CONSTRAINT "projetoUsuario_idProjeto_fkey";

-- DropForeignKey
ALTER TABLE "projetoUsuario" DROP CONSTRAINT "projetoUsuario_idUsuario_fkey";

-- AddForeignKey
ALTER TABLE "Curso" ADD CONSTRAINT "Curso_idProjeto_fkey" FOREIGN KEY ("idProjeto") REFERENCES "Projeto"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Curso" ADD CONSTRAINT "Curso_idUsuario_fkey" FOREIGN KEY ("idUsuario") REFERENCES "Usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Aula" ADD CONSTRAINT "Aula_idCurso_fkey" FOREIGN KEY ("idCurso") REFERENCES "Curso"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Link" ADD CONSTRAINT "Link_idUsuario_fkey" FOREIGN KEY ("idUsuario") REFERENCES "Usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Publicacao" ADD CONSTRAINT "Publicacao_idUsuario_fkey" FOREIGN KEY ("idUsuario") REFERENCES "Usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "imagemEvento" ADD CONSTRAINT "imagemEvento_idEvento_fkey" FOREIGN KEY ("idEvento") REFERENCES "Evento"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "eventoUsuario" ADD CONSTRAINT "eventoUsuario_idUsuario_fkey" FOREIGN KEY ("idUsuario") REFERENCES "Usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "eventoUsuario" ADD CONSTRAINT "eventoUsuario_idEvento_fkey" FOREIGN KEY ("idEvento") REFERENCES "Evento"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cursoUsuario" ADD CONSTRAINT "cursoUsuario_idCurso_fkey" FOREIGN KEY ("idCurso") REFERENCES "Curso"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cursoUsuario" ADD CONSTRAINT "cursoUsuario_idUsuario_fkey" FOREIGN KEY ("idUsuario") REFERENCES "Usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "projetoUsuario" ADD CONSTRAINT "projetoUsuario_idProjeto_fkey" FOREIGN KEY ("idProjeto") REFERENCES "Projeto"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "projetoUsuario" ADD CONSTRAINT "projetoUsuario_idUsuario_fkey" FOREIGN KEY ("idUsuario") REFERENCES "Usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;
