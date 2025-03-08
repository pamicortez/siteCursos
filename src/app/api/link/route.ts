import { NextResponse } from 'next/server';
import prisma from '@/lib/prismaClient';
import { Prisma } from '@prisma/client';

// Método para criar um novo Link. É preciso ter um usuário
export async function POST(request: Request) {
	try {
	  const data: Prisma.LinkCreateInput = await request.json(); // Pega os dados do corpo da requisição
	  
	  const { idUsuario } = data;

	  // Verifica se o usuário existe
	  const usuario = await prisma.usuario.findUnique({ where: { id: idUsuario } });
	  if (!usuario) {
		return NextResponse.json({error: 'Usuário não encontrado'}, {status: 404})
	  }

	  const novolink = await prisma.link.create({
		data,
	  });

	  return NextResponse.json(novolink, { status: 201 }); // Retorna o novo link com status 201
	} catch (error) {
	  if (error instanceof Prisma.PrismaClientValidationError){
		return NextResponse.json({error: 'Tipos dos dados incorretos (ou enum não correspondente)'}, {status: 400})
	  } 
	  console.error('Erro ao criar o link:', error);
	  return NextResponse.error(); // Retorna um erro em caso de falha
	}
  }

    // Método para atualização de um atributo do link
export async function PATCH(request: Request) {
	try {
	  const { id, atributo, novoValor } = await request.json();
  
	  // Certificar que todos os dados foram passados
	  if (!id || !atributo || novoValor === undefined) {
		return NextResponse.json({ error: "Todos os campos são obrigatórios" }, { status: 400 });
	  }
  
	  // Verifica se o link existe
		const link = await prisma.link.findUnique({ where: { id: id } });
		if (!link) {
			return NextResponse.json({error: 'Link não encontrado'}, {status: 404})
		}
	  // Atributos que NÃO podem ser alterados
	  const atributosFixos = ["id", "idUsuario"];
	  
	  if (atributosFixos.includes(atributo)) {
		return NextResponse.json({ error: "Atributo não pode ser atualizaddo" }, { status: 400 });
	  }
  
	  let valorAtualizado = novoValor;
  
	  const linkAtualizado = await prisma.link.update({
		where: { id },
		data: { [atributo]: valorAtualizado },
	  });
  
	  return NextResponse.json(linkAtualizado, { status: 200 });
  
	} catch (error) {
	  console.error(error);
	  return NextResponse.json({ error: "Erro ao atualizar link" }, { status: 500 });
	}
  }