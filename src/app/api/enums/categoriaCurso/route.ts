import { NextResponse } from 'next/server';
import { categoriaCurso } from '@prisma/client';

// Mapeamento dos valores do enum para os formatos desejados
const categoriaFormatada: Record<categoriaCurso, string> = {
  ArtesECultura: "Artes e Cultura",
  CienciasAgrarias: "Ciências Agrárias",
  CienciasBiologicasENaturais: "Ciências Biológicas e Naturais",
  CienciasExatas: "Ciências Exatas",
  CienciasHumanas: "Ciências Humanas",
  CienciasSociaisAplicadasANegocios: "Ciências Sociais Aplicadas a Negócios",
  ComunicacaoEInformacao: "Comunicação e Informação",
  EducacaoEFormacaoDeProfessores: "Educação e Formação de Professores",
  EngenhariaEProducao: "Engenharia e Produção",
  GestaoEPlanejamento: "Gestão e Planejamento",
  LinguagensLetrasEComunicacao: "Linguagens, Letras e Comunicação",
  MeioAmbienteESustentabilidade: "Meio Ambiente e Sustentabilidade",
  NegociosAdministracaoEDireito: "Negócios, Administração e Direito",
  PesquisaEInovacao: "Pesquisa e Inovação",
  ProducaoEConstrucao: "Produção e Construção",
  SaudeEBemEstar: "Saúde e Bem-Estar",
  ServicosSociasEComunitarios: "Serviços Sociais e Comunitários",
  TecnologiaEComputacao: "Tecnologia e Computação"
};

export async function GET(request: Request) {
  try {
    // Obter os valores do enum
    const categorias = Object.values(categoriaCurso);
    
    // Mapear para o objeto com 'value' e 'label'
    const categoriasParaJson = categorias.map(cat => ({
      value: cat, // Valor para usar em links (ex: /cursos/ArtesECultura)
      label: categoriaFormatada[cat] // Texto para exibir na tela
    }));
    
    return NextResponse.json(categoriasParaJson);
  } catch (error) {
    console.error('Erro ao buscar categorias de Curso:', error);
    return new NextResponse('Erro interno no servidor', { status: 500 });
  }
}