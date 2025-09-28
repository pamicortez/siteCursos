import { NextResponse } from 'next/server';
import { Titulacao } from '@prisma/client';

export const dynamic = "force-dynamic";


export async function GET(request: Request) {
  try {
    return NextResponse.json(Object.values(Titulacao));
  } catch (error) {
    console.error('Erro ao buscar tipos de titulação:', error);
    return new NextResponse('Erro interno no servidor', { status: 500 });
  }
}
