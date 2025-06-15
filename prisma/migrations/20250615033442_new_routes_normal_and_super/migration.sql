/*
  Warnings:

  - The values [LinguagensLetrasEComunicacao,ArtesECultura,CienciasAgrarias,PesquisaEInovacao,ServicosSociasEComunitarios,GestaoEPlanejamento,CienciasSociaisAplicadasANegocios,ComunicacaoEInformacao,CienciasBiologicasENaturais,EngenhariaEProducao,TecnologiaEComputacao,ProducaoEConstrucao,SaudeEBemEstar,EducacaoEFormacaoDeProfessores,NegociosAdministracaoEDireito,CienciasExatas,CienciasHumanas,MeioAmbienteESustentabilidade] on the enum `categoriaCurso` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "categoriaCurso_new" AS ENUM ('Artes e Cultura', 'Ciências Agrárias', 'Ciências Biológicas e Naturais', 'Ciências Exatas', 'Ciências Humanas', 'Ciências Sociais Aplicadas a Negócios', 'Comunicação e Informação', 'Educação e Formação de Professores', 'Engenharia e Produção', 'Gestão e Planejamento', 'Linguagens, Letras e Comunicação', 'Meio Ambiente e Sustentabilidade', 'Negócios, Administração e Direito', 'Pesquisa e Inovação', 'Produção e Construção', 'Saúde e Bem-Estar', 'Serviços Sociais e Comunitários', 'Tecnologia e Computação');
ALTER TABLE "Curso" ALTER COLUMN "categoria" TYPE "categoriaCurso_new" USING ("categoria"::text::"categoriaCurso_new");
ALTER TYPE "categoriaCurso" RENAME TO "categoriaCurso_old";
ALTER TYPE "categoriaCurso_new" RENAME TO "categoriaCurso";
DROP TYPE "categoriaCurso_old";
COMMIT;
