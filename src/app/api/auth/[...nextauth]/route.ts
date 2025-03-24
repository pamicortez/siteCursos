import NextAuth from "next-auth"
import AdaptadorPrisma from "@/adapters/dbAdapter";
import prisma from "@/lib/prismaClient";
import EmailProvider from "next-auth/providers/email";
import { randomBytes, randomUUID } from "crypto";

/* 
*   Documentação: https://authjs.dev/getting-started
*   Arquivo de configuração do serviço de autenticação
* 
*   teste o login com: http://localhost:3000/api/auth/signin
* */


// Configuracao da autenticacao
const handler = NextAuth({

    // adaptador, "interface de comunicação" padrão com o BD
    // pré requisito para o NextAuth
    adapter: AdaptadorPrisma(prisma),
    session: {
        strategy: "jwt", // Mantendo a autenticação JWT
        maxAge: 30 * 24 * 60 * 60, // 30 days
        generateSessionToken: () => {
            return randomUUID?.() ?? randomBytes(32).toString("hex")
        },
    },

    // serviço que será utilizado para realizar a autenticação
    providers: [
        // provedor de email, recomendo o 'mailtrap' para testes.
        EmailProvider({
            server: {
                host: process.env.EMAIL_SERVER_HOST,
                port: process.env.EMAIL_SERVER_PORT,
                auth: {
                    user: process.env.EMAIL_SERVER_USER,
                    pass: process.env.EMAIL_SERVER_PASSWORD,
                },
            },
            from: process.env.EMAIL_FROM,
        }),
    ],
    // paginas padrões do auth, substituir ao integrar
    // Documentação: https://next-auth.js.org/configuration/pages
    pages: {
        // signIn: '/auth/signin', Pagina de login
        // signOut: '/auth/signout', Pagina de logout
        // error: '/auth/error',    Pagina de erro de autenticação
        // verifyRequest: '/auth/verify-request', 
        // newUser: '/auth/new-user' 
    },
    // callbacks: Personalizam o fluxo de autenticação,
    // modificar a signIn para impedir login sem conta.
    callbacks: {
        
        async signIn({ user, account, profile, email, credentials }) {
            return true
        },
        async redirect({ url, baseUrl }) {
            return baseUrl
        },
        async session({ session, user, token }) {
            return session
        },
        async jwt({ token, user, account, profile, isNewUser }) {
            return token
        }
    }
});

export { handler as GET, handler as POST }
