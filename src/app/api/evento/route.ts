import { NextResponse } from 'next/server';
import prisma from '@/lib/prismaClient';
import { Prisma } from '@prisma/client';
import { tipoParticipacao } from '@prisma/client';


// Método GET para retornar todos os eventos
export async function GET(request: Request) {
	const { searchParams } = new URL(request.url);
	const titulo = searchParams.get('titulo');
	const data_inicio = searchParams.get('data_inicio');// data de inicio do filtro
    const data_fim = searchParams.get('data_fim');// data de fim do filtro
	const ordem = searchParams.get('ordem');
	const id = searchParams.get('id');

	try {
		// === Buscando eventos com título ===
		if (titulo) {
			console.log('Buscando eventos com título:', titulo);
			// Buscar eventos que tenham o título especificado
			const eventos = await prisma.evento.findMany({
				where: { titulo:
					{
						contains: titulo, // nomeBusca é o parâmetro de entrada, pode ser uma string com parte do nome
						mode: 'insensitive',  // Ignora a diferença entre maiúsculas e minúsculas
					}, deletedAt: null
					, eventoUsuario: { some:{ usuario: { tipo: { in: ['Super', 'Normal'] } } }}
				 },
				include: {
					eventoUsuario: {include: {usuario: true}}, // Inclui o usuário que criou o evento
					imagemEvento: true,
				},
				orderBy: ordem==='recente' ? {createdAt: 'desc'}: {titulo: 'asc'}
			});
		
			return NextResponse.json(eventos);
		}
		// === Buscando eventos com id ===
		else if (id) {
			console.log('Buscando evento com id:', id);
			// Buscar evento que tenha o id especificado
			const evento = await prisma.evento.findUnique({
				where: { 
					id: Number(id)
					, deletedAt: null
				, eventoUsuario: { some:{ usuario: { tipo: { in: ['Super', 'Normal'] } } }}
			 	},
				include: {
					eventoUsuario: {include: {usuario: true}}, // Inclui o usuário que criou o evento
					imagemEvento: true,
				}
			});
		
			return NextResponse.json(evento);
		}
		// === Buscando eventos com data >= data_inicio e data <= data_fim ===
		else if (data_fim && data_inicio) {
            console.log('Buscando eventos com data_inicio:', data_inicio, 'e data_fim:', data_fim);
            // Buscar eventos que tenham a data_inicio e data_fim especificadas
            // Exemplo de requisição http para chegar aqui: http://localhost:3000/api/evento?data_inicio=2021-10-01&data_fim=2021-10-31
            const eventos = await prisma.evento.findMany({
                where: {
                    data: {
                        gte: new Date(data_inicio),
                        lte: new Date(data_fim)
                    }, deletedAt: null
					, eventoUsuario: { some:{ usuario: { tipo: { in: ['Super', 'Normal'] } } }}
                },
				include: {
					eventoUsuario: {include: {usuario: true}}, // Inclui o usuário que criou o evento
					imagemEvento: true,
				},
				orderBy: ordem==='recente' ? {createdAt: 'desc'}: {titulo: 'asc'}
            });
            return NextResponse.json(eventos);
		}
		// === Buscando todos os eventos === 
		else {
			console.log('Buscando todos os eventos'); 
			// Retorna todos os eventos se não houver título na URL
			const eventos = await prisma.evento.findMany({
				where: {
					deletedAt: null
					// Vai em eventoUsuario e só obtem os usuarios que são tipo Super ou Normal
					, eventoUsuario: { some:{ usuario: { tipo: { in: ['Super', 'Normal'] } } }}
				}, // Verifica se o evento não foi deletado
				include: {
					eventoUsuario: {include: {usuario: true}}, // Inclui o usuário que criou o evento
					imagemEvento: true,
				},
				orderBy: ordem==='recente' ? {createdAt: 'desc'}: {titulo: 'asc'}
			});
			return NextResponse.json(eventos);
		}
	  } catch (error) {
		console.error('Erro ao buscar eventos:', error);
		return new NextResponse('Erro interno', { status: 500 });
	  }
}


// Método Delete para deletar evento com base no id
export async function DELETE(request: Request) {
	const { searchParams } = new URL(request.url);
	const id = searchParams.get('id');
	try {
		if (id) {
			console.log('Deletando evento com id:', id);
			// Deletar evento com base no id
			const evento = await prisma.evento.delete({
				where: { id: Number(id) },
			});
			return NextResponse.json(evento);
		} else {
			console.log('evento não encontrado');
			return new NextResponse('evento não encontrado', { status: 404 });
		}
	} catch (error) {
		console.error('Erro ao deletar evento:', error);
		return new NextResponse('Erro interno', { status: 500 });
	}
}

// Método para criar um novo evento. É preciso ter um usuário
export async function POST(request: Request) {
	try {
	  const setParticipacao = new Set(Object.values(tipoParticipacao))
	  const data: Prisma.EventoCreateInput = await request.json(); // Pega os dados do corpo da requisição
	  
	  const { usuarioId, participacao, linkImgVid, ...eventoData } = data as any;

	  // Validação: usuárioId e funcao são obrigatórios
	  if (!usuarioId || !participacao) {
		return NextResponse.json({error: 'Id do usuário e o tipo de participação são obrigatórios'}, {status: 400})
	  } else if (!setParticipacao.has(participacao)){
		return NextResponse.json({error: 'Tipo de participação não reconhecido'}, {status: 400})
	  }else if (!linkImgVid) {
		return NextResponse.json({error: 'Link da imagem/video do evento é obrigatório'}, {status: 400})
	  }
  
	  // Verifica se o usuário existe
	  const usuario = await prisma.usuario.findUnique({ where: { id: usuarioId } });
	  if (!usuario) {
		return NextResponse.json({error: 'Usuário não encontrado'}, {status: 404})
	  }

	  const novoEvento = await prisma.evento.create({
		data:{
			...eventoData, // Dados do evento que será criado
		}
	  });

	  // Relação entre o usuário e o evento
	  const novoEventUsu = await prisma.eventoUsuario.create({ 
		data:{
			idEvento: novoEvento.id,
			idUsuario: usuarioId,
			tipoParticipacao: participacao
		}
	  })

	  // Imagem/video do evento
	  const novoImagemEvento = await prisma.imagemEvento.create({
		data: {
			link: linkImgVid,
			idEvento: novoEvento.id
		}
	  })

	  return NextResponse.json(novoEvento, { status: 201 }); // Retorna o novo evento com status 201
	} catch (error) {
	  if (error instanceof Prisma.PrismaClientValidationError){
		return NextResponse.json({error: 'Tipos dos dados incorretos (Ou enum não correspondente)'}, {status: 400})
	  } 
	  console.error('Erro ao criar o evento:', error);
	  return NextResponse.error(); // Retorna um erro em caso de falha
	}
  }

  // Método para atualização de um atributo do evento
  export async function PATCH(request: Request) {
	try {
	  const { id, atributo, novoValor } = await request.json();
  
	  // Certificar que todos os dados foram passados
	  if (!id || !atributo || novoValor === undefined) {
		return NextResponse.json({ error: "Todos os campos são obrigatórios" }, { status: 400 });
	  }
  
	  // Verifica se o evento existe
		const evento = await prisma.evento.findUnique({ where: { id: id } });
		if (!evento) {
			return NextResponse.json({error: 'Evento não encontrado'}, {status: 404})
		}
	  // Atributos que NÃO podem ser alterados
	  const atributosFixos = ["id", "idUsuario"];
	  
	  if (atributosFixos.includes(atributo)) {
		return NextResponse.json({ error: "Atributo não pode ser atualizaddo" }, { status: 400 });
	  }
  
	  let valorAtualizado = novoValor;
  
	  const eventoAtualizado = await prisma.evento.update({
		where: { id },
		data: { [atributo]: valorAtualizado },
	  });
  
	  return NextResponse.json(eventoAtualizado, { status: 200 });
  
	} catch (error) {
	  console.error(error);
	  return NextResponse.json({ error: "Erro ao atualizar evento" }, { status: 500 });
	}
  }