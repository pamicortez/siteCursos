// Importa o PrismaClient da biblioteca @prisma/client
import { PrismaClient } from '@prisma/client';

// Inicializa uma instância do PrismaClient
const prisma = new PrismaClient();

// Realiza a conexão com o banco de dados quando a aplicação for iniciada
async function main() {
  try {
    // Verifica se a conexão está funcionando
    await prisma.$connect();
    console.log("Conectado ao banco de dados com sucesso!");
  } catch (e) {
    console.error("Erro ao conectar ao banco de dados:", e);
    process.exit(1); // Finaliza a aplicação em caso de erro na conexão
  }
}

// Chama a função main para a execução inicial
main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    // Fecha a conexão com o banco quando o processo terminar
    await prisma.$disconnect();
  });

// Exporta o Prisma Client para ser usado em outros arquivos
export default prisma;
