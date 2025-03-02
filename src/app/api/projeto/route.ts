import { NextResponse } from 'next/server';
import prisma from '@/lib/prismaClient';
import { Prisma } from '@prisma/client';

// Método GET para retornar todos os projetos
export async function GET(request: Request) {
	const { searchParams } = new URL(request.url);
	const titulo = searchParams.get('titulo');
	try {
		// === Buscando projetos com título ===
		if (titulo) {
			console.log('Buscando projetos com título:', titulo);// http://localhost:3000/api/projeto?titulo=Projeto%20AI
			// Buscar projetos que tenham o título especificado
			const projetos = await prisma.projeto.findMany({
				where: { titulo },
			});
		
			return NextResponse.json(projetos);
		
		// === Buscando todos os projetos ===
		} else {
			console.log('Buscando todos os projetos'); // http://localhost:3000/api/projeto
			// Retorna todos os projetos se não houver título na URL
			const projetos = await prisma.projeto.findMany();
			return NextResponse.json(projetos);
		}
	  } catch (error) {
		console.error('Erro ao buscar projetos:', error);
		return new NextResponse('Erro interno', { status: 500 });
	  }
}


// Método Delete para deletar projeto com base no id
export async function DELETE(request: Request) {
	const { searchParams } = new URL(request.url);
	const id = searchParams.get('id');
	try {
		if (id) {
			console.log('Deletando projeto com id:', id);
			// Deletar projeto com base no id
			const projeto = await prisma.projeto.delete({
				where: { id: Number(id) },
			});
			return NextResponse.json(projeto);
		} else {
			console.log('Projeto não encontrado');
			return new NextResponse('Projeto não encontrado', { status: 404 });
		}
	} catch (error) {
		console.error('Erro ao deletar projeto:', error);
		return new NextResponse('Erro interno', { status: 500 });
	}
}