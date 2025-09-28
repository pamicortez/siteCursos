import { NextResponse } from 'next/server';
import { colaboradorCategoria } from '@prisma/client';

export const dynamic = "force-dynamic";


// Método GET para retornar todas as categorias únicas de colaboradores
export async function GET(request: Request) {
  try {

    // return NextResponse.json(categoriasUnicas);
    return NextResponse.json(Object.values(colaboradorCategoria));
  } catch (error) {
    console.error('Erro ao buscar categorias de colaboradores:', error);
    return new NextResponse('Erro interno no servidor', { status: 500 });
  }
}
