import { NextResponse } from "next/server";
import prisma from "@/lib/prismaClient";
import bcrypt from "bcryptjs";

export const dynamic = "force-dynamic";


export async function POST(request: Request) {
  const { token, newPassword } = await request.json();

  if (!token || !newPassword) {
    return NextResponse.json({ error: "Token e nova senha são obrigatórios" }, { status: 400 });
  }

  try {
    const user = await prisma.usuario.findFirst({
      where: { resetToken: token, resetTokenExpires: { gt: new Date() } },
    });

    if (!user) {
      return NextResponse.json({ error: "Token inválido ou expirado" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.usuario.update({
      where: { id: user.id },
      data: { senha: hashedPassword, resetToken: null, resetTokenExpires: null },
    });

    return NextResponse.json({ message: "Senha redefinida com sucesso" });
  } catch (error) {
    console.error("Erro ao redefinir senha:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
