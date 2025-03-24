/** @return { import("next-auth/adapters").Adapter } */

import { PrismaClient } from "@prisma/client/extension";

/*  Adaptador personlizado para interação do nextAuth
*   com o banco de dados
*   Documentação: https://next-auth.js.org/tutorials/creating-a-database-adapter#required-methods
*   
*   O auth não aceita utilizar diretamente o acesso ao prisma,
*   ele utiliza o "adaptador" como uma "interface", então
*   é necessario re-implementar as funções do adptador padrão.
* 
* */  

export default function AdaptadorPrisma(client: PrismaClient) {
  return {

    // recebe email, retorna usuario
    async getUserByEmail(email: String) {
      return await client.usuario.findUnique({
        where: { email: email },
      });
    },
    // recebe id, retorna usuario
    async getUser(id)  {
      const user = await client.usuario.findUnique({
        where: {
          id: Number(id),
        },
      })
      return user
    },

    // caso de primeiro acesso cai nesta
    // função caso não seja encontrado.
    async createUser(user){
      return
    }

    async updateUser(user) {
      return true;
    },

    // criação com falha?
    async createVerificationToken({ identifier, token, expires }) {
      return await client.verificationToken.create({
        data: { identifier, token, expires },
      });
    },
    // verificação com falha?
    async useVerificationToken({ identifier, token }) {
      const verificationToken = await client.verificationToken.findUnique({
        where: { identifier_token: { identifier, token } },
      });
    
      if (!verificationToken) return null;
    
      await client.verificationToken.delete({
        where: { identifier_token: { identifier, token } },
      });
    
      return verificationToken;
    },

    // Função para gerar o sessionToken e accessToken
    generateSessionToken() {
      return Math.random().toString(36).substr(2);
    },

    generateAccessToken() {
      return Math.random().toString(36).substr(2); 
    },

    // Implementação do createSession
    async createSession({ session, user }) {
      // Verifica se o usuário está presente
      if (!user) {
        throw new Error('Usuário não encontrado');
      }

      // Gerar tokens únicos para sessionToken e accessToken
      const sessionToken = this.generateSessionToken();
      const accessToken = this.generateAccessToken();

      // Criar a sessão no banco de dados
      const newSession = await client.session.create({
        data: {
          userId: user.id,
          expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 dias
          sessionToken: sessionToken,
          accessToken: accessToken,
        },
      });

      return newSession;
    },
  };
}
