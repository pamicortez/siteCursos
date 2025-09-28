import { type NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import prisma from "@/lib/prismaClient"

export const dynamic = "force-dynamic";


export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    const {
      Nome,
      email,
      password,
      Titulacao,
      instituicaoEnsino,
      formacaoAcademica,
      resumoPessoal,
      fotoPerfil,
      links,
      publicacoes,
      carreira,
    } = data

    // Validações básicas
    if (!Nome || !email || !password) {
      return NextResponse.json({ error: "Nome, email e senha são obrigatórios" }, { status: 400 })
    }

    if (password.length < 8) {
      return NextResponse.json({ error: "Senha deve ter pelo menos 8 caracteres" }, { status: 400 })
    }

    // Validar formato do email
    const emailRegex = /\S+@\S+\.\S+/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Email inválido" }, { status: 400 })
    }

    // Verificar se o usuário já existe
    const existingUser = await prisma.usuario.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json({ error: "Usuário já existe com este email" }, { status: 409 })
    }

    // Criptografar a senha
    const hashedPassword = await bcrypt.hash(password, 12)

    // Criar o usuário no banco de dados
    const newUser = await prisma.usuario.create({
      data: {
        Nome,
        email,
        senha: hashedPassword,
        fotoPerfil: fotoPerfil || "",
        Titulacao: Titulacao || "Bacharel",
        instituicaoEnsino: instituicaoEnsino || "",
        formacaoAcademica: formacaoAcademica || "",
        resumoPessoal: resumoPessoal || "",
        // Se houver links, criar os registros relacionados
        ...(links &&
          links.length > 0 && {
            link: {
              create: links.map((linkItem: { tipo: string; link: string }) => ({
                tipo: linkItem.tipo,
                link: linkItem.link,
              })),
            },
          }),
        // Se houver publicações, criar os registros relacionados
        ...(publicacoes &&
          publicacoes.length > 0 && {
            publicacao: {
              create: publicacoes.map((pub: { descricao: string; link: string }) => ({
                descricao: pub.descricao,
                link: pub.link,
              })),
            },
          }),
        // Se houver experiências de carreira, criar os registros relacionados
        ...(carreira &&
          carreira.length > 0 && {
            carreira: {
              create: carreira.map(
                (exp: {
                  nome: string
                  descricao: string
                  categoria: string
                  dataInicio: string
                  dataFim: string
                }) => ({
                  nome: exp.nome,
                  descricao: exp.descricao,
                  categoria: exp.categoria,
                  dataInicio: exp.dataInicio ? new Date(exp.dataInicio) : new Date(),
                  dataFim: exp.dataFim ? new Date(exp.dataFim) : new Date(),
                }),
              ),
            },
          }),
      },
      select: {
        id: true,
        Nome: true,
        email: true,
        Titulacao: true,
        instituicaoEnsino: true,
        formacaoAcademica: true,
        createdAt: true,
      },
    })

    return NextResponse.json(
      {
        message: "Usuário criado com sucesso",
        user: newUser,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Erro ao criar usuário:", error)

    // Verificar se é erro de constraint unique do Prisma
    if (error instanceof Error && error.message.includes("Unique constraint")) {
      return NextResponse.json({ error: "Usuário já existe com este email" }, { status: 409 })
    }

    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
