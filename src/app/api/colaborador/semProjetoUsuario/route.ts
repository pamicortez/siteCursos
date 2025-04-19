import { NextResponse } from 'next/server';
import prisma from '@/lib/prismaClient';
import { Prisma } from '@prisma/client';
import { PrismaClient, colaboradorCategoria } from '@prisma/client';

// Método GET para retornar todos os Colaboradores
export async function GET(request: Request) {
	const { searchParams } = new URL(request.url);
	const id = searchParams.get('id');
	const ordem = searchParams.get('ordem');

	try {
		if (id){
            // Verifica se o ID foi fornecido e busca o colaborador específico
			const Colaborador = await prisma.colaborador.findUnique({
				where: { id: Number(id) },
				include: {
					projetoColaborador: true,
				},
			});
            // Pego o nome do colaboraro e busco o usuario com mesmo nome
            const usuario = await prisma.usuario.findFirst({
                where: { Nome: Colaborador?.nome }, // Verifica se o nome do colaborador existe
                include: {
                    link: true,
                    publicacao: true,
                    eventoUsuario: { include: { evento: true } },
                    cursoUsuario: { include: { curso: true } },
                    projetoUsuario: { include: { projeto: true } },
                },
            });
            // retorno um o colaborador apenas com o projetocolaboador que não aparecer em projetousuario (pela coluna idProjeto)
            const ColaboradorComUsuario = {
                ...Colaborador,
                projetoColaborador: Colaborador?.projetoColaborador.filter((projeto) => {
                    return !usuario?.projetoUsuario.some((projetoUsuario) => projeto.idProjeto === projetoUsuario.idProjeto);
                }),
            };
            return NextResponse.json(ColaboradorComUsuario); // Retorna a resposta em formato JSON


			// return NextResponse.json(Colaborador); // Retorna a resposta em formato JSON
		}
	} catch (error) {
		console.error('Erro ao buscar os Colaboradores:', error);
		return NextResponse.error(); // Retorna um erro em caso de falha
	}
}
