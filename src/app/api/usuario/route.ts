import { NextResponse } from 'next/server';
import prisma from '@/lib/prismaClient';
import { Prisma } from '@prisma/client';
import { tipoUser } from '@prisma/client';
import bcrypt from "bcryptjs";

// Método GET para retornar todos os usuários
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
	const id = searchParams.get('id');
  const nome = searchParams.get('nome');
  const ordem = searchParams.get('ordem');
  const formacaoAcademica = searchParams.get('formacaoAcademica');
  const tipo = searchParams.get('tipo');
  //const tipoUserEnum = tipo as tipoUser; // Conversão segura para o enum tipoUser

  try {
    // ====== obtem um usuário específico
    if (id) {
      const usuario = await prisma.usuario.findUnique({
        where: { 
          id: Number(id)
          , deletedAt: null
          , tipo: { in: ['Super', 'Normal'] }  },
        include: {
          link: true,
          publicacao: true,
          eventoUsuario: { include: { evento: true } },
          cursoUsuario: { include: { curso: true } },
          carreira: true
        },
        
      });
      return NextResponse.json(usuario); // Retorna a resposta em formato JSON
    }
    // ===== Obtem usuários por tipo
    else if (tipo) {
      const usuario = await prisma.usuario.findMany({
        where: {       
          tipo: tipo === 'Ativo' ? { in: ['Super', 'Normal'] } : tipo as tipoUser // Verifica se o tipo é 'Ativo' e busca por 'Super' ou 'Normal', caso contrário, busca pelo tipo específico
          , deletedAt: null, Nome: nome? {contains: nome, mode: 'insensitive'} : undefined },
        include: {
          link: true,
          publicacao: true,
          eventoUsuario: { include: { evento: true } },
          cursoUsuario: { include: { curso: true } },
          carreira: true
        },
        orderBy: ordem==='recente' ? {createdAt: 'desc'}: {Nome: 'asc'}
      });
      return NextResponse.json(usuario); // Retorna a resposta em formato JSON
    }
    // ====== Obtem usuários por formacaoAcademica
    else if (formacaoAcademica){
      const usuario = await prisma.usuario.findMany({
        where: { formacaoAcademica: 
          {
          contains: formacaoAcademica, // nomeBusca é o parâmetro de entrada, pode ser uma string com parte do nome
          mode: 'insensitive',  // Ignora a diferença entre maiúsculas e minúsculas
          },
          deletedAt: null,
          Nome: nome? {contains: nome, mode: 'insensitive'} : undefined
          , tipo: { in: ['Super', 'Normal'] } 
        },
        include: {
          link: true,
          publicacao: true,
          eventoUsuario: { include: { evento: true } },
          cursoUsuario: { include: { curso: true } },
          carreira: true
        },
        orderBy: ordem==='recente' ? {createdAt: 'desc'}: {Nome: 'asc'}
      });
      return NextResponse.json(usuario); // Retorna a resposta em formato
    }
    else if (nome) {
      const usuario = await prisma.usuario.findMany({
        where: { Nome: {contains: nome, mode: 'insensitive'},
          deletedAt: null
          , tipo: { in: ['Super', 'Normal'] } 
        },
        include: {
          link: true,
          publicacao: true,
          eventoUsuario: { include: { evento: true } },
          cursoUsuario: { include: { curso: true } },
          carreira: true
        },
        orderBy: ordem==='recente' ? {createdAt: 'desc'}: {Nome: 'asc'}
      });
      return NextResponse.json(usuario); // Retorna a resposta em formato

    }
    // ====== Obtem todos os usuários
    else{
      const usuarios = await prisma.usuario.findMany({
        where: { deletedAt: null },        
        include: {
        link: true,
        publicacao: true,
        eventoUsuario: { include: { evento: true } },
        cursoUsuario: { include: { curso: true } },
        carreira: true
      },
      orderBy: ordem==='recente' ? {createdAt: 'desc'}: {Nome: 'asc'}
    });
      return NextResponse.json(usuarios); // Retorna a resposta em formato JSON
    }
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

    const { email, senha, id, ...respUsuario } = novoUsuario;
    return NextResponse.json(respUsuario, { status: 201 }); // Retorna o novo usuário com status 201
  } catch (error) {
    console.error('Erro ao criar usuário:', error);
    return NextResponse.error(); // Retorna um erro em caso de falha
  }
}

   // Método para atualização dos atributos do usuario
export async function PATCH(request: Request) {
    try {
      const { searchParams } = new URL(request.url);
      const id = Number(searchParams.get('id')); // ID do usuario
  
      const atualizacoes = await request.json();
    
      // Verifica se o usuario existe
      const usuario = await prisma.usuario.findUnique({ where: { id: id } });
      if (!usuario) {
        return NextResponse.json({error: 'Usuario não encontrado'}, {status: 404})
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

      if (atualizacoes["senha"]){
        const salt = await bcrypt.genSalt(10);
        atualizacoes['senha'] = await bcrypt.hash(atualizacoes['senha'], salt);
      }
      
      if (atualizacoes["email"]){
        const email_unico = await prisma.usuario.findUnique( { where: { email: atualizacoes['email'] } });
        if (email_unico && email_unico.id !== id){
          return NextResponse.json({error: 'Email já cadastrado'}, {status: 409})
        }
      }

      const usuarioAtualizado = await prisma.usuario.update({
      where: { id },
      data: atualizacoes,
      });
    
      return NextResponse.json(usuarioAtualizado, { status: 200 });
    
    } catch (error) {
      console.error(error);
      return NextResponse.json({ error: "Erro ao atualizar usuario" }, { status: 500 });
    }
}


// Método DELETE para marcar um usuário como deletado
export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id || isNaN(Number(id))) {
    return NextResponse.json({ error: "ID inválido" }, { status: 400 });
  }

  try {
    // Verifica se o usuário existe antes de tentar atualizá-lo
    const usuario = await prisma.usuario.findUnique({
      where: { id: Number(id) },
    });

    if (!usuario) {
      return NextResponse.json(
        { error: "Usuário não encontrado" },
        { status: 404 }
      );
    }
    // Se o uauário existe, marca como deletado e marcar o Curso, Aula, Evento e Publicação como deletados também
    await prisma.cursoUsuario.updateMany({
      where: { idUsuario: Number(id) },
      data: { deletedAt: new Date() },
    });
    await prisma.eventoUsuario.updateMany({
      where: { idUsuario: Number(id) },
      data: { deletedAt: new Date() },
    });
    await prisma.publicacao.updateMany({
      where: { idUsuario: Number(id) },
      data: { deletedAt: new Date() },
    });
    await prisma.curso.updateMany({
      where: { cursoUsuario: { some: { idUsuario: Number(id) } } },
      data: { deletedAt: new Date() },
    });
    await prisma.evento.updateMany({
      where: { eventoUsuario: { some: { idUsuario: Number(id) } }
      },
      data: { deletedAt: new Date() },
    });
    await prisma.carreira.updateMany({
      where: { idUsuario: Number(id) },
      data: { deletedAt: new Date() },
    });
    await prisma.link.updateMany({
      where: { idUsuario: Number(id) },
      data: { deletedAt: new Date() },
    });
    // Atualiza o campo deletedAt com a data e hora atual
    await prisma.usuario.update({
      where: { id: Number(id) },
      data: { deletedAt: new Date() },
    });

    return NextResponse.json(
      { message: "Usuário marcado como deletado com sucesso" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erro ao marcar usuário como deletado:", error);
    return NextResponse.json(
      { error: "Erro ao marcar usuário como deletado" },
      { status: 500 }
    );
  }
}
