import { NextResponse } from 'next/server';
import prisma from '@/lib/prismaClient';
import { Prisma } from '@prisma/client';

// Método GET para retornar todos os aulas
export async function GET(request: Request) {
	const { searchParams } = new URL(request.url);
	const titulo = searchParams.get('titulo');
	//const categoria = searchParams.get('categoria');
	try {
		// === Buscando aulas com título ===
		if (titulo) {
			console.log('Buscando aulas com título:', titulo);
			// Buscar aulas que tenham o título especificado
			const aulas = await prisma.aula.findMany({
				where: { titulo },
			});
		
			return NextResponse.json(aulas);
		}
		// === Buscando aulas pelo curso ===
		else if (false) {

		}
		// === Buscando todos os aulas === 
		else {
			console.log('Buscando todos os aulas'); 
			// Retorna todos os aulas se não houver título na URL
			const aulas = await prisma.aula.findMany();
			return NextResponse.json(aulas);
		}
	  } catch (error) {
		console.error('Erro ao buscar aulas:', error);
		return new NextResponse('Erro interno', { status: 500 });
	  }
}


// Método Delete para deletar aula com base no id
export async function DELETE(request: Request) {
	const { searchParams } = new URL(request.url);
	const id = searchParams.get('id');
	try {
		if (id) {
			console.log('Deletando aula com id:', id);
			// Deletar aula com base no id
			const aula = await prisma.aula.delete({
				where: { id: Number(id) },
			});
			return NextResponse.json(aula);
		} else {
			console.log('aula não encontrado');
			return new NextResponse('aula não encontrado', { status: 404 });
		}
	} catch (error) {
		console.error('Erro ao deletar aula:', error);
		return new NextResponse('Erro interno', { status: 500 });
	}
}

// Método para criar uma nova Aula. É preciso ter um Curso
export async function POST(request: Request) {
	try {
		const data: Prisma.AulaCreateInput = await request.json(); // Pega os dados do corpo da requisição

		const {idCurso} = data;

		// Verifica se o curso existe
		const curso = await prisma.curso.findUnique({ where: { id: idCurso } });
		if (!curso) {
			return NextResponse.json({error: 'Curso não encontrado'}, {status: 404})
		}

		const novaAula = await prisma.aula.create({
			data, // Dados da aula que será criada
		});

		return NextResponse.json(novaAula, { status: 201 }); // Retorna a nova aula com status 201
	} catch (error ) {
		if (error instanceof Prisma.PrismaClientValidationError){
			return NextResponse.json({error: 'Tipos dos dados incorretos'}, {status: 400})
		} 

		console.error('Erro ao criar a Aula:', error);
		return NextResponse.error(); // Retorna um erro em caso de falha
	}
  }