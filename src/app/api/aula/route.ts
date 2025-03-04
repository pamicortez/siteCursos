import { NextResponse } from 'next/server';
import prisma from '@/lib/prismaClient';


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