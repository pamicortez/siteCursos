import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth-config"
import prisma from "@/lib/prismaClient"
import bcrypt from "bcryptjs"

export const dynamic = "force-dynamic";


// Interface para os dados recebidos na requisição
interface EditarUsuarioRequest {
  // Dados básicos do usuário
  Nome?: string
  email?: string
  senha?: string
  Titulacao?: string
  instituicaoEnsino?: string
  formacaoAcademica?: string
  resumoPessoal?: string
  fotoPerfil?: string

  // Arrays relacionados
  links?: Array<{
    id?: number
    tipo: string
    link: string
  }>

  publicacoes?: Array<{
    id?: number
    descricao: string
    link: string
  }>

  carreira?: Array<{
    id?: number
    nome: string
    descricao: string
    categoria: string
    dataInicio: string
    dataFim: string
  }>
}

// Função para validar dados de entrada
function validarDados(dados: EditarUsuarioRequest): string | null {
  // Validar email se fornecido
  if (dados.email !== undefined) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(dados.email)) {
      return "Email inválido"
    }
  }

  // Validar senha se fornecida
  if (dados.senha !== undefined) {
    if (dados.senha.length < 6) {
      return "Senha deve ter pelo menos 6 caracteres"
    }
  }

  // Validar links se fornecidos
  if (dados.links !== undefined) {
    for (const link of dados.links) {
      if (!link.tipo || !link.link) {
        return "Todos os links devem ter tipo e URL"
      }
      // Validar URL básica
      try {
        new URL(link.link)
      } catch {
        return "URL de link inválida"
      }
    }
  }

  // Validar publicações se fornecidas
  if (dados.publicacoes !== undefined) {
    for (const pub of dados.publicacoes) {
      if (!pub.descricao || !pub.link) {
        return "Todas as publicações devem ter descrição e link"
      }
      // Validar URL básica
      try {
        new URL(pub.link)
      } catch {
        return "URL de publicação inválida"
      }
    }
  }

  // Validar carreira se fornecida
  if (dados.carreira !== undefined) {
    for (const exp of dados.carreira) {
      if (!exp.nome || !exp.descricao || !exp.categoria || !exp.dataInicio || !exp.dataFim) {
        return "Todos os campos de carreira são obrigatórios"
      }

      // Validar datas
      const dataInicio = new Date(exp.dataInicio)
      const dataFim = new Date(exp.dataFim)

      if (isNaN(dataInicio.getTime()) || isNaN(dataFim.getTime())) {
        return "Datas de carreira inválidas"
      }

      if (dataInicio > dataFim) {
        return "Data de início não pode ser posterior à data de fim"
      }
    }
  }

  return null
}

export async function POST(request: Request) {
  try {
    // 1. Verificar autenticação usando as opções corretas do NextAuth
    const session = await getServerSession(authOptions)

    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    // 2. Extrair o ID do usuário da URL
    const { searchParams } = new URL(request.url)
    const id = Number(searchParams.get("id"))

    if (!id || isNaN(id)) {
      return NextResponse.json({ error: "ID de usuário inválido ou não fornecido" }, { status: 400 })
    }

    // 3. Verificar autorização - usuário só pode editar seu próprio perfil
    const sessionUserId = Number(session.user.id)
    if (sessionUserId !== id) {
      return NextResponse.json({ error: "Acesso negado" }, { status: 403 })
    }

    // 4. Verificar se o usuário existe
    const usuarioExistente = await prisma.usuario.findUnique({
      where: { id },
      include: {
        link: true,
        publicacao: true,
        carreira: true,
      },
    })

    if (!usuarioExistente) {
      return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 })
    }

    // 5. Obter e validar os dados da requisição
    let dados: EditarUsuarioRequest

    try {
      dados = await request.json()
    } catch (error) {
      return NextResponse.json({ error: "Dados JSON inválidos" }, { status: 400 })
    }

    // 6. Validar dados de entrada
    const erroValidacao = validarDados(dados)
    if (erroValidacao) {
      return NextResponse.json({ error: erroValidacao }, { status: 400 })
    }

    // 7. Preparar os dados básicos do usuário para atualização
    const dadosBasicos: any = {}

    // Copiar apenas os campos fornecidos (sanitização)
    if (dados.Nome !== undefined) dadosBasicos.Nome = dados.Nome.trim()
    if (dados.Titulacao !== undefined) dadosBasicos.Titulacao = dados.Titulacao.trim()
    if (dados.instituicaoEnsino !== undefined) dadosBasicos.instituicaoEnsino = dados.instituicaoEnsino.trim()
    if (dados.formacaoAcademica !== undefined) dadosBasicos.formacaoAcademica = dados.formacaoAcademica.trim()
    if (dados.resumoPessoal !== undefined) dadosBasicos.resumoPessoal = dados.resumoPessoal.trim()
    if (dados.fotoPerfil !== undefined) dadosBasicos.fotoPerfil = dados.fotoPerfil.trim()

    // 8. Verificar se o email está sendo alterado e se já existe
    if (dados.email !== undefined && dados.email !== usuarioExistente.email) {
      const emailNormalizado = dados.email.toLowerCase().trim()

      const emailExistente = await prisma.usuario.findUnique({
        where: { email: emailNormalizado },
      })

      if (emailExistente && emailExistente.id !== id) {
        return NextResponse.json({ error: "Email já está em uso por outro usuário" }, { status: 409 })
      }

      dadosBasicos.email = emailNormalizado
    }

    // 9. Se a senha foi fornecida, fazer o hash
    if (dados.senha) {
      const salt = await bcrypt.genSalt(12) // Aumentar força do salt
      dadosBasicos.senha = await bcrypt.hash(dados.senha, salt)
    }

    // 10. Usar uma transação para garantir que todas as operações sejam concluídas com sucesso
    const usuarioAtualizado = await prisma.$transaction(async (tx) => {
      // 1. Atualizar os dados básicos do usuário
      const usuario = await tx.usuario.update({
        where: { id },
        data: dadosBasicos,
      })

      // 2. Gerenciar links (deletar existentes e criar novos)
      if (dados.links !== undefined) {
        // Deletar todos os links existentes
        await tx.link.deleteMany({
          where: { idUsuario: id },
        })

        // Criar novos links (com sanitização)
        if (dados.links.length > 0) {
          await tx.link.createMany({
            data: dados.links.map((link) => ({
              link: link.link.trim(),
              tipo: link.tipo.trim() as any,
              idUsuario: id,
            })),
          })
        }
      }

      // 3. Gerenciar publicações (deletar existentes e criar novas)
      if (dados.publicacoes !== undefined) {
        // Deletar todas as publicações existentes
        await tx.publicacao.deleteMany({
          where: { idUsuario: id },
        })

        // Criar novas publicações (com sanitização)
        if (dados.publicacoes.length > 0) {
          await tx.publicacao.createMany({
            data: dados.publicacoes.map((pub) => ({
              descricao: pub.descricao.trim(),
              link: pub.link.trim(),
              idUsuario: id,
            })),
          })
        }
      }

      // 4. Gerenciar carreira (deletar existentes e criar novas)
      if (dados.carreira !== undefined) {
        // Deletar todos os registros de carreira existentes
        await tx.carreira.deleteMany({
          where: { idUsuario: id },
        })

        // Criar novos registros de carreira (com sanitização)
        if (dados.carreira.length > 0) {
          await tx.carreira.createMany({
            data: dados.carreira.map((exp) => ({
              nome: exp.nome.trim(),
              descricao: exp.descricao.trim(),
              categoria: exp.categoria.trim() as any,
              dataInicio: new Date(exp.dataInicio),
              dataFim: new Date(exp.dataFim),
              idUsuario: id,
            })),
          })
        }
      }

      // Retornar o usuário atualizado com todos os relacionamentos
      return await tx.usuario.findUnique({
        where: { id },
        include: {
          link: true,
          publicacao: true,
          carreira: true,
        },
      })
    })

    // 11. Remover dados sensíveis antes de retornar
    const { senha, ...usuarioSemSenha } = usuarioAtualizado || {}

    return NextResponse.json(usuarioSemSenha, { status: 200 })
  } catch (error) {
    console.error("Erro ao atualizar usuário:", error)

    // Não expor detalhes do erro em produção
    if (process.env.NODE_ENV === "production") {
      return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
    }

    return NextResponse.json({ error: "Erro ao atualizar usuário" }, { status: 500 })
  }
}
