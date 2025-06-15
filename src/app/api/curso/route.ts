import { NextResponse } from 'next/server';
import prisma from '@/lib/prismaClient';
import { Prisma } from '@prisma/client';
import { connect } from 'http2';


// Método GET para retornar todos os cursos
export async function GET(request: Request) {
	const { searchParams } = new URL(request.url);
	const titulo = searchParams.get('titulo');
	const categoria = searchParams.get('categoria');
	const idUsuario = searchParams.get('idUsuario'); // ID do usuário
	const idCurso = searchParams.get('id'); // ID do curso
	const ordem = searchParams.get('ordem');
	try {
		// === Buscando cursos com título ===
		if (titulo) {
			console.log('Buscando cursos com título:', titulo);
			// Buscar cursos que tenham o título especificado
			const cursos = await prisma.curso.findMany({
				where: { titulo: {contains: titulo, mode: 'insensitive',}, deletedAt: null,
					categoria: categoria? categoria : undefined // Se categoria não for passada, não filtra por categoria 
					, usuario: { tipo: { in: ['Super', 'Normal'] } } // Só obtem usuarios do tipo Super ou Normal
				},
				include: {
				projeto: true, // Inclui o projeto relacionado
				usuario: true, // Inclui o usuário que criou o curso
				aula: true, // Inclui as aulas relacionadas
				},
				orderBy: ordem==='recente' ? {createdAt: 'desc'}: {titulo: 'asc'}
			});
		
			return NextResponse.json(cursos);
		}
		// === Buscando cursos com idUsuario ===
		else if (idUsuario) {
			console.log('Buscando cursos com idUsuario:', idUsuario);
			// Buscar cursos que tenham o usuário especificado
			const cursos = await prisma.curso.findMany({
				where: { 
					idUsuario: Number(idUsuario)
					, deletedAt: null
				, usuario: { tipo: { in: ['Super', 'Normal'] } } // Só obtem usuarios do tipo Super ou Normal
				},
				include: {
				projeto: true, // Inclui o projeto relacionado
				usuario: true, // Inclui o usuário que criou o curso
				aula: true, // Inclui as aulas relacionadas
				},
				orderBy: ordem==='recente' ? {createdAt: 'desc'}: {titulo: 'asc'}
			});
			return NextResponse.json(cursos);
		}
		// === Buscando cursos com idCurso ===
		else if (idCurso){
			// Pega um curso específico pelo ID
			const curso = await prisma.curso.findUnique({
				where: {
				id: Number(idCurso), // Utiliza o ID do curso
				deletedAt: null
				, usuario: { tipo: { in: ['Super', 'Normal'] } } // Só obtem usuarios do tipo Super ou Normal
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
				where: { 
					categoria, titulo: titulo? {contains: titulo, mode: 'insensitive',} : undefined
					, deletedAt: null
					, usuario: { tipo: { in: ['Super', 'Normal'] } } // Só obtem usuarios do tipo Super ou Normal
				 }, // Se título não for passado, não filtra por título
				include: {
				projeto: true, // Inclui o projeto relacionado
				usuario: true, // Inclui o usuário que criou o curso
				aula: true, // Inclui as aulas relacionadas
				},
				orderBy: ordem==='recente' ? {createdAt: 'desc'}: {titulo: 'asc'}
			});
			return NextResponse.json(cursos);
		}
		// === Buscando todos os cursos === 
		else {
			const cursos = await prisma.curso.findMany({
				where: { 				 	
					categoria: categoria? categoria : undefined // Se categoria não for passada, não filtra por categoria 
					, deletedAt: null // Verifica se o curso não foi deletado
					, usuario: { tipo: { in: ['Super', 'Normal'] } } // Só obtem usuarios do tipo Super ou Normal
				}, // Verifica se o curso não foi deletado
				include: {
				  projeto: true, // Inclui o projeto relacionado
				  usuario: true, // Inclui o usuário que criou o curso
				  aula: true, // Inclui as aulas relacionadas
				},
				orderBy: ordem==='recente' ? {createdAt: 'desc'}: {titulo: 'asc'}
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
		const body = await request.json();

		const {idUsuario, idProjeto, aulas, ...data} = body;

		// Verifica se o usuário existe
		const usuario = await prisma.usuario.findUnique({ where: { id: idUsuario } });
		const projeto = await prisma.projeto.findUnique({ where: { id: idProjeto } })
		if (!usuario) {
			return NextResponse.json({error: 'Usuário não encontrado'}, {status: 404})
		} else if (!projeto){
			return NextResponse.json({error: 'Projeto não encontrado'}, {status: 404})
		}
		console.log(body)

		const novoCurso = await prisma.curso.create({
			data:{
				...data,
				usuario: {
					connect: {id: idUsuario}
				},
				projeto: {
					connect: {id: idProjeto}
				},
                aula: aulas ? {
                    create: aulas.map((aula: { titulo: string, linkPdf: string, linkVideo: string, linkPodcast: string }) => ({ 
						titulo: aula.titulo, 
						linkPdf: aula.linkPdf, 
						linkVideo: aula.linkVideo,
						linkPodcast: aula.linkPodcast
					}))
                } : undefined,
            },
            include: { aula: true },
		});


		const cursoUsuario = await prisma.cursoUsuario.create({
			data:{
				usuario: {connect: {id: idUsuario}},
				curso: {connect: {id: novoCurso.id}}
			}
		})
		return NextResponse.json(novoCurso, { status: 201 }); // Retorna o novo Curso com status 201
	} catch (error ) {
		if (error instanceof Prisma.PrismaClientValidationError){
			return NextResponse.json({error: error.message}, {status: 400})
		} 

		console.error('Erro ao criar o Curso:', error);
		return NextResponse.error(); // Retorna um erro em caso de falha
	}
  }

 /*    // Método para atualização dos atributos do curso
export async function PATCH(request: Request) {
		try {
		  	const { searchParams } = new URL(request.url);
		  	const id = Number(searchParams.get('id')); // ID do curso
	
		 	const { atualizacoes } = await request.json();
	  
			// Verifica se o curso existe
			const curso = await prisma.curso.findUnique({ where: { id: id } });
			if (!curso) {
				return NextResponse.json({error: 'Curso não encontrado'}, {status: 404})
			}
		  // Atributos que NÃO podem ser alterados
			const atributosFixos = ["id", "idProjeto", "idUsuario"];
		
			// Verifica se há algum campo proibido na requisição
			const camposInvalidos = Object.keys(atualizacoes).filter((chave) =>
				atributosFixos.includes(chave)
				);
		
			if (camposInvalidos.length > 0) {
				return NextResponse.json(
					{ error: `Campos não permitidos: ${camposInvalidos.join(", ")}` },
					{ status: 400 }
				);
				}
				
			const cursoAtualizado = await prisma.curso.update({
				where: { id },
				data: atualizacoes,
			});
		
			return NextResponse.json(cursoAtualizado, { status: 200 });
	  
		} catch (error) {
		  console.error(error);
		  return NextResponse.json({ error: "Erro ao atualizar curso" }, { status: 500 });
		}
	  } */

export async function PATCH(request: Request) {
	const { searchParams } = new URL(request.url);
	const idCurso = Number(searchParams.get("id"));
	if (isNaN(idCurso)) {
		return NextResponse.json({ error: "ID do curso inválido" }, { status: 400 });
	}
	const curso = await prisma.curso.findUnique({ where: { id: idCurso } });
	if (!curso) {
		return NextResponse.json({error: 'Curso não encontrado'}, {status: 404})
	}

	const body = await request.json();
	const { aulas, ...dadosCurso } = body;


	const atributosFixos = ["id", "idProjeto", "idUsuario"];
	

	const camposInvalidos = Object.keys(dadosCurso).filter((chave) =>
		  atributosFixos.includes(chave)
		  );
  
	if (camposInvalidos.length > 0) {
		  return NextResponse.json(
			  { error: `Campos não permitidos: ${camposInvalidos.join(", ")}` },
			  { status: 400 }
		  );
	  }

		await prisma.curso.update({
		  where: { id: idCurso },
		  data: dadosCurso,
		});
		
		if (aulas){
		const aulasAtuais = await prisma.aula.findMany({
		  where: { idCurso },
		});
	  
		const idsRecebidos = (aulas as any[]).filter((a) => a.id).map((a) => a.id);
		const idsAtuais = aulasAtuais.map((a) => a.id);
	  
		const idsParaRemover = idsAtuais.filter((id) => !idsRecebidos.includes(id));
		await prisma.aula.deleteMany({
		  where: {
			id: { in: idsParaRemover },
		  },
		});
	  

			for (const aula of aulas) {
				if (aula.id) {
				  
				  let tempAula = await prisma.aula.findUnique({where: {id: aula.id}})
	  
				  if (tempAula){
					  await prisma.aula.update({
						  where: { id: aula.id },
						  data: {
							titulo: aula.titulo,
							linkPdf: aula.linkPdf,
							linkVideo: aula.linkVideo,
							linkPodcast: aula.linkPodcast,
						  },
						});
				  } else{
					  return NextResponse.json({ error: "Aula não existente!" }, { status: 400 });
				  }
	  
				} else {
				  // Criar nova aula
				  await prisma.aula.create({
					data: {
					  titulo: aula.titulo,
					  linkPdf: aula.linkPdf,
					  linkVideo: aula.linkVideo,
					  linkPodcast: aula.linkPodcast,
					  idCurso: idCurso,
					},
				  });
				}
			  }

		}
		
	  
		const cursoAtualizado = await prisma.curso.findUnique({
		  where: { id: idCurso },
		  include: { aula: true },
		});
	  
		return NextResponse.json(cursoAtualizado);
	  }