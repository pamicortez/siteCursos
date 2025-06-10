import CredentialsProvider from "next-auth/providers/credentials"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import prisma from "@/lib/prismaClient"
import bcrypt from "bcryptjs"
import type { NextAuthOptions } from "next-auth"

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Usuário", type: "text" },
        password: { label: "Senha", type: "password" },
      },
      async authorize(credentials) {
        const user = await prisma.usuario.findUnique({
          where: { email: credentials?.username },
        })

        if (user && bcrypt.compareSync(credentials?.password || "", user.senha)) {
          return { id: user.id.toString(), name: user.Nome, email: user.email }
        }

        return null
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id // coloca o id no token
      }
      return token
    },
    async session({ session, token }) {
      if (token?.id) {
        session.user.id = token.id // coloca o id na sessão
      }
      return session
    },
  },
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
}
