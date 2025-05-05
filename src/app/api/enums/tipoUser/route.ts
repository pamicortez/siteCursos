import { NextResponse } from 'next/server';
import { tipoUser } from '@prisma/client';

export async function GET(request: Request) {
  try {
    return NextResponse.json(Object.values(tipoUser));
  } catch (error) {
    console.error('Erro ao buscar tipos de usuarios:', error);
    return new NextResponse('Erro interno no servidor', { status: 500 });
  }
}
