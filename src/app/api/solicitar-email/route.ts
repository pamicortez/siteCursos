import { NextResponse } from "next/server";
import { PrismaClient } from '@prisma/client';
import { randomInt } from 'crypto';
import nodemailer from 'nodemailer';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const { email } = await req.json();

  const code = randomInt(100000, 999999).toString();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // Expira em 10 min

  const email_unico = await prisma.usuario.findUnique( { where: { email: email } });
  if (email_unico){
      return NextResponse.json({error: 'Email já cadastrado'}, {status: 409})
    }
  
  await prisma.emailVerificationCode.deleteMany({
    where: {
      email: email,
    },
  });
  
  await prisma.emailVerificationCode.create({
    data: {
      email,
      code,
      expiresAt,
    },
  });

  const transporter = nodemailer.createTransport({
    service: 'gmail', 
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  await transporter.sendMail({
    from: process.env.EMAIL,
    to: email,
    subject: 'Seu código de verificação',
    text: `Seu código de verificação é: ${code}`,
  });

  return new Response(JSON.stringify({ message: 'Código enviado com sucesso.' }), { status: 200 });
}