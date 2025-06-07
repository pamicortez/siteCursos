
<img width=100% src="https://capsule-render.vercel.app/api?type=waving&color=3B6790&height=120&section=header"/>

<h1 align="center">EXA 622 - 2025.1 | Site de Cursos</h1>

<div align="center">  
  <img width=40% src="http://img.shields.io/static/v1?label=STATUS&message=EM%20DESENVOLVIMENTO&color=EFB036&style=for-the-badge"/>
</div>

## Objetivo do Projeto

Este é um projeto [Next.js](https://nextjs.org) iniciado com [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## 🛠 Tecnologias

1. **Next.js**
2. **React.js**
3. **JavaScript/TypeScript**
4. **Vercel**
5. **PostgreSQL**

## 🚀 Instalação do PostgreSQL

### Windows
1. Acesse: https://www.postgresql.org/download/windows/
2. Baixe e execute o instalador.
3. Siga os passos:
   - Defina uma senha para o usuário `postgres`.
   - Porta padrão: `5432`.
4. Finalize e utilize o pgAdmin ou o terminal `psql`.

### MacOS (com Homebrew)
```bash
brew update
brew install postgresql
brew services start postgresql
psql --version
```

### Linux (Ubuntu/Debian)
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

---

## 🎯 Comandos básicos
### Acessar o PostgreSQL
```bash
psql -U postgres
```

### Criar um banco de dados
```sql
CREATE DATABASE nome_do_banco;
```

### Criar um usuário
```sql
CREATE USER nome_com_senha WITH PASSWORD 'senha';
```

### Dar permissões
```sql
GRANT ALL PRIVILEGES ON DATABASE nome_do_banco TO nome_com_senha;
```

---

## 💻 Instruções para Rodar o Projeto Localmente

Siga os passos abaixo para rodar o projeto em sua máquina local.

1. **Clone o repositório para sua máquina local. Em seguida crie o arquivo ".env"**  
   Abra o terminal e execute os comandos abaixo:
   ```bash
   git clone https://github.com/pamicortez/siteCursos.git
   cd siteCursos
   ```

   Nessa pasta crie um arquivo ".env" manualmente com o seguinte conteúdo (substitua "senha" pela sua senha do Postgres):
   ```bash
   DATABASE_URL="postgresql://postgres:senha@localhost:5432/siteCursos"
   NEXTAUTH_SECRET="sua_chave_secreta_aqui"
   ```

   Para gerar a chave secreta do NEXTAUTH_SECRET, execute:
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
   ```
   Copie o resultado e substitua "sua_chave_secreta_aqui" pela chave gerada.

   Ou faça isso por linha de comando usando (Linux, Mac e Git Bash (Windows)):
   ```bash
   echo 'DATABASE_URL="postgresql://postgres:senha@localhost:5432/siteCursos"' > .env
   echo 'NEXTAUTH_SECRET="'$(node -e "console.log(require('crypto').randomBytes(32).toString('base64'))")'"' >> .env
   ```

   Ou no Windows (Prompt de Comando — CMD):
   ```bash
   echo DATABASE_URL="postgresql://postgres:senha@localhost:5432/siteCursos" > .env
   echo NEXTAUTH_SECRET="sua_chave_secreta_aqui" >> .env
   ```
   Para Windows, execute separadamente o comando de geração da chave:
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
   ```
   E substitua "sua_chave_secreta_aqui" pela chave gerada.
   

2. **Instale as dependências**  
    Execute o seguinte comando:

    ```sh
    npm install
    ```

3. **Inicie o banco de dados**  
    Para aplicar as alterações no banco de dados, utilize os seguintes comandos:

    ```sh
    npx prisma migrate dev 
    ```

    Para gerar o cliente Prisma:

    ```sh
    npx prisma generate
    ```

    Caso queira resetar os dados de testes anteriores no seu banco de dados, caso contrário, pule essa etapa.
    (**CUIDADO: isso irá apagar todos os dados do seu banco de dados local**):

    ```sh
    npx prisma migrate reset
    ```

    Para visualizar o banco de dados com Prisma Studio:

    ```sh
    npx prisma studio
    ```
4. **Popule o banco de dados**  
   Execute o seguinte comando:
   ```bash
   node .\prisma\expanded-seed.js
   ```

5. **Inicie o servidor de desenvolvimento**  
   Execute um dos seguintes comandos:
   ```bash
   npm run dev
   ```
   #### ou
   ```bash
   yarn dev
   ```
   #### ou
   ```bash
   pnpm dev
   ```
   #### ou
   ```bash
   bun dev
   ```

6. **Abra no navegador**  
   Acesse [http://localhost:3000](http://localhost:3000) para visualizar o Projeto.

7. **Abra no navegador**  
   Acesse [http://localhost:5555/](http://localhost:5555/) para visualizar o Banco de Dados com Prisma Studio.

## 🔧 Funcionalidades Implementadas

- Hot Reload para atualização automática ao editar `app/page.tsx`.
- Otimização de fontes com [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts).
- Estrutura modular para desenvolvimento eficiente.

## 📚 Recursos para Aprendizado

Para saber mais sobre Next.js, consulte os seguintes recursos:

- 📖 [Documentação Next.js](https://nextjs.org/docs)
- 🎓 [Tutorial Interativo Next.js](https://nextjs.org/learn)
- 🛠️ [Repositório do Next.js no GitHub](https://github.com/vercel/next.js)

## 🚀 Deploy na Vercel

A maneira mais fácil de implantar seu projeto Next.js é através da [Plataforma Vercel](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme), criada pelos desenvolvedores do Next.js.

Consulte a [documentação de deploy](https://nextjs.org/docs/app/building-your-application/deploying) para mais detalhes.

## 💻 Desenvolvedores
 
<table>
  <tr>

<td align="center"><a href="https://github.com/alexsami-lopes" target="_blank"><img style="" src="https://avatars.githubusercontent.com/u/103523809?v=4" width="100px;" alt=""/><br /><sub><b> Alexsami Lopes </b></sub></a><br />👨🏻‍💻</a></td>
<td align="center"><a href="https://github.com/clsf" target="_blank"><img style="" src="https://avatars.githubusercontent.com/u/96408566?v=4" width="100px;" alt=""/><br /><sub><b> Cláudia </b></sub></a><br />👩🏾‍💻</a></td>
<td align="center"><a href="https://github.com/Dermeval" target="_blank"><img style="" src="https://avatars.githubusercontent.com/u/8845392?v=4" width="100px;" alt=""/><br /><sub><b> Dermeval Neves </b></sub></a><br />👨🏻‍💻</a></td>
<td align="center"><a href="https://github.com/ripe-glv" target="_blank"><img style="" src="https://avatars.githubusercontent.com/u/92002202?v=4" width="100px;" alt=""/><br /><sub><b> Filipe Carvalho </b></sub></a><br />👨🏻‍💻</a></td>
<td align="center"><a href="https://github.com/leticiaribeiro7" target="_blank"><img style="" src="https://avatars.githubusercontent.com/u/68934064?v=4" width="100px;" alt=""/><br /><sub><b> Leticia Ribeiro </b></sub></a><br />👩🏾‍💻</a></td>
<td align="center"><a href="https://github.com/fernandocintra2871" target="_blank"><img style="" src="https://avatars.githubusercontent.com/u/82674962?v=4" width="100px;" alt=""/><br /><sub><b> Luis Fernando do Rosario Cintra </b></sub></a><br />👨🏻‍💻</a></td>
<td align="center"><a href="https://github.com/yxngnd" target="_blank"><img style="" src="https://avatars.githubusercontent.com/u/67252396?v=4" width="100px;" alt=""/><br /><sub><b> Nirvan Yang </b></sub></a><br />👨🏻‍💻</a</td>
<td align="center"><a href="https://github.com/Vanderleicio" target="_blank"><img style="" src="https://avatars.githubusercontent.com/u/68967481?v=4" width="100px;" alt=""/><br /><sub><b> Vanderleicio </b></sub></a><br />👨🏻‍💻</a</td>
<td align="center"><a href="https://github.com/WagnerAlexandre" target="_blank"><img style="" src="https://avatars.githubusercontent.com/u/68972860?v=4" width="100px;" alt=""/><br /><sub><b> Wagner Alexandre </b></sub></a><br />👨🏻‍💻</a</td>
<td align="center"><a href="https://github.com/wlfoj" target="_blank"><img style="" src="https://avatars.githubusercontent.com/u/67566247?v=4" width="100px;" alt=""/><br /><sub><b> Washington Oliveira Júnior </b></sub></a><br />👨🏻‍💻</a</td>

  </tr>
</table>

