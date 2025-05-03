import { NextResponse } from 'next/server';
import prisma from '@/lib/prismaClient';
import { Prisma } from '@prisma/client';

// Método para criar uma nova carreira.
export async function POST(request: Request) {
	try {

		const body = await request.json();
		
		const {idUsuario, ...dados} = body;

		const usuario = await prisma.usuario.findUnique({ where: { id: idUsuario } });
		if (!usuario) {
			return NextResponse.json({error: 'Usuario não encontrado'}, {status: 404})
		}
		
		const novaCarreira = await prisma.carreira.create({
			data: {
				...dados,
				usuario: {
					connect: {id: idUsuario}
				}
			}
		});

		return NextResponse.json(novaCarreira, { status: 201 }); // Retorna a nova carreira com status 201
	} catch (error ) {
		if (error instanceof Prisma.PrismaClientValidationError){
            console.error('Erro ao criar a carreira:', error);
			return NextResponse.json({error: 'Tipos dos dados incorretos'}, {status: 400})
		} 

		console.error('Erro ao criar a carreira:', error);
		return NextResponse.error(); // Retorna um erro em caso de falha
	}
  }