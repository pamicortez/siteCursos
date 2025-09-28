import { NextResponse } from 'next/server';
import { tipoLink } from '@prisma/client';

export const dynamic = "force-dynamic";



export async function GET(request: Request) {
  try {
    return NextResponse.json(Object.values(tipoLink));
  } catch (error) {
    console.error('Erro ao buscar tipos de links:', error);
    return new NextResponse('Erro interno no servidor', { status: 500 });
  }
}
