import { NextResponse } from 'next/server';
import prisma from '@/lib/prismaClient';

export const dynamic = "force-dynamic";


const categoriaFormatada: Record<string, string> = {
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

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Aguardar os parâmetros antes de usar
    const resolvedParams = await params;
    const userId = Number(resolvedParams.id);

    if (isNaN(userId)) {
      return NextResponse.json({ error: 'ID inválido' }, { status: 400 });
    }

    // Buscar projetos do usuário
    const projetos = await prisma.projetoUsuario.findMany({
      where: {
        idUsuario: userId,
        deletedAt: null, // Apenas projetos não deletados
      },
      include: {
        projeto: {
          include: {
            projetoUsuario: {
              include: {
                usuario: true
              }
            },
            curso: true,
            projetoColaborador: {
              include: {
                colaborador: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Transformar os dados para retornar apenas os projetos com informações do usuário
    const projetosFormatados = projetos.map(projetoUsuario => {
      const projeto = projetoUsuario.projeto;
      return {
        ...projeto,
        categoriaFormatada: categoriaFormatada[projeto.categoria] || projeto.categoria, // Adiciona a categoria formatada
        funcaoUsuario: projetoUsuario.funcao,
        isOwner: projetoUsuario.funcao === 'Coordenador'
      };
    });

    return NextResponse.json(projetosFormatados);

  } catch (error) {
    console.error('Erro ao buscar projetos do usuário:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}