import { NextResponse } from 'next/server';
import prisma from '@/lib/prismaClient';


/*
- Se chegar aqui, significa que a solicitação já deve ter sido validada e o token de acesso deve ter sido verificado. Portanto, não é necessário verificar o token de acesso novamente.
- Deve-se criar objetos dto para resposta ao usuário?
- Quais outros  tipos de filtros deve ter para a busca de projetos?
*/

// Método GET para retornar todos os projetos
export async function GET(request: Request) {
	const { searchParams } = new URL(request.url);
	const titulo = searchParams.get('titulo');
	const categoria = searchParams.get('categoria');
	try {
		// === Buscando projetos com título ===
		if (titulo) {
			console.log('Buscando projetos com título:', titulo);// http://localhost:3000/api/projeto?titulo=Projeto%20AI
			// Buscar projetos que tenham o título especificado
			const projetos = await prisma.projeto.findMany({
				where: { titulo },
			});
		
			return NextResponse.json(projetos);
		}
		// === Buscando projetos com categoria ===
		else if (categoria) {
			console.log('Buscando projetos com categoria:', categoria); // http://localhost:3000/api/projeto?categoria=IA
			// Buscar projetos que tenham a categoria especificada
			const projetos = await prisma.projeto.findMany({
				where: { categoria },
			});
			return NextResponse.json(projetos);
		}
		// === Buscando todos os projetos === 
		else {
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