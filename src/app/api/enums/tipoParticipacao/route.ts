import { NextResponse } from 'next/server';
import { tipoParticipacao } from '@prisma/client';

export async function GET(request: Request) {
  try {
    return NextResponse.json(Object.values(tipoParticipacao));
  } catch (error) {
    console.error('Erro ao buscar tipos de participação:', error);
    return new NextResponse('Erro interno no servidor', { status: 500 });
  }
}
