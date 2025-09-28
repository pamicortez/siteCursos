// prismaClient.ts - Versão corrigida que não conecta durante build
import { PrismaClient } from '@prisma/client';

// Declaração global para evitar múltiplas instâncias em desenvolvimento
declare global {
  var prisma: PrismaClient | undefined;
}

let prisma: PrismaClient;

// ✅ Função para verificar se deve conectar (evita conexão durante build)
function shouldConnect(): boolean {
  // Não conectar se:
  // 1. DATABASE_URL contém 'dummy' (durante build)
  // 2. Host é 'dummy-host' (durante build)
  // 3. Não tem DATABASE_URL definida
  const dbUrl = process.env.DATABASE_URL || '';
  
  if (dbUrl.includes('dummy') || dbUrl.includes('dummy-host') || !dbUrl) {
    return false;
  }
  
  return true;
}

// ✅ Criar instância do Prisma de forma segura
if (process.env.NODE_ENV === 'production') {
  // Em produção, criar nova instância sempre
  prisma = new PrismaClient();
} else {
  // Em desenvolvimento, reutilizar instância global se existir
  if (!global.prisma) {
    global.prisma = new PrismaClient();
  }
  prisma = global.prisma;
}

// ✅ Função para conectar de forma segura (só quando necessário)
async function connectSafely(): Promise<void> {
  if (!shouldConnect()) {
    console.log('🔄 Pulando conexão com banco (modo build ou teste)');
    return;
  }

  try {
    await prisma.$connect();
    console.log("✅ Conectado ao banco de dados com sucesso!");
  } catch (error) {
    console.error("❌ Erro ao conectar ao banco de dados:", error);
    // ⚠️ NÃO fazer process.exit() para não quebrar o build
  }
}

// ✅ Função para desconectar de forma segura
async function disconnectSafely(): Promise<void> {
  if (!shouldConnect()) {
    return;
  }

  try {
    await prisma.$disconnect();
    console.log("🔌 Desconectado do banco de dados");
  } catch (error) {
    console.error("⚠️ Erro ao desconectar:", error);
  }
}

// ✅ Conectar apenas se não estiver em modo build
if (shouldConnect()) {
  connectSafely();
}

// ✅ Limpar conexões quando a aplicação terminar (apenas em runtime)
if (shouldConnect()) {
  process.on('SIGINT', async () => {
    await disconnectSafely();
    process.exit(0);
  });

  process.on('SIGTERM', async () => {
    await disconnectSafely();
    process.exit(0);
  });
}

// Exporta o Prisma Client
export default prisma;