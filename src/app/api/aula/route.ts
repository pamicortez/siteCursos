import { NextResponse } from 'next/server';
import prisma from '@/lib/prismaClient';
import { Prisma } from '@prisma/client';

export const dynamic = "force-dynamic";

// Método GET para retornar todos os aulas
export async function GET(request: Request) {
	const { searchParams } = new URL(request.url);
	const titulo = searchParams.get('titulo');
	const idCurso = searchParams.get('idCurso');
	const id = searchParams.get('id');// id aula
	const ordem = searchParams.get('ordem');
	//const categoria = searchParams.get('categoria');
	try {
		// === Buscando aulas com título ===
		if (titulo) {
			console.log('Buscando aulas com título:', titulo);
			// Buscar aulas que tenham o título especificado
			const aulas = await prisma.aula.findMany({
				where: { titulo:
					{
						contains: titulo, // nomeBusca é o parâmetro de entrada, pode ser uma string com parte do nome
						mode: 'insensitive',  // Ignora a diferença entre maiúsculas e minúsculas
					}
					, curso: {deletedAt: null, usuario: { tipo: { in: ['Super', 'Normal'] } }}
				 },
				include: {
					curso: true
				},
				orderBy: ordem==='recente' ? {createdAt: 'desc'}: {titulo: 'asc'}
			});
		
			return NextResponse.json(aulas);
		}
		// === Buscando aula especifica pelo id==
		else if (id) {
			console.log('Buscando aula com id:', id);
			// Buscar aula que tenha o id especificado
			const aula = await prisma.aula.findUnique({
				where: { 
					id: Number(id)
					, curso: {deletedAt: null, usuario: { tipo: { in: ['Super', 'Normal'] } }}
				 },
				include: {
					curso: true
				}
			});
		
			return NextResponse.json(aula);
		}
		// === Buscando aulas pelo curso ===
		else if (idCurso) {
			console.log('Buscando aulas com idCurso:', idCurso);
			// Buscar aulas que tenham o idCurso especificado
			const aulas = await prisma.aula.findMany({
				where: { 
					idCurso: Number(idCurso)
					, curso: {deletedAt: null, usuario: { tipo: { in: ['Super', 'Normal'] } }}
				 },
				include: {
					curso: true
				},
				orderBy: ordem==='recente' ? {createdAt: 'desc'}: {titulo: 'asc'}
			});
		
			return NextResponse.json(aulas);

		}
		// === Buscando todos os aulas === 
		else {
			console.log('Buscando todos os aulas'); 
			// Retorna todos os aulas se não houver título na URL
			const aulas = await prisma.aula.findMany({
				where: { curso: {deletedAt: null, usuario: { tipo: { in: ['Super', 'Normal'] } }}
						}, // Filtra aulas que pertencem a cursos não excluídos
				include: {
					curso: true
				},
				orderBy: ordem==='recente' ? {createdAt: 'desc'}: {titulo: 'asc'}
			});
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
  const idAula = searchParams.get('id'); // ID da aula a ser excluída

  if (!idAula) {
    return NextResponse.error();
  }

  try {
    // Excluindo a aula e todas as suas relações
    const aulaDeletada = await prisma.aula.delete({
      where: {
        id: Number(idAula), // Utiliza o ID da aula para exclusão
      }
    });

    return NextResponse.json(aulaDeletada); // Retorna a aula excluída
  } catch (error) {
    console.error('Erro ao excluir a aula:', error);
    return NextResponse.error(); // Retorna um erro em caso de falha
  }
}

// Método para criar uma nova Aula. É preciso ter um Curso
export async function POST(request: Request) {
	try {

		const body = await request.json();
		
		const {idCurso, ...dados} = body;

		const curso = await prisma.curso.findUnique({ where: { id: idCurso } });
		if (!curso) {
			return NextResponse.json({error: 'Curso não encontrado'}, {status: 404})
		}
		
		const novaAula = await prisma.aula.create({
			data: {
				...dados,
				curso: {
					connect: {id: idCurso}
				}
			}
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

// Método para atualização de um atributo da aula
export async function PATCH(request: Request) {
	try {
	  const { id, atributo, novoValor } = await request.json();
  
	  // Certificar que todos os dados foram passados
	  if (!id || !atributo || novoValor === undefined) {
		return NextResponse.json({ error: "Todos os campos são obrigatórios" }, { status: 400 });
	  }
  
	  // Verifica se a aula existe
		const aula = await prisma.aula.findUnique({ where: { id: id } });
		if (!aula) {
			return NextResponse.json({error: 'Aula não encontrada'}, {status: 404})
		}
	  // Atributos que NÃO podem ser alterados
	  const atributosFixos = ["id"];
	  
	  if (atributosFixos.includes(atributo)) {
		return NextResponse.json({ error: "Atributo não pode ser atualizaddo" }, { status: 400 });
	  }
  
	  let valorAtualizado = novoValor;
  
	  const aulaAtualizado = await prisma.aula.update({
		where: { id },
		data: { [atributo]: valorAtualizado },
	  });
  
	  return NextResponse.json(aulaAtualizado, { status: 200 });
  
	} catch (error) {
	  console.error(error);
	  return NextResponse.json({ error: "Erro ao atualizar aula" }, { status: 500 });
	}
  }