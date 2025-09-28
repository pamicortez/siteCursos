import { NextResponse } from 'next/server';
import { categoriaCarreira } from '@prisma/client';

export const dynamic = "force-dynamic";


export async function GET(request: Request) {
  try {
    return NextResponse.json(Object.values(categoriaCarreira));
  } catch (error) {
    console.error('Erro ao buscar categorias de carreira:', error);
    return new NextResponse('Erro interno no servidor', { status: 500 });
  }
}
