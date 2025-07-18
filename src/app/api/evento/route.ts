import { NextResponse } from 'next/server';
import prisma from '@/lib/prismaClient';
import { Prisma, funcaoProjeto} from '@prisma/client';
import { tipoParticipacao as typeParticipacao} from '@prisma/client';

const categoriaFormatada: Record<string, string> = {
  ArtesECultura: "Artes e Cultura",
  CienciasAgrarias: "Ciências Agrárias",
  CienciasBiologicasENaturais: "Ciências Biológicas e Naturais",
  CienciasExatas: "Ciências Exatas",
  CienciasHumanas: "Ciências Humanas",
  CienciasSociaisAplicadasANegocios: "Ciências Sociais Aplicadas a Negócios",
  ComunicacaoEInformacao: "Comunicação e Informação",
  EducacaoEFormacaoDeProfessores: "Educação e Formação de Professores",
  EngenhariaEProducao: "Engenharia e Produção",
  GestaoEPlanejamento: "Gestão e Planejamento",
  LinguagensLetrasEComunicacao: "Linguagens, Letras e Comunicação",
  MeioAmbienteESustentabilidade: "Meio Ambiente e Sustentabilidade",
  NegociosAdministracaoEDireito: "Negócios, Administração e Direito",
  PesquisaEInovacao: "Pesquisa e Inovação",
  ProducaoEConstrucao: "Produção e Construção",
  SaudeEBemEstar: "Saúde e Bem-Estar",
  ServicosSociasEComunitarios: "Serviços Sociais e Comunitários",
  TecnologiaEComputacao: "Tecnologia e Computação"
};

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
		
			return NextResponse.json(
				eventos.map(c => ({
					...c,
					categoriaFormatada: categoriaFormatada[c.categoria as keyof typeof categoriaFormatada] || c.categoria
				}))
			);
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
		
			if (evento) {
				return NextResponse.json({
					...evento,
					categoriaFormatada: categoriaFormatada[evento.categoria as keyof typeof categoriaFormatada] || evento.categoria
			});
			} else {
				return new NextResponse('Projeto não encontrado', { status: 404 });
			}

		}
		// === Buscando eventos com data >= data_inicio e data <= data_fim ===
		else if (data_fim && data_inicio) {
            console.log('Buscando eventos com data_inicio:', data_inicio, 'e data_fim:', data_fim);
            // Buscar eventos que tenham a data_inicio e data_fim especificadas
            // Exemplo de requisição http para chegar aqui: http://localhost:3000/api/evento?data_inicio=2021-10-01&data_fim=2021-10-31
            const eventos = await prisma.evento.findMany({
                where: {
                    dataInicio: {
                        gte: new Date(data_inicio),
                    },
					dataFim:{
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
            return NextResponse.json(
				eventos.map(c => ({
					...c,
					categoriaFormatada: categoriaFormatada[c.categoria as keyof typeof categoriaFormatada] || c.categoria
				}))
			);
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
			return NextResponse.json(
				eventos.map(e => ({
					...e,
					categoriaFormatada: categoriaFormatada[e.categoria as keyof typeof categoriaFormatada] || e.categoria
				}))
			);
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
	  const setParticipacao = new Set(Object.values(typeParticipacao))
	  const data: Prisma.EventoCreateInput = await request.json(); // Pega os dados do corpo da requisição
	  const { dataInicio, dataFim} = data;
	  const { colaboradores,usuarioId, tipoParticipacao, imagens, ...eventoData } = data as any;

	  // Validação: usuárioId e funcao são obrigatórios
	  if (!usuarioId || !tipoParticipacao) {
		return NextResponse.json({error: 'Id do usuário e o tipo de participação são obrigatórios'}, {status: 400})
	  } else if (!setParticipacao.has(tipoParticipacao)){
		return NextResponse.json({error: 'Tipo de participação não reconhecido'}, {status: 400})
	  } else if(!imagens){
		return NextResponse.json({error: 'Imagem é obrigatória'}, {status: 400})
	  }
	  // Verifica se o usuário existe
	  const usuario = await prisma.usuario.findUnique({ where: { id: usuarioId } });
	  if (!usuario) {
		return NextResponse.json({error: 'Usuário não encontrado'}, {status: 404})
	  }

	// Verificação para garantir que a data de fim não seja anterior à data de início
	  if (new Date(dataFim) < new Date(dataInicio)) {
		return NextResponse.json({error: 'O fim do evento é anterior ao início'}, {status: 400});
	  }

	  const novoEvento = await prisma.evento.create({
		data:{
			...eventoData, // Dados do projeto que será criado
			eventoColaborador: {
				create: colaboradores.map((colaborador: {categoria: typeParticipacao, nome: string}) => ({
					categoria: colaborador.categoria,
					colaborador: {
						create: {
							nome: colaborador.nome,
						},
					},
				})),
			},
			imagemEvento: {
				create: imagens.map((link: string) => ({
					link: link,
				}))
			}
		},
		include: {
			eventoColaborador: {
				include: {colaborador: true},
			},
		},
	  });
	  // Relação entre o usuário e o evento
	  const novoEventUsu = await prisma.eventoUsuario.create({ 
		data:{
			idEvento: novoEvento.id,
			idUsuario: usuarioId,
			tipoParticipacao: tipoParticipacao
		}
	  })

	  return NextResponse.json(novoEvento, { status: 201 }); // Retorna o novo evento com status 201
	} catch (error) {
	  if (error instanceof Prisma.PrismaClientValidationError){
		console.error(error.message);
		return NextResponse.json({error: 'Tipos dos dados incorretos (Ou enum não correspondente)'}, {status: 400})
	  } 
	  console.log('Erro ao criar o evento:', error);
	  return NextResponse.error(); // Retorna um erro em caso de falha
	}
  }

export async function PATCH(request: Request) {
	try {
	  const { searchParams } = new URL(request.url);
	  const id = Number(searchParams.get('id')); // ID do evento

	  const atualizacoes = await request.json();
	  const colNovos: {nome: string; categoria: typeParticipacao}[] = atualizacoes.colaboradores || []; 
	  // Verifica se o evento existe
		const evento = await prisma.evento.findUnique({ where: { id: id } });
		if (!evento) {
			return NextResponse.json({error: 'Evento não encontrado'}, {status: 404})
		}
	  // Atributos que NÃO podem ser alterados
	  const atributosFixos = ["id"];

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
	  
	  const {colaboradores, tipoParticipacao, usuarioId, imagens, imagemId, ...dadosEvento} = atualizacoes;

	  const eventoAtualizado = await prisma.evento.update({
		where: { id },
		data: dadosEvento,
	  });

	  if (tipoParticipacao){
		const eventoUsu = await prisma.eventoUsuario.findFirst({
			where: {
				idEvento: id,
				idUsuario: usuarioId,
			},
		});

		if (eventoUsu){
			await prisma.eventoUsuario.update({
				where: { id: eventoUsu.id },
				data: {
				  tipoParticipacao: tipoParticipacao,
				},
			  });
		}
	  }

	  if (imagens && Array.isArray(imagens)) {
      await prisma.imagemEvento.deleteMany({
        where: { idEvento: id },
      })

      // Cria todas as novas
      await prisma.imagemEvento.createMany({
        data: imagens.map((url: string) => ({
          link: url,
          idEvento: id,
        })),
      })
      }

	  if (colaboradores){
		const colAtuais = await prisma.eventoColaborador.findMany({
			where: {idEvento: id},
			include: {colaborador: true},
		});

		const nomesAtuais = colAtuais.map((projCol) => projCol.colaborador.nome);
		const nomesNovos = colNovos.map((col) => col.nome);

		const pRemover = colAtuais.filter(
			(eventCol) => !nomesNovos.includes(eventCol.colaborador.nome)
		);

		await prisma.eventoColaborador.deleteMany({
			where: {
				idEvento: id,
				idColaborador: {
					in: pRemover.map((eventCol) => eventCol.idColaborador),
				},
			},
		});

		for (const colab of colNovos){
			const colExistente = await prisma.colaborador.findFirst({
				where: {nome: colab.nome},
			});

			let colId: number;
			if (colExistente){
				colId = colExistente.id;
			} else{
				const novoCol = await prisma.colaborador.create({
					data: {nome: colab.nome},
				});
				colId = novoCol.id;
			}

			const assocExist = await prisma.eventoColaborador.findFirst({
				where: {
					idEvento: id,
					idColaborador: colId,
				},
			});

			if (!assocExist){
				await prisma.eventoColaborador.create({
					data:{
						idEvento: id,
						idColaborador: colId,
						categoria: colab.categoria,
					},
				});
			} else{
				if (assocExist.categoria !== colab.categoria) {
					await prisma.eventoColaborador.update({
					where: { id: assocExist.id },
					data: { categoria: colab.categoria },
					});
				}
			}
		}
	  }

	  const projAtua = await prisma.evento.findUnique({
		where: {id: id},
		include: {
			eventoColaborador: {
				include: {colaborador: true}
			}
		}
	  })
	  return NextResponse.json(projAtua, { status: 200 });
  
	} catch (error) {
	  console.error(error);
	  return NextResponse.json({ error: "Erro ao atualizar evento" }, { status: 500 });
	}
  }