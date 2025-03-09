import { NextResponse } from 'next/server';
import prisma from '@/lib/prismaClient';
import { Prisma } from '@prisma/client';


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
				include: {
					projetoUsuario: true,
					curso: true,
				}
			});
		
			return NextResponse.json(projetos);
		}
		// === Buscando projetos com categoria ===
		else if (categoria) {
			console.log('Buscando projetos com categoria:', categoria); // http://localhost:3000/api/projeto?categoria=IA
			// Buscar projetos que tenham a categoria especificada
			const projetos = await prisma.projeto.findMany({
				where: { categoria },
				include: {
					projetoUsuario: true,
					curso: true,
				}
			});
			return NextResponse.json(projetos);
		}
		// === Buscando todos os projetos === 
		else {
			console.log('Buscando todos os projetos'); // http://localhost:3000/api/projeto
			// Retorna todos os projetos se não houver título na URL
			const projetos = await prisma.projeto.findMany({
				include: {
					projetoUsuario: true,
					curso: true,
				}
			});
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

// Método para criar um novo Projeto. É preciso ter um usuário
export async function POST(request: Request) {
	try {
	  const data: Prisma.ProjetoCreateInput = await request.json(); // Pega os dados do corpo da requisição
	  
	  const { dataInicio, dataFim } = data;
	  const { usuarioId, funcao, ...projetoData } = data as any;

	  // Validação: usuárioId e funcao são obrigatórios
	  if (!usuarioId || !funcao) {
		return NextResponse.json({error: 'Usuário e funcao são obrigatórios'}, {status: 400})
	  }
  
	  // Verifica se o usuário existe
	  const usuario = await prisma.usuario.findUnique({ where: { id: usuarioId } });
	  if (!usuario) {
		return NextResponse.json({error: 'Usuário não encontrado'}, {status: 404})
	  }

	  // Verificação lógica para garantir que a data de fim não seja anterior à data de início
	  if (new Date(dataFim) < new Date(dataInicio)) {
		return NextResponse.json({error: 'O fim do projeto é anterior ao início'}, {status: 400});
	  }

	  const novoProjeto = await prisma.projeto.create({
		data:{
			...projetoData, // Dados do projeto que será criado
		}
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
		return NextResponse.json({error: 'Tipos dos dados incorretos'}, {status: 400})
	  } 
	  console.error('Erro ao criar o Projeto:', error);
	  return NextResponse.error(); // Retorna um erro em caso de falha
	}
  }

    // Método para atualização de um atributo do projeto
export async function PATCH(request: Request) {
	try {
	  const { id, atributo, novoValor } = await request.json();
  
	  // Certificar que todos os dados foram passados
	  if (!id || !atributo || novoValor === undefined) {
		return NextResponse.json({ error: "Todos os campos são obrigatórios" }, { status: 400 });
	  }
  
	  // Verifica se o projeto existe
		const projeto = await prisma.projeto.findUnique({ where: { id: id } });
		if (!projeto) {
			return NextResponse.json({error: 'Projeto não encontrado'}, {status: 404})
		}
	  // Atributos que NÃO podem ser alterados
	  const atributosFixos = ["id", "usuarioId"];
	  
	  if (atributosFixos.includes(atributo)) {
		return NextResponse.json({ error: "Atributo não pode ser atualizaddo" }, { status: 400 });
	  }
  
	  let valorAtualizado = novoValor;
  
	  const projetoAtualizado = await prisma.projeto.update({
		where: { id },
		data: { [atributo]: valorAtualizado },
	  });
  
	  return NextResponse.json(projetoAtualizado, { status: 200 });
  
	} catch (error) {
	  console.error(error);
	  return NextResponse.json({ error: "Erro ao atualizar projeto" }, { status: 500 });
	}
  }