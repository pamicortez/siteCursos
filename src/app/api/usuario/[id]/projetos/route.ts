import { NextResponse } from 'next/server';
import prisma from '@/lib/prismaClient';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const userId = Number(params.id);
    
    if (isNaN(userId)) {
      return NextResponse.json({ error: 'ID inválido' }, { status: 400 });
    }

    // Busca projetos do usuário através da tabela de relacionamento
    const projetosUsuario = await prisma.projetoUsuario.findMany({
      where: { 
        idUsuario: userId,
        deletedAt: null 
      },
      include: {
        projeto: {
          include: {
            projetoUsuario: { include: { usuario: true } },
            curso: true,
            projetoColaborador: { include: { colaborador: true } },
          }
        }
      }
    });

    // Extrai apenas os projetos
    const projetos = projetosUsuario.map(pu => pu.projeto);

    return NextResponse.json(projetos);
  } catch (error) {
    console.error('Erro ao buscar projetos do usuário:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' }, 
      { status: 500 }
    );
  }
}