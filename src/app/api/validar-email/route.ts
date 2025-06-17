import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const { email, code } = await req.json();

  const record = await prisma.emailVerificationCode.findFirst({
    where: {
      email,
      code,
      expiresAt: { gte: new Date() },        // Código ainda válido
      verifiedAt: null,                      // Ainda não foi usado
    },
  });

  if (!record) {
    return new Response(JSON.stringify({ message: 'Código inválido ou expirado.' }), { status: 400 });
  }

  // Marca como verificado
  await prisma.emailVerificationCode.update({
    where: { id: record.id },
    data: {
      verifiedAt: new Date(),
    },
  });

  // Aqui você também pode marcar o e-mail como verificado na tabela de usuários, se tiver uma.

  return new Response(JSON.stringify({ message: 'E-mail verificado com sucesso.' }), { status: 200 });
}
