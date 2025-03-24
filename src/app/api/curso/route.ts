import { NextResponse } from 'next/server';
import prisma from '@/lib/prismaClient';
import { Prisma } from '@prisma/client';


// Método GET para retornar todos os cursos
export async function GET(request: Request) {
	const { searchParams } = new URL(request.url);
	const titulo = searchParams.get('titulo');
	const categoria = searchParams.get('categoria');
	const idUsuario = searchParams.get('idUsuario'); // ID do usuário
	const idCurso = searchParams.get('id'); // ID do curso
	try {
		// === Buscando cursos com título ===
		if (titulo) {
			console.log('Buscando cursos com título:', titulo);
			// Buscar cursos que tenham o título especificado
			const cursos = await prisma.curso.findMany({
				where: { titulo },
				include: {
				projeto: true, // Inclui o projeto relacionado
				usuario: true, // Inclui o usuário que criou o curso
				aula: true, // Inclui as aulas relacionadas
				},
			});
		
			return NextResponse.json(cursos);
		}
		// === Buscando cursos com idUsuario ===
		else if (idUsuario) {
			console.log('Buscando cursos com idUsuario:', idUsuario);
			// Buscar cursos que tenham o usuário especificado
			const cursos = await prisma.curso.findMany({
				where: { idUsuario: Number(idUsuario) },
				include: {
				projeto: true, // Inclui o projeto relacionado
				usuario: true, // Inclui o usuário que criou o curso
				aula: true, // Inclui as aulas relacionadas
				},
			});
			return NextResponse.json(cursos);
		}
		// === Buscando cursos com idCurso ===
		else if (idCurso){
			// Pega um curso específico pelo ID
			const curso = await prisma.curso.findUnique({
				where: {
				id: Number(idCurso), // Utiliza o ID do curso
				},
				include: {
				projeto: true, // Inclui o projeto relacionado
				usuario: true, // Inclui o usuário que criou o curso
				aula: true, // Inclui as aulas relacionadas
				},
			});
			return NextResponse.json(curso);
		}
		// === Buscando cursos com categoria ===
		else if (categoria) {
			console.log('Buscando cursos com categoria:', categoria);
			// Buscar cursos que tenham a categoria especificada
			const cursos = await prisma.curso.findMany({
				where: { categoria },
				include: {
				projeto: true, // Inclui o projeto relacionado
				usuario: true, // Inclui o usuário que criou o curso
				aula: true, // Inclui as aulas relacionadas
				},
			});
			return NextResponse.json(cursos);
		}
		// === Buscando todos os cursos === 
		else {
			const cursos = await prisma.curso.findMany({
				include: {
				  projeto: true, // Inclui o projeto relacionado
				  usuario: true, // Inclui o usuário que criou o curso
				  aula: true, // Inclui as aulas relacionadas
				},
			  });
			  return NextResponse.json(cursos); // Retorna todos os cursos
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
			return NextResponse.json({error: 'Usuário não encontrado'}, {status: 404})
		} else if (!projeto){
			return NextResponse.json({error: 'Projeto não encontrado'}, {status: 404})
		}

		const novoCurso = await prisma.curso.create({
			data, // Dados do Curso que será criado
		});

		const cursoUsuario = await prisma.cursoUsuario.create({
			data:{
				idUsuario: idUsuario,
				idCurso: novoCurso.id
			}
		})
		return NextResponse.json(novoCurso, { status: 201 }); // Retorna o novo Curso com status 201
	} catch (error ) {
		if (error instanceof Prisma.PrismaClientValidationError){
			return NextResponse.json({error: 'Tipos dos dados incorretos'}, {status: 400})
		} 

		console.error('Erro ao criar o Curso:', error);
		return NextResponse.error(); // Retorna um erro em caso de falha
	}
  }

  // Método para atualização de um atributo do curso
export async function PATCH(request: Request) {
	try {
	  const { id, atributo, novoValor } = await request.json();
  
	  // Certificar que todos os dados foram passados
	  if (!id || !atributo || novoValor === undefined) {
		return NextResponse.json({ error: "Todos os campos são obrigatórios" }, { status: 400 });
	  }
  
	  // Verifica se o curso existe
		const curso = await prisma.curso.findUnique({ where: { id: id } });
		if (!curso) {
			return NextResponse.json({error: 'Curso não encontrado'}, {status: 404})
		}
	  // Atributos que NÃO podem ser alterados
	  const atributosFixos = ["id", "idProjeto", "idUsuario"];
	  
	  if (atributosFixos.includes(atributo)) {
		return NextResponse.json({ error: "Atributo não pode ser atualizaddo" }, { status: 400 });
	  }
  
	  let valorAtualizado = novoValor;
  
	  const cursoAtualizado = await prisma.curso.update({
		where: { id },
		data: { [atributo]: valorAtualizado },
	  });
  
	  return NextResponse.json(cursoAtualizado, { status: 200 });
  
	} catch (error) {
	  console.error(error);
	  return NextResponse.json({ error: "Erro ao atualizar curso" }, { status: 500 });
	}
  }