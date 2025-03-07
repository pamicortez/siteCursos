import { NextResponse } from 'next/server';
import prisma from '@/lib/prismaClient';
import { Prisma } from '@prisma/client';


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

// Método para criar um novo Curso. É preciso ter um Projeto e um Usuário
export async function POST(request: Request) {
	try {
		const data: Prisma.CursoCreateInput = await request.json(); // Pega os dados do corpo da requisição

		const {idUsuario, idProjeto} = data;

		// Verifica se o usuário existe
		const usuario = await prisma.usuario.findUnique({ where: { id: idUsuario } });
		const projeto = await prisma.projeto.findUnique({ where: { id: idProjeto } })
		if (!usuario) {
			return NextResponse.json({error: 'Usuário não encontrado'}, {status: 400})
		} else if (!projeto){
			return NextResponse.json({error: 'Projeto não encontrado'}, {status: 400})
		}

		const novoCurso = await prisma.curso.create({
			data, // Dados do Curso que será criado
		});
		return NextResponse.json(novoCurso, { status: 201 }); // Retorna o novo Curso com status 201
	} catch (error ) {
		if (error instanceof Prisma.PrismaClientValidationError){
			return NextResponse.json({error: 'Tipos dos dados incorretos'}, {status: 400})
		} 

		console.error('Erro ao criar o Curso:', error);
		return NextResponse.error(); // Retorna um erro em caso de falha
	}
  }