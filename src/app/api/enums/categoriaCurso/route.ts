import { NextResponse } from 'next/server';
import { categoriaCurso } from '@prisma/client';

// Método GET para retornar todas as categorias de curso
export async function GET(request: Request) {
  try {
    return NextResponse.json(Object.values(categoriaCurso));
  } catch (error) {
    console.error('Erro ao buscar as categorias de cursos:', error);
    return new NextResponse('Erro interno no servidor', { status: 500 });
  }
}