import { NextResponse } from 'next/server';
import prisma from '@/lib/prismaClient';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
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
    const projetosFormatados = projetos.map(projetoUsuario => ({
      ...projetoUsuario.projeto,
      funcaoUsuario: projetoUsuario.funcao,
      isOwner: projetoUsuario.funcao === 'Coordenador'
    }));

    return NextResponse.json(projetosFormatados);

  } catch (error) {
    console.error('Erro ao buscar projetos do usuário:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}