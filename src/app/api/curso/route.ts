import { NextResponse } from 'next/server';
import prisma from '@/lib/prismaClient';


// Método GET para retornar todos os cursos
export async function GET(request: Request) {
	const { searchParams } = new URL(request.url);
	const titulo = searchParams.get('titulo');
	const categoria = searchParams.get('categoria');
	try {
		// === Buscando cursos com título ===
		if (titulo) {
			console.log('Buscando cursos com título:', titulo);
			// Buscar cursos que tenham o título especificado
			const cursos = await prisma.curso.findMany({
				where: { titulo },
			});
		
			return NextResponse.json(cursos);
		}
		// === Buscando cursos com categoria ===
		else if (categoria) {
			console.log('Buscando cursos com categoria:', categoria);
			// Buscar cursos que tenham a categoria especificada
			const cursos = await prisma.curso.findMany({
				where: { categoria },
			});
			return NextResponse.json(cursos);
		}
		// === Buscando todos os cursos === 
		else {
			console.log('Buscando todos os cursos'); 
			// Retorna todos os cursos se não houver título na URL
			const cursos = await prisma.curso.findMany();
			return NextResponse.json(cursos);
		}
	  } catch (error) {
		console.error('Erro ao buscar cursos:', error);
		return new NextResponse('Erro interno', { status: 500 });
	  }
}


// Método Delete para deletar curso com base no id
export async function DELETE(request: Request) {
	const { searchParams } = new URL(request.url);
	const id = searchParams.get('id');
	try {
		if (id) {
			console.log('Deletando curso com id:', id);
			// Deletar curso com base no id
			const curso = await prisma.curso.delete({
				where: { id: Number(id) },
			});
			return NextResponse.json(curso);
		} else {
			console.log('curso não encontrado');
			return new NextResponse('curso não encontrado', { status: 404 });
		}
	} catch (error) {
		console.error('Erro ao deletar curso:', error);
		return new NextResponse('Erro interno', { status: 500 });
	}
}