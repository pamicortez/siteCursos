import { NextResponse } from 'next/server';
import prisma from '@/lib/prismaClient';
import { Prisma } from '@prisma/client';

export const dynamic = "force-dynamic";


export async function GET(request: Request) {

    try {
        const usuarios = await prisma.usuario.findMany({});
        const formacoesAcademicas = [...new Set(usuarios.map(usuario => usuario.formacaoAcademica))];
        return NextResponse.json(formacoesAcademicas); // Retorna a resposta em formato JSON
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
      return NextResponse.error(); // Retorna um erro em caso de falha
    }
  }