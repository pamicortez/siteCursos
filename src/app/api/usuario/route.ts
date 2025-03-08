import { NextResponse } from 'next/server';
import prisma from '@/lib/prismaClient';
import { Prisma } from '@prisma/client';
import bcrypt from "bcryptjs";

// Método GET para retornar todos os usuários
export async function GET() {
  try {
    const usuarios = await prisma.usuario.findMany(); // Busca todos os usuários no banco
    return NextResponse.json(usuarios); // Retorna a resposta em formato JSON
  } catch (error) {
    console.error('Erro ao buscar usuários:', error);
    return NextResponse.error(); // Retorna um erro em caso de falha
  }
}

// Método POST para criar um novo usuário
export async function POST(request: Request) {
  try {
    const saltRounds = 10

    const data: Prisma.UsuarioCreateInput = await request.json(); // Pega os dados do corpo da requisição
    
    const email_unico = await prisma.usuario.findUnique( { where: { email: data.email } });
    if (email_unico){
      return NextResponse.json({error: 'Email já cadastrado'}, {status: 409})
    }

    const hashSenha = await bcrypt.hash(data.senha, saltRounds); // Encriptando a senha
    
    const novoUsuario = await prisma.usuario.create({
      data: {
        ...data, // Dados do usuário a serem criados
        senha: hashSenha,
      },
    });
    return NextResponse.json(novoUsuario, { status: 201 }); // Retorna o novo usuário com status 201
  } catch (error) {
    console.error('Erro ao criar usuário:', error);
    return NextResponse.error(); // Retorna um erro em caso de falha
  }
}

// Método para atualização de um atributo do usuário
export async function PATCH(request: Request) {
  try {
    const { id, atributo, novoValor } = await request.json();

    // Certificar que todos os dados foram passados
    if (!id || !atributo || novoValor === undefined) {
      return NextResponse.json({ error: "Todos os campos são obrigatórios" }, { status: 400 });
    }

    // Verifica se o usuário existe
	  const usuario = await prisma.usuario.findUnique({ where: { id: id } });
	  if (!usuario) {
		  return NextResponse.json({error: 'Usuário não encontrado'}, {status: 404})
	  }
    // Atributos que NÃO podem ser alterados
    const atributosFixos = ["id"];
    
    if (atributosFixos.includes(atributo)) {
      return NextResponse.json({ error: "Atributo não pode ser atualizaddo" }, { status: 400 });
    }

    let valorAtualizado = novoValor;

    // Criptografia para a senha e verificação de unicidade para o e-mail
    if (atributo === "senha") {
      const salt = await bcrypt.genSalt(10);
      valorAtualizado = await bcrypt.hash(novoValor, salt);
    } else if (atributo == "email"){
      const email_unico = await prisma.usuario.findUnique( { where: { email: novoValor } });
      if (email_unico){
        return NextResponse.json({error: 'Email já cadastrado'}, {status: 409})
      }
    }

    const usuarioAtualizado = await prisma.usuario.update({
      where: { id },
      data: { [atributo]: valorAtualizado },
    });

    return NextResponse.json(usuarioAtualizado, { status: 200 });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Erro ao atualizar usuário" }, { status: 500 });
  }
}