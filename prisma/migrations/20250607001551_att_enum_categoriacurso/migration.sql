/*
  Warnings:

  - Changed the type of `categoria` on the `Curso` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "categoriaCurso" AS ENUM ('LinguagensLetrasEComunicacao', 'ArtesECultura', 'CienciasAgrarias', 'PesquisaEInovacao', 'ServicosSociasEComunitarios', 'GestaoEPlanejamento', 'CienciasSociaisAplicadasANegocios', 'ComunicacaoEInformacao', 'CienciasBiologicasENaturais', 'EngenhariaEProducao', 'TecnologiaEComputacao', 'ProducaoEConstrucao', 'SaudeEBemEstar', 'EducacaoEFormacaoDeProfessores', 'NegociosAdministracaoEDireito', 'CienciasExatas', 'CienciasHumanas', 'MeioAmbienteESustentabilidade');

-- AlterTable
ALTER TABLE "Curso" DROP COLUMN "categoria",
ADD COLUMN     "categoria" "categoriaCurso" NOT NULL;
