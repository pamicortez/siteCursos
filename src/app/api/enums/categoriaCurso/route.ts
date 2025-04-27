import { NextResponse } from 'next/server';
import { categoriaCurso } from '@prisma/client';

export async function GET(request: Request) {
  try {
    return NextResponse.json(Object.values(categoriaCurso));
  } catch (error) {
    console.error('Erro ao buscar categorias de Curso:', error);
    return new NextResponse('Erro interno no servidor', { status: 500 });
  }
}
