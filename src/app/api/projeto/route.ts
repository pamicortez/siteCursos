import { NextResponse } from 'next/server';
import prisma from '@/lib/prismaClient';
import { Prisma, funcaoProjeto} from '@prisma/client';


/*
- Se chegar aqui, significa que a solicitação já deve ter sido validada e o token de acesso deve ter sido verificado. Portanto, não é necessário verificar o token de acesso novamente.
- Deve-se criar objetos dto para resposta ao usuário?
- Quais outros  tipos de filtros deve ter para a busca de projetos?
*/

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


// Método GET para retornar todos os projetos
export async function GET(request: Request) {
	const { searchParams } = new URL(request.url);
	const id = searchParams.get('id'); // ID do projeto
	const titulo = searchParams.get('titulo');
	const categoria = searchParams.get('categoria');
	const ordem = searchParams.get('ordem');
	try {
		// === Buscando projetos por titulo e categoria ===
		if (titulo && categoria) {
			console.log('Buscando projetos com título e categoria:', titulo, categoria); // http://localhost:3000/api/projeto?titulo=Projeto%20AI&categoria=IA
			// Buscar projetos que tenham o título e categoria especificados
			const projetos = await prisma.projeto.findMany({
				where: { 
					titulo:{ contains: titulo, mode: 'insensitive'}
					, deletedAt: null
					, projetoUsuario: { some:{ usuario: { tipo: { in: ['Super', 'Normal'] } }, deletedAt: null }} // Garante que o usuário é do tipo Super ou Normal
					, categoria 
				},
				include: {
					projetoUsuario: {include: {usuario: true}},
					curso: true,
					projetoColaborador: { include: { colaborador: true } },
				}, 
				orderBy: ordem==='recente' ? {createdAt: 'desc'}: {titulo: 'asc'} 
			});
			return NextResponse.json(
				projetos.map(p => ({
					...p,
					categoriaFormatada: categoriaFormatada[p.categoria as keyof typeof categoriaFormatada] || p.categoria
				}))
			);
		}
		// === Buscando projetos com id ===
		else if (id) {
			console.log('Buscando projeto com id:', id); // http://localhost:3000/api/projeto?id=1
			const projeto = await prisma.projeto.findUnique({
				where: { 
					id: Number(id)
					, deletedAt: null
					, projetoUsuario: { some:{ usuario: { tipo: { in: ['Super', 'Normal'] } }, deletedAt: null }} // Garante que o usuário é do tipo Super ou Normal
				},
				include: {
					projetoUsuario: {include: {usuario: true}},
					curso: true,
					projetoColaborador: { include: { colaborador: true } },
				},
			});
			if (projeto) {
			return NextResponse.json({
				...projeto,
				categoriaFormatada: categoriaFormatada[projeto.categoria as keyof typeof categoriaFormatada] || projeto.categoria
			});
			} else {
				return new NextResponse('Projeto não encontrado', { status: 404 });
			} // Retorna a resposta em formato JSON
		}
		// === Buscando projetos com título ===
		else if (titulo) {
			console.log('Buscando projetos com título:', titulo);// http://localhost:3000/api/projeto?titulo=Projeto%20AI
			// Buscar projetos que tenham o título especificado
			const projetos = await prisma.projeto.findMany({
				where: { titulo:
					{
						contains: titulo, // nomeBusca é o parâmetro de entrada, pode ser uma string com parte do nome
						mode: 'insensitive',  // Ignora a diferença entre maiúsculas e minúsculas
					}, deletedAt: null
					, projetoUsuario: { some:{ usuario: { tipo: { in: ['Super', 'Normal'] } }, deletedAt: null }} // Garante que o usuário é do tipo Super ou Normal
				},
				include: {
					projetoUsuario: {include: {usuario: true}},
					curso: true,
					projetoColaborador: { include: { colaborador: true } },
				},
				orderBy: ordem==='recente' ? {createdAt: 'desc'}: {titulo: 'asc'}
			});
		
			return NextResponse.json(
				projetos.map(p => ({
					...p,
					categoriaFormatada: categoriaFormatada[p.categoria as keyof typeof categoriaFormatada] || p.categoria
				}))
			);

		}
		// === Buscando projetos com categoria ===
		else if (categoria) {
			console.log('Buscando projetos com categoria:', categoria); // http://localhost:3000/api/projeto?categoria=IA
			// Buscar projetos que tenham a categoria especificada
			const projetos = await prisma.projeto.findMany({
				where: { categoria, deletedAt: null
					, projetoUsuario: { some:{ usuario: { tipo: { in: ['Super', 'Normal'] } }, deletedAt: null }} // Garante que o usuário é do tipo Super ou Normal
				 },
				include: {
					projetoUsuario: {include: {usuario: true}},
					curso: true,
					projetoColaborador: { include: { colaborador: true } },
				},
				orderBy: ordem==='recente' ? {createdAt: 'desc'}: {titulo: 'asc'}
			});
			return NextResponse.json(
				projetos.map(p => ({
					...p,
					categoriaFormatada: categoriaFormatada[p.categoria as keyof typeof categoriaFormatada] || p.categoria
				}))
			);
		}
		// === Buscando todos os projetos === 
		else {
			console.log('Buscando todos os projetos'); // http://localhost:3000/api/projeto
			// Retorna todos os projetos se não houver título na URL
			const projetos = await prisma.projeto.findMany({
				where: { deletedAt: null
					, projetoUsuario: { some:{ usuario: { tipo: { in: ['Super', 'Normal'] } }, deletedAt: null }} // Garante que o usuário é do tipo Super ou Normal
				 },
				include: {
					projetoUsuario: {include: {usuario: true}},
					curso: true,
					projetoColaborador: { include: { colaborador: true } },
				},
				orderBy: ordem==='recente' ? {createdAt: 'desc'}: {titulo: 'asc'}
			});
			return NextResponse.json(
				projetos.map(p => ({
					...p,
					categoriaFormatada: categoriaFormatada[p.categoria as keyof typeof categoriaFormatada] || p.categoria
				}))
			);
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

// Método para criar um novo Projeto. É preciso ter um usuário
export async function POST(request: Request) {
	try {
	  const data: Prisma.ProjetoCreateInput = await request.json(); // Pega os dados do corpo da requisição
	  
	  const { dataInicio, dataFim } = data;
	  const { usuarioId, funcao, colaboradores, ...projetoData } = data as any;

	  // Validação: usuárioId  são obrigatórios
	  if (!usuarioId || !funcao) {
		return NextResponse.json({error: 'Usuário e funcao são obrigatórios'}, {status: 400})
	  }
  
	  // Verifica se o usuário existe
	  const usuario = await prisma.usuario.findUnique({ where: { id: usuarioId } });
	  if (!usuario) {
		return NextResponse.json({error: 'Usuário não encontrado'}, {status: 404})
	  }

	  // Verificação lógica para garantir que a data de fim não seja anterior à data de início
	  if (dataFim){
		  if (new Date(dataFim) < new Date(dataInicio)) {
			return NextResponse.json({error: 'O fim do projeto é anterior ao início'}, {status: 400});
		  }
	  }

	  const novoProjeto = await prisma.projeto.create({
		data:{
			...projetoData, // Dados do projeto que será criado
			projetoColaborador: {
				create: colaboradores.map((colaborador: {categoria: funcaoProjeto, nome: string}) => ({
					categoria: colaborador.categoria,
					colaborador: {
						create: {
							nome: colaborador.nome,
						},
					},
				})),
			},
		},
		include: {
			projetoColaborador: {
				include: {colaborador: true},
			},
		},
	  });

	  // Relação entre o usuário e o projeto
	  const novoProjUsu = await prisma.projetoUsuario.create({ 
		data:{
			idProjeto: novoProjeto.id,
			idUsuario: usuarioId,
			funcao: funcao
		}
	  })

	  return NextResponse.json(novoProjeto, { status: 201 }); // Retorna o novo projeto com status 201
	} catch (error) {
	  if (error instanceof Prisma.PrismaClientValidationError){
		console.error('Erro ao criar o Projeto:', error);
		return NextResponse.json({error: 'Tipos dos dados incorretos'}, {status: 400})
	  } 
	  console.error('Erro ao criar o Projeto:', error);
	  return NextResponse.error(); // Retorna um erro em caso de falha
	}
  }

    // Método para atualização dos atributos do projeto
export async function PATCH(request: Request) {
	try {
	  const { searchParams } = new URL(request.url);
	  const id = Number(searchParams.get('id')); // ID do projeto

	  const atualizacoes = await request.json();
	  const colNovos: {nome: string; categoria: funcaoProjeto}[] = atualizacoes.colaboradores || []; 
	  // Verifica se o projeto existe
		const projeto = await prisma.projeto.findUnique({ where: { id: id } });
		if (!projeto) {
			return NextResponse.json({error: 'Projeto não encontrado'}, {status: 404})
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
	  
	  const {colaboradores, funcao, usuarioId, ...dadosProjeto} = atualizacoes;

	  const projetoAtualizado = await prisma.projeto.update({
		where: { id },
		data: dadosProjeto,
	  });

	  if (funcao){
		const projetoUsu = await prisma.projetoUsuario.findFirst({
			where: {
				idProjeto: id,
				idUsuario: usuarioId,
			},
		});

		if (projetoUsu){
			await prisma.projetoUsuario.update({
				where: { id: projetoUsu.id },
				data: {
				  funcao: funcao,
				},
			  });
		}
	  }

	  if (colaboradores){
		const colAtuais = await prisma.projetoColaborador.findMany({
			where: {idProjeto: id},
			include: {colaborador: true},
		});

		const nomesAtuais = colAtuais.map((projCol) => projCol.colaborador.nome);
		const nomesNovos = colNovos.map((col) => col.nome);

		const pRemover = colAtuais.filter(
			(projCol) => !nomesNovos.includes(projCol.colaborador.nome)
		);

		await prisma.projetoColaborador.deleteMany({
			where: {
				idProjeto: id,
				idColaborador: {
					in: pRemover.map((projCol) => projCol.idColaborador),
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

			const assocExist = await prisma.projetoColaborador.findFirst({
				where: {
					idProjeto: id,
					idColaborador: colId,
				},
			});

			if (!assocExist){
				await prisma.projetoColaborador.create({
					data:{
						idProjeto: id,
						idColaborador: colId,
						categoria: colab.categoria,
					},
				});
			} else{
				if (assocExist.categoria !== colab.categoria) {
					await prisma.projetoColaborador.update({
					where: { id: assocExist.id },
					data: { categoria: colab.categoria },
					});
				}
			}
		}
	  }

	  const projAtua = await prisma.projeto.findUnique({
		where: {id: id},
		include: {
			projetoColaborador: {
				include: {colaborador: true}
			}
		}
	  })
	  return NextResponse.json(projAtua, { status: 200 });
  
	} catch (error) {
	  console.error(error);
	  return NextResponse.json({ error: "Erro ao atualizar projeto" }, { status: 500 });
	}
  }