import { NextResponse } from "next/server";
import prisma from "@/lib/prismaClient";
import nodemailer from "nodemailer";
import crypto from "crypto";

export async function POST(request: Request) {
  const { email } = await request.json();

  if (!email) {
    return NextResponse.json({ error: "E-mail é obrigatório" }, { status: 400 });
  }

  try {
    const user = await prisma.usuario.findUnique({ where: { email } });

    if (!user) {
      return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 });
    }

    const token = crypto.randomBytes(32).toString("hex");
    const expiration = new Date(Date.now() + 3600000); // 1 hora

    await prisma.usuario.update({
      where: { email },
      data: { resetToken: token, resetTokenExpires: expiration },
    });

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const resetLink = `${process.env.NEXTAUTH_URL}/reset-password?token=${token}`;
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Redefinição de Senha",
      text: `Clique no link para redefinir sua senha: ${resetLink}`,
    });

    return NextResponse.json({ message: "E-mail enviado com sucesso" });
  } catch (error) {
    console.error("Erro ao enviar e-mail:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
