import { NextResponse } from 'next/server';
import prisma from '@/lib/prismaClient';
import { Prisma } from '@prisma/client';


// Método GET para retornar todos os usuários
export async function GET(request: Request) {

    try {
        // ====== Obtem todos os usuários ======
        const usuarios = await prisma.usuario.findMany({});
        // Adicionando apenas as formações acadêmicas que são diferentes na lista de response
        const formacoesAcademicas = [...new Set(usuarios.map(usuario => usuario.formacaoAcademica))];

        return NextResponse.json(formacoesAcademicas); // Retorna a resposta em formato JSON
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
      return NextResponse.error(); // Retorna um erro em caso de falha
    }
  }