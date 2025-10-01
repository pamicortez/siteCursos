# ---------- STAGE 1: Builder ----------
    FROM node:20-alpine AS builder
    WORKDIR /app
    
    # Copia dependências
    COPY package.json package-lock.json* ./
    RUN npm install
    
    # Copia restante do código
    COPY . .
    
    # Gera Prisma Client sem precisar do banco
    RUN npx prisma generate
    
    # Build Next.js ignorando validação de DATABASE_URL
    ENV NEXT_SKIP_ENV_VALIDATION=1
    RUN npm run build
    
# ---------- STAGE 2: Runtime ----------
    FROM node:20-alpine AS runner
    WORKDIR /app
    
    COPY --from=builder /app/package*.json ./
    COPY --from=builder /app/node_modules ./node_modules
    COPY --from=builder /app/.next ./.next
    COPY --from=builder /app/prisma ./prisma   
    COPY --from=builder /app/public ./public  
    
    EXPOSE 3000
    
    CMD ["sh", "-c", "npx prisma migrate deploy && npm start"]


    


    