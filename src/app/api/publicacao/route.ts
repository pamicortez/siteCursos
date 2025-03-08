import { NextResponse } from 'next/server';
import prisma from '@/lib/prismaClient';
import { Prisma } from '@prisma/client';

// Método para criar um novo publicacao. É preciso ter um usuário
export async function POST(request: Request) {
	try {
	  const data: Prisma.PublicacaoCreateInput = await request.json(); // Pega os dados do corpo da requisição
	  
	  const { idUsuario } = data;

	  // Verifica se o usuário existe
	  const usuario = await prisma.usuario.findUnique({ where: { id: idUsuario } });
	  if (!usuario) {
		return NextResponse.json({error: 'Usuário não encontrado'}, {status: 404})
	  }

	  const novopublicacao = await prisma.publicacao.create({
		data,
	  });

	  return NextResponse.json(novopublicacao, { status: 201 }); // Retorna o novo publicacao com status 201
	} catch (error) {
	  if (error instanceof Prisma.PrismaClientValidationError){
		return NextResponse.json({error: 'Tipos dos dados incorretos'}, {status: 400})
	  } 
	  console.error('Erro ao criar o publicacao:', error);
	  return NextResponse.error(); // Retorna um erro em caso de falha
	}
  }