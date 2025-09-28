import { NextResponse } from 'next/server';
import { funcaoProjeto } from '@prisma/client';

export const dynamic = "force-dynamic";


export async function GET(request: Request) {
  try {
    return NextResponse.json(Object.values(funcaoProjeto));
  } catch (error) {
    console.error('Erro ao buscar as funções para projetos:', error);
    return new NextResponse('Erro interno no servidor', { status: 500 });
  }
}
