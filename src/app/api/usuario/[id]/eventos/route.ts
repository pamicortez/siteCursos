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
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Extrai os eventos com informações adicionais do usuário
    const eventosFormatados = eventosUsuario.map(eventoUsuario => ({
      ...eventoUsuario.evento,
      tipoParticipacao: eventoUsuario.tipoParticipacao,
      isOwner: eventoUsuario.tipoParticipacao === 'Organizador',
      // Adiciona as imagens como array de URLs para compatibilidade com o CardEvento
      imagens: eventoUsuario.evento.imagemEvento.map(img => img.link)
    }));

    return NextResponse.json(eventosFormatados);
  } catch (error) {
    console.error('Erro ao buscar eventos do usuário:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' }, 
      { status: 500 }
    );
  }
}