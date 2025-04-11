import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "@/lib/prismaClient";
import bcrypt from "bcryptjs";
import NextAuth from "next-auth";

const handler = NextAuth( {
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
                });

                if (user && bcrypt.compareSync(credentials?.password || "", user.senha)) {
                    return { id: user.id.toString(), name: user.Nome, email: user.email };
                }

                return null;
            },
        }),
    ],
    session: {
        strategy: "jwt",
    },
    pages: {
        signIn: "/login",
    },
});

export { handler as GET, handler as POST };
