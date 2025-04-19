import { NextResponse } from 'next/server';
import prisma from '@/lib/prismaClient';
import { Prisma } from '@prisma/client';
import { PrismaClient, colaboradorCategoria } from '@prisma/client';

// Método GET para retornar todos os Colaboradores
export async function GET(request: Request) {
	const { searchParams } = new URL(request.url);
	const id = searchParams.get('id');
	const nome = searchParams.get('nome');
	const ordem = searchParams.get('ordem');
	const categoria = searchParams.get('categoria');
	const  categoriaEnum = categoria as colaboradorCategoria; // Conversão segura para o enum colaboradorCategoria

	try {
		if (id){
			// obtem um colaborador com base no id. Seleciona só os projetos de colaborador da categoria especifica
			const Colaborador = await prisma.colaborador.findUnique({
				where: { id: Number(id) },
				include: {
					// Se tiver recebido o param categoria, filtra os projetos de colaborador pela categoria. Se não tiver recebido, não filtra
					projetoColaborador: categoriaEnum ? { where: { categoria: categoriaEnum }, include:{projeto: true} } : {include:{projeto: true}}, 
				},
			});


			return NextResponse.json(Colaborador); // Retorna a resposta em formato JSON
		}
		else if (nome){
			const Colaborador = await prisma.colaborador.findMany({
				where: { nome: 
					{
					contains: nome, // nomeBusca é o parâmetro de entrada, pode ser uma string com parte do nome
					mode: 'insensitive',  // Ignora a diferença entre maiúsculas e minúsculas
					},
				},
				include: {
					projetoColaborador: categoriaEnum ? { where: { categoria: categoriaEnum }, include:{projeto: true} } : {include:{projeto: true}}, 
				},
				orderBy:{nome: 'asc'}
			});
			return NextResponse.json(Colaborador); // Retorna a resposta em formato JSON
		}
		else{
			// inclui os dados do projeto também e não só os ids
			const colaboradores = await prisma.colaborador.findMany({
				include: {
					projetoColaborador: categoriaEnum ? { where: { categoria: categoriaEnum }, include:{projeto: true} } : {include:{projeto: true}}, 
				
				},
				orderBy:{nome: 'asc'}
			});
			return NextResponse.json(colaboradores); // Retorna a resposta em formato JSON
		}
	} catch (error) {
		console.error('Erro ao buscar os Colaboradores:', error);
		return NextResponse.error(); // Retorna um erro em caso de falha
	}
}

// Método para criar um novo Colaborador. É preciso ter um projeto
export async function POST(request: Request) {
	try {

		const body = await request.json();
		
		const {idProjeto, ...dados} = body;

		const projeto = await prisma.projeto.findUnique({ where: { id: idProjeto } });
		if (!projeto) {
			return NextResponse.json({error: 'Projeto não encontrado'}, {status: 404})
		}
		
		const novoColaborador = await prisma.colaborador.create({
			data: {
				...dados,
			}
		});

        const novoprojetoColaborador = await prisma.projetoColaborador.create({
            data:{
                projeto: {
                    connect: {id: idProjeto}
                },
                colaborador: {
                    connect: {id: novoColaborador.id}
                } 
            }
        })
		return NextResponse.json(novoColaborador, { status: 201 }); // Retorna a nova Colaborador com status 201
	} catch (error ) {
		if (error instanceof Prisma.PrismaClientValidationError){
			return NextResponse.json({error: 'Tipos dos dados incorretos'}, {status: 400})
		} 

		console.error('Erro ao criar a Colaborador:', error);
		return NextResponse.error(); // Retorna um erro em caso de falha
	}
  }

// Método para atualização de um atributo da Colaborador
export async function PATCH(request: Request) {
	try {
	  const { id, atributo, novoValor } = await request.json();
  
	  // Certificar que todos os dados foram passados
	  if (!id || !atributo || novoValor === undefined) {
		return NextResponse.json({ error: "Todos os campos são obrigatórios" }, { status: 400 });
	  }
  
	  // Verifica se a Colaborador existe
		const Colaborador = await prisma.colaborador.findUnique({ where: { id: id } });
		if (!Colaborador) {
			return NextResponse.json({error: 'Colaborador não encontrada'}, {status: 404})
		}
	  // Atributos que NÃO podem ser alterados
	  const atributosFixos = ["id"];
	  
	  if (atributosFixos.includes(atributo)) {
		return NextResponse.json({ error: "Atributo não pode ser atualizaddo" }, { status: 400 });
	  }
  
	  let valorAtualizado = novoValor;
  
	  const ColaboradorAtualizado = await prisma.colaborador.update({
		where: { id },
		data: { [atributo]: valorAtualizado },
	  });
  
	  return NextResponse.json(ColaboradorAtualizado, { status: 200 });
  
	} catch (error) {
	  console.error(error);
	  return NextResponse.json({ error: "Erro ao atualizar Colaborador" }, { status: 500 });
	}
  }