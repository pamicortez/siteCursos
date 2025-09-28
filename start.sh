#!/bin/sh

echo "🚀 Iniciando aplicação Next.js..."

# Função para testar conexão com PostgreSQL
wait_for_postgres() {
    echo "⏳ Aguardando PostgreSQL estar pronto..."
    
    # Extrair dados da DATABASE_URL
    DB_HOST=$(echo $DATABASE_URL | sed -n 's/.*@\([^:]*\):.*/\1/p')
    DB_PORT=$(echo $DATABASE_URL | sed -n 's/.*:\([0-9]*\)\/.*/\1/p')
    
    if [ -z "$DB_HOST" ] || [ -z "$DB_PORT" ]; then
        echo "⚠️ Não foi possível extrair host/porta do DATABASE_URL"
        DB_HOST="postgres"
        DB_PORT="5432"
    fi
    
    echo "📡 Testando conexão com $DB_HOST:$DB_PORT..."
    
    for i in $(seq 1 30); do
        if nc -z $DB_HOST $DB_PORT 2>/dev/null; then
            echo "✅ PostgreSQL está pronto!"
            return 0
        fi
        echo "⏳ Tentativa $i/30 - PostgreSQL ainda não está pronto..."
        sleep 2
    done
    
    echo "❌ PostgreSQL não respondeu após 60 segundos"
    return 1
}

# Aguardar PostgreSQL
wait_for_postgres || {
    echo "⚠️ Continuando sem conexão com PostgreSQL..."
}

# Verificar se o Prisma Client já está gerado
if [ ! -d "node_modules/.prisma" ]; then
    echo "🔧 Gerando cliente Prisma..."
    npx prisma generate
fi

# Executar migrações do Prisma
echo "🔄 Executando migrações..."
npx prisma migrate deploy || {
    echo "⚠️ Falha ao executar migrações, continuando..."
}

# Opcional: Seed do banco (apenas se explicitamente solicitado)
if [ "$RUN_SEED" = "true" ]; then
    echo "🌱 Executando seed..."
    npm run seed 2>/dev/null || echo "Sem arquivo de seed encontrado"
fi

# Iniciar aplicação - usar standalone se disponível
echo "▶️ Iniciando servidor..."
if [ -f "server.js" ]; then
    echo "📦 Usando build standalone..."
    exec node server.js
elif [ -f ".next/standalone/server.js" ]; then
    echo "📦 Usando build standalone (.next/standalone)..."
    exec node .next/standalone/server.js
else
    echo "🔄 Fallback para npm start..."
    exec npm start
fi