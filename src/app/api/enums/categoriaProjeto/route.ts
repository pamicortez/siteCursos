import { NextResponse } from 'next/server';
import { categoriaProjeto } from '@prisma/client';

export async function GET(request: Request) {
  try {
    return NextResponse.json(Object.values(categoriaProjeto));
  } catch (error) {
    console.error('Erro ao buscar categorias de projetos:', error);
    return new NextResponse('Erro interno no servidor', { status: 500 });
  }
}
