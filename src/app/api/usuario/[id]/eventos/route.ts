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

    // Busca eventos do usuário através da tabela de relacionamento
    const eventosUsuario = await prisma.eventoUsuario.findMany({
      where: { 
        idUsuario: userId,
        deletedAt: null 
      },
      include: {
        evento: {
          include: {
            eventoUsuario: { include: { usuario: true } },
            imagemEvento: true,
          }
        }
      }
    });

    // Extrai apenas os eventos
    const eventos = eventosUsuario.map(eu => eu.evento);

    return NextResponse.json(eventos);
  } catch (error) {
    console.error('Erro ao buscar eventos do usuário:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' }, 
      { status: 500 }
    );
  }
}