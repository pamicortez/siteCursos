import { NextResponse } from 'next/server';
import prisma from '@/lib/prismaClient';


// Método GET para retornar todos os eventos
export async function GET(request: Request) {
	const { searchParams } = new URL(request.url);
	const titulo = searchParams.get('titulo');
	const data_inicio = searchParams.get('data_inicio');// data de inicio do filtro
    const data_fim = searchParams.get('data_fim');// data de fim do filtro

	try {
		// === Buscando eventos com título ===
		if (titulo) {
			console.log('Buscando cursos com título:', titulo);
			// Buscar cursos que tenham o título especificado
			const eventos = await prisma.evento.findMany({
				where: { titulo },
			});
		
			return NextResponse.json(eventos);
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
                    }
                }
            });
            return NextResponse.json(eventos);
		}
		// === Buscando todos os eventos === 
		else {
			console.log('Buscando todos os eventos'); 
			// Retorna todos os eventos se não houver título na URL
			const eventos = await prisma.evento.findMany();
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