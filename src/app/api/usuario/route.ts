import { NextResponse } from 'next/server';
import prisma from '@/lib/prismaClient';
import { Prisma } from '@prisma/client';

// Método GET para retornar todos os usuários
export async function GET() {
  try {
    const usuarios = await prisma.usuario.findMany(); // Busca todos os usuários no banco
    return NextResponse.json(usuarios); // Retorna a resposta em formato JSON
  } catch (error) {
    console.error('Erro ao buscar usuários:', error);
    return NextResponse.error(); // Retorna um erro em caso de falha
  }
}

// Método POST para criar um novo usuário
export async function POST(request: Request) {
  try {
    const data: Prisma.UsuarioCreateInput = await request.json(); // Pega os dados do corpo da requisição
    const novoUsuario = await prisma.usuario.create({
      data, // Dados do usuário a serem criados
    });
    return NextResponse.json(novoUsuario, { status: 201 }); // Retorna o novo usuário com status 201
  } catch (error) {
    console.error('Erro ao criar usuário:', error);
    return NextResponse.error(); // Retorna um erro em caso de falha
  }
}
