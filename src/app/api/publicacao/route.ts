import { NextResponse } from 'next/server';
import prisma from '@/lib/prismaClient';
import { Prisma } from '@prisma/client';


export const dynamic = "force-dynamic";


export async function GET(request: Request) {
	const { searchParams } = new URL(request.url);
	const idUsuario = searchParams.get('idUsuario'); // Busca pelo ID do usuário, caso fornecido
	const ordem = searchParams.get('ordem'); // Busca pela ordem das publicações, caso fornecido
	const id = searchParams.get('id'); // Busca pelo ID da publicação, caso fornecido

	try {
	  // Se um ID de usuário for fornecido, retorna as publicações desse usuário
	  if (idUsuario) {
		const publicacoes = await prisma.publicacao.findMany({
		  where: { 
			idUsuario: Number(idUsuario)
			, deletedAt: null 
			, usuario: { tipo: { in: ['Super', 'Normal'] } } // Garante que o usuário é do tipo Super ou Normal
		}, // Filtra pelo ID do usuário
		  include: {
			usuario: true, // Inclui os detalhes do usuário que fez a publicação
		  },
		});
		return NextResponse.json(publicacoes); // Retorna as publicações do usuário
	  }
	  // Se um ID de publicação for fornecido, retorna a publicação correspondente
	  if (id) {
		const publicacao = await prisma.publicacao.findUnique({
			where: { 
				id: Number(id)
				, deletedAt: null
				, usuario: { tipo: { in: ['Super', 'Normal'] } } // Garante que o usuário é do tipo Super ou Normal
			 }, // Filtra pela ID da publicação
			include: {
			  usuario: true, // Inclui os detalhes do usuário que fez a publicação
			},
		  });
		return NextResponse.json(publicacao); // Retorna a publicação correspondente
		}
	  
	  // Se nenhum ID for fornecido, retorna todas as publicações
	  const publicacoes = await prisma.publicacao.findMany({
		where: { 
			deletedAt: null
			, usuario: { tipo: { in: ['Super', 'Normal'] } } // Garante que o usuário é do tipo Super ou Normal
		 }, // Filtra publicações que não foram excluídas
		include: {
		  usuario: true, // Inclui os detalhes do usuário que fez a publicação
		},
		orderBy: ordem==='recente' ? {createdAt: 'desc'}: {descricao: 'asc'}
	  });
	  return NextResponse.json(publicacoes); // Retorna todas as publicações
	} catch (error) {
	  console.error('Erro ao buscar publicações:', error);
	  return NextResponse.error(); // Retorna um erro em caso de falha
	}
  }

// Método para criar um novo publicacao. É preciso ter um usuário
export async function POST(request: Request) {
	try {
	  const body = await request.json();

	  const {idUsuario, idProjeto, ...data} = body;

	  // Verifica se o usuário existe
	  const usuario = await prisma.usuario.findUnique({ where: { id: idUsuario } });
	  if (!usuario) {
		return NextResponse.json({error: 'Usuário não encontrado'}, {status: 404})
	  }

	  const novopublicacao = await prisma.publicacao.create({
		data:{
			...data,
			usuario:{connect:{id:idUsuario}}
		},
	  });

	  return NextResponse.json(novopublicacao, { status: 201 }); // Retorna o novo publicacao com status 201
	} catch (error) {
	  if (error instanceof Prisma.PrismaClientValidationError){
		return NextResponse.json({error: 'Tipos dos dados incorretos'}, {status: 400})
	  } 
	  console.error('Erro ao criar o publicacao:', error);
	  return NextResponse.error(); // Retorna um erro em caso de falha
	}
  }

    // Método para atualização de um atributo do publicação
export async function PATCH(request: Request) {
	try {
	  const { id, atributo, novoValor } = await request.json();
  
	  // Certificar que todos os dados foram passados
	  if (!id || !atributo || novoValor === undefined) {
		return NextResponse.json({ error: "Todos os campos são obrigatórios" }, { status: 400 });
	  }
  
	  // Verifica se o publicação existe
		const publicacao = await prisma.publicacao.findUnique({ where: { id: id } });
		if (!publicacao) {
			return NextResponse.json({error: 'Publicação não encontrado'}, {status: 404})
		}
	  // Atributos que NÃO podem ser alterados
	  const atributosFixos = ["id", "idUsuario"];
	  
	  if (atributosFixos.includes(atributo)) {
		return NextResponse.json({ error: "Atributo não pode ser atualizaddo" }, { status: 400 });
	  }
  
	  let valorAtualizado = novoValor;
  
	  const publicacaoAtualizado = await prisma.publicacao.update({
		where: { id },
		data: { [atributo]: valorAtualizado },
	  });
  
	  return NextResponse.json(publicacaoAtualizado, { status: 200 });
  
	} catch (error) {
	  console.error(error);
	  return NextResponse.json({ error: "Erro ao atualizar publicacao" }, { status: 500 });
	}
  }


  export async function DELETE(request: Request) {
	const { searchParams } = new URL(request.url);
	const idPublicacao = searchParams.get('idPublicacao'); // ID da publicação a ser excluída
  
	try {
	  // Excluindo a publicação e todas as suas relações
	  const publicacaoDeletada = await prisma.publicacao.delete({
		where: {
		  id: Number(idPublicacao), // Utiliza o ID da publicação para exclusão
		}
	  });
  
	  return NextResponse.json(publicacaoDeletada); // Retorna a publicação excluída
	} catch (error) {
	  console.error('Erro ao excluir a publicação:', error);
	  return NextResponse.error(); // Retorna um erro em caso de falha
	}
  }