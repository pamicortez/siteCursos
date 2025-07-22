# Obtendo o hash do projeto
## Baixando o projeto
```bash
git clone https://github.com/pamicortez/siteCursos.git
cd siteCursos
```
## Zipando o projeto
```bash
zip -r siteCursos.zip . -x ".git" -x "node_modules/* *" -x "docker-compose.yml" -x ".env" -x "README.prod.md" -x "Dockerfile" -x "README.md"
```
## Gerando o hash de todo o projeto em um arquivo de saída
```bash
sha256sum siteCursos.zip > hash.txt
```

# 🚀 Deploy Site Cursos - Passo a Passo

## Pré-requisitos
- Node.js 20+
- PostgreSQL ou Docker
- Git

## Passo 1: Clone o projeto - Se já não tiver clonado
```bash
git clone https://github.com/pamicortez/siteCursos.git
cd siteCursos
```

## Passo 2: Configure o arquivo .env
Crie um arquivo `.env` na raiz do projeto:

```bash
# Banco de dados
DATABASE_URL="postgresql://usuario:senha@localhost:5432/sitecursos"

# Autenticação
NEXTAUTH_URL="https://seudominio.com"
NEXTAUTH_SECRET="chave_secreta_gerada"

# Email (para recuperação de senha)
EMAIL="uefscursos@gmail.com"
EMAIL_PASSWORD="senha_de_app_gmail"

# Ambiente
NODE_ENV="production"
```

### Como preencher:
- **DATABASE_URL**: Substitua `usuario`, `senha`, `localhost` e `sitecursos` pelo nome do banco de dados do seu PostgreSQL
- **NEXTAUTH_URL**: Coloque o domínio onde vai rodar (ex: https://meusite.com)
- **NEXTAUTH_SECRET**: Gere uma chave com: `openssl rand -base64 32`
- **EMAIL**: Email que vai enviar as recuperações de senha
- **EMAIL_PASSWORD**: Senha de app do Gmail (não a senha normal)


## Alternativa: Docker (mais fácil)

Se preferir usar Docker:

```bash
# Clone o projeto
git clone https://github.com/pamicortez/siteCursos.git
cd siteCursos

# Crie o .env (mesmo do passo 2)

# Suba tudo
docker-compose up -d --build

# Configure o banco
docker-compose exec nextjs npx prisma migrate deploy
docker-compose exec nextjs npx prisma generate
docker-compose exec nextjs npm run seed
```

**🎉 Projeto configurado com sucesso!**

Acesse: `https://seudominio.com`