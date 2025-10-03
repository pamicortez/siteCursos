
<img width=100% src="https://capsule-render.vercel.app/api?type=waving&color=3B6790&height=120&section=header"/>

<h1 align="center">EXA 622 - 2025.1 | Site de Cursos</h1>

<div align="center">  
  <img width=40% src="http://img.shields.io/static/v1?label=STATUS&message=EM%20DESENVOLVIMENTO&color=EFB036&style=for-the-badge"/>
</div>

<div align="center"><img src="public/home-animated.gif"></div>

<h3 align="center">Cursos UEFS</h3>

<p align="center">Este é um site em Next.js e PostgreSQL que disponibiliza cursos onlines ministrados por professores da Universidade Estadual de Feira de Santana para as comunidades internas e externas à universidade.</p>


## Objetivo do Projeto

O objetivo principal deste projeto é **desenvolver e implementar uma plataforma robusta e acessível de e-learning**, utilizando a *framework* **Next.js** para o *frontend* e **PostgreSQL** como sistema de gerenciamento de banco de dados.

Esta plataforma visa **estender o alcance educacional** da **Universidade Estadual de Feira de Santana (UEFS)**, permitindo que **professores** da instituição **disponibilizem cursos online de alta qualidade** para os públicos:

1.  **Comunidade Interna:** Alunos, servidores técnicos-administrativos e docentes da UEFS, promovendo a **formação continuada**, a **atualização profissional** e a **diversificação do aprendizado** dentro do ambiente universitário.
2.  **Comunidade Externa:** O público em geral, incluindo profissionais, estudantes de outras instituições e a população local e regional, cumprindo o **papel de extensão universitária** da UEFS e contribuindo para o **desenvolvimento social e intelectual** da comunidade.

Em última análise, o projeto busca **democratizar o acesso ao conhecimento** produzido na UEFS e estabelecer um **canal permanente de interação e transferência de conhecimento** entre a universidade e a sociedade.

<details>
  <summary><b>📸 Imagens</b></summary>

<details>
  <summary><b>🖥️ Home</b></summary>

## 🖥️ Home
<p align="center">
  <img src="public/home-animated.gif" height="300">
  <img src="public/home-animated-mobile.gif" height="300">
</p>

</details>

<details>
  <summary><b>🔍 Busca</b></summary>

## 🔍 Busca
<p align="center">
  <img src="public/search-animated.gif" height="300">
  <img src="public/search-animated-mobile.gif" height="300">
</p>

</details>

<details>
  <summary><b>👤 Usuário</b></summary>

## 👤 Usuário
<p align="center">
  <img src="public/user-animated.gif" height="300">
  <img src="public/user-animated-mobile.gif" height="300">
</p>

</details>

<details>
  <summary><b>📝 Cadastro</b></summary>

## 📝 Cadastro
<p align="center">
  <img src="public/cadastro-animated.gif" height="300">
  <img src="public/cadastro-animated-mobile.gif" height="300">
</p>

</details>

<details>
  <summary><b>🔑 Login</b></summary>

## 🔑 Login
<p align="center">
  <img src="public/login-animated.gif" height="300">
  <img src="public/login-animated-mobile.gif" height="300">
</p>

</details>

<details>
  <summary><b>🎓 Projeto e Curso</b></summary>

## 🎓 Curso
<p align="center">
  <img src="public/curso-animated.gif" height="300">
  <img src="public/curso-animated-mobile.gif" height="300">
</p>

</details>

<details>
  <summary><b>🗓️ Evento</b></summary>

## 🗓️ Evento
<p align="center">
  <img src="public/evento-animated.gif" height="300">
  <img src="public/evento-animated-mobile.gif" height="300">
</p>

</details>


</details>

<details>
  <summary><b>🛠 Tecnologias</b></summary>

## 🛠 Tecnologias

1. **Next.js**
2. **React.js**
3. **JavaScript/TypeScript**
4. **PostgreSQL**
5. **Docker**

</details>

<details>
  <summary><b>✔️ Pré-requisitos</b></summary>

## ✔️ Pré-requisitos
- Node.js 20+
- PostgreSQL ou Docker
- Git

</details>

<details>
  <summary><b>🐘 Instalação do PostgreSQL</b></summary>

## 🐘 Instalação do PostgreSQL

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
</details>

<details>
<summary><b>🐳 Instalação do Docker</b></summary>

## 🐳 Pré-requisitos: Instalação do Docker

O **Docker Desktop** é o método recomendado para Windows e Mac, pois ele instala o **Docker Engine**, o **CLI** e o **Docker Compose** (agora integrado como `docker compose`) em um pacote único, além de configurar o ambiente de virtualização necessário.

### 💻 1. Windows (Requer WSL 2)

O Docker Desktop no Windows utiliza o **Windows Subsystem for Linux 2 (WSL 2)** para um melhor desempenho.

1.  **Habilite o WSL 2:**

      * Abra o **PowerShell** ou **Prompt de Comando** como Administrador.
      * Execute:
        ```bash
        wsl --install
        ```
      * Reinicie sua máquina se solicitado.

2.  **Baixe e Instale o Docker Desktop:**

      * Vá para o site oficial do Docker: [Docker Desktop Download](https://www.docker.com/products/docker-desktop).
      * Baixe o instalador para Windows.
      * Execute o instalador (`Docker Desktop Installer.exe`).
      * Durante a instalação, **certifique-se de que a opção "Use WSL 2 instead of Hyper-V" esteja selecionada**.

3.  **Inicie e Configure:**

      * Após a instalação, inicie o **Docker Desktop**.
      * Aceite o Contrato de Serviço se aparecer.
      * O Docker Desktop iniciará o *Engine* em um *backend* WSL 2 e você verá o ícone do Docker na bandeja do sistema.

### 🍎 2. macOS (Apple Silicon ou Intel Chip)

1.  **Baixe o Instalador:**

      * Vá para o site oficial do Docker: [Docker Desktop Download](https://www.docker.com/products/docker-desktop).
      * **Importante:** Escolha a versão correta para o seu chip (Apple Silicon / M-Series ou Intel Chip).

2.  **Instale:**

      * Abra o arquivo `.dmg` baixado.
      * Arraste o ícone do **Docker** para a pasta **Applications**.
      * Vá para a pasta Applications e execute o **Docker.app**.

3.  **Inicie e Configure:**

      * O macOS pode pedir sua senha para instalar componentes auxiliares.
      * Aceite o Contrato de Serviço.
      * O Docker Desktop será iniciado e o ícone do Docker aparecerá na barra de menu.

### 🐧 3. Linux (Instalação Direta do Docker Engine e Compose)

Embora o **Docker Desktop for Linux** seja uma opção, a forma tradicional e comum é instalar o **Docker Engine** e o **Docker Compose Plugin** via repositório de pacotes.

  * *O exemplo abaixo é para distribuições baseadas em Debian (ex: Ubuntu). Use `dnf` ou `yum` para distribuições baseadas em RHEL/Fedora.*

<!-- end list -->

1.  **Atualizar e Instalar Dependências:**

    ```bash
    sudo apt update
    sudo apt install ca-certificates curl gnupg
    ```

2.  **Adicionar a Chave GPG Oficial do Docker:**

    ```bash
    sudo install -m 0755 -d /etc/apt/keyrings
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
    sudo chmod a+r /etc/apt/keyrings/docker.gpg
    ```

3.  **Adicionar o Repositório do Docker ao APT:**

    ```bash
    echo \
      "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
      $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
      sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
    ```

4.  **Instalar o Docker Engine e o Compose Plugin:**

    ```bash
    sudo apt update
    sudo apt install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
    ```

5.  **Permitir Execução sem `sudo` (Recomendado):**
    Para rodar comandos Docker sem precisar usar `sudo` todas as vezes, adicione seu usuário ao grupo `docker`:

    ```bash
    sudo usermod -aG docker $USER
    ```

    > **Importante:** Você precisa **sair e logar novamente** (ou reiniciar) para que esta mudança de grupo entre em vigor.

### 🚀 Verificação Final

Após a instalação em qualquer sistema, abra o terminal e execute:

```bash
docker run hello-world
```

Se a instalação estiver correta, você verá uma mensagem de confirmação do Docker, indicando que o *engine* está funcionando\!

</details>

<details>
   <summary><b>🐳 Instruções de Deploy com Docker</b></summary>

## 🐳 Instruções de Deploy com Docker

Este guia detalha como realizar o *deploy* do projeto em um ambiente de produção usando **Docker** e **Docker Compose**, utilizando o arquivo de configuração **`.env.production`**.

### 1\. Clonagem e Configuração do Repositório

**Caso ainda não tenha clonado o repositório para sua máquina local. Clone-lo seguindo as instruções a seguir:**

   Abra o terminal e execute os comandos abaixo:
   ```bash
   git clone https://github.com/pamicortez/siteCursos.git
   cd siteCursos
   ```

### 2\. Configuração do Ambiente de Produção

Crie o arquivo **`.env.production`** na raiz do projeto. Este arquivo conterá todas as variáveis de ambiente necessárias para a aplicação e o banco de dados em um ambiente de produção.

#### Conteúdo do `.env.production`:

Substitua os valores placeholders (como `IP:PORT`, `seu-dominio-aqui`, `POSTGRES_PASSWORD`, etc.) pelos valores reais do seu ambiente de produção.

```bash
# Configuração do banco de dados (URL de conexão completa)
DATABASE_URL="postgresql://POSTGRES_USER:POSTGRES_PASSWORD@IP:PORT/DB_NAME"

# Variáveis para o serviço PostgreSQL no Docker Compose
POSTGRES_DB=DB_NAME
POSTGRES_USER=POSTGRES_USER
POSTGRES_PASSWORD=POSTGRES_PASSWORD

# Configuração do NextAuth
NEXTAUTH_URL=http://seu-dominio-aqui:3000
NEXTAUTH_SECRET="your-secret-key-here"

# Configuração do ambiente (DEVE ser 'production')
NODE_ENV=production

# Configuração de E-mail (Exemplo)
EMAIL_PASSWORD="abcd efgh ijkl mnop"
EMAIL = "email@example.com"

# Desabilitar Telemetria do Next.js
NEXT_TELEMETRY_DISABLED=1
```

**Gerando o `NEXTAUTH_SECRET`:**
Para gerar a chave secreta de forma segura, use o comando:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

Copie o resultado e substitua `"your-secret-key-here"` no arquivo `.env.production`.


### 3. Comandos Docker para Deploy

Assumindo que você já possui o **Docker** e o **Docker Compose** instalados e configurados, e que os arquivos `Dockerfile` e `docker-compose.yml` estão prontos para usar o `.env.production`, siga os comandos abaixo:

#### **Primeira Execução**

##### A. Build Inicial e Início dos Serviços

Use este comando para construir as imagens (caso necessário) e iniciar todos os serviços definidos no `docker-compose.yml` em modo *detached* (em segundo plano).

```bash
docker-compose up -d
```

ou 

```bash
npm run docker:up
```

##### B. Popular o Banco de Dados (Seed)

**Execute um destes comandos *somente* na primeira vez** ou quando precisar recriar os dados iniciais do banco de dados.

O comando a seguir cria o usuário admin (Super) e alguns projetos, cursos e eventos fictícios para ocupar espaço.

```bash
docker-compose exec app npm run seed-admin
```

ou, se quiser criar mais usuários, projetos, cursos e eventos fictícios

```bash
docker-compose exec app npm run expanded-seed
```

##### C. Verificação de Logs

Para monitorar o *status* e a inicialização da aplicação, verifique os logs do container principal (`app`).

```bash
docker-compose logs -f app
```

ou 

```bash
npm run docker:logs
```

#### **Segunda e Próximas Execuções**

##### A. Atualizar o Código do Repositório

Se houver alguma mudança no repositório remoto e você deseja aplicar as atualizações sem alterar o banco de dados, primeiro faça o pull das mudanças:

```bash
git pull origin main
```

> **Nota:** Substitua `main` pelo nome da branch que você está usando, se for diferente.

##### B. Reconstrução e Início dos Serviços

Após atualizar o código, use este comando para reconstruir a imagem da aplicação e iniciar os serviços. Ele preservará os dados existentes no volume do PostgreSQL.

```bash
docker-compose up -d --build app
```

> **Nota:** Não é necessário rodar o `seed` novamente após um *rebuild* se os dados já estiverem populados.

##### C. Verificação de Logs

Para monitorar os logs da aplicação:

```bash
docker-compose logs -f app
```

ou 

```bash
npm run docker:logs
```

</details>


<details>
  <summary><b>💻 Instruções para Rodar o Projeto Localmente (Ambiente de Desenvolvimento)</b></summary>

## 💻 Instruções para Rodar o Projeto Localmente (Ambiente de Desenvolvimento)

Siga os passos abaixo para rodar o projeto em sua máquina local.

1. **Clone o repositório para sua máquina local. Em seguida crie o arquivo ".env"**  
   Abra o terminal e execute os comandos abaixo:
   ```bash
   git clone https://github.com/pamicortez/siteCursos.git
   cd siteCursos
   ```

   Nessa pasta crie um arquivo ".env" manualmente com o seguinte conteúdo (substitua "senha" pela sua senha do Postgres):
   ```bash
      # Configuração do banco de dados (URL de conexão completa)
      DATABASE_URL="postgresql://usuario_postgres:senha@localhost:5432/nome_banco"

      # Configuração do NextAuth
      NEXTAUTH_URL=http://localhost:3000
      NEXTAUTH_SECRET="sua_chave_secreta_aqui"

      # Configuração de E-mail (Exemplo)
      EMAIL_PASSWORD="abcd efgh ijkl mnop"
      EMAIL = "email@example.com"

      # Desabilitar Telemetria do Next.js
      NEXT_TELEMETRY_DISABLED=1
   ```

   Para gerar a chave secreta do NEXTAUTH_SECRET, execute:
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
   ```
   Copie o resultado e substitua "sua_chave_secreta_aqui" pela chave gerada.  

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
   npm run expanded-seed
   ```

5. **Inicie o servidor de desenvolvimento**  
   Execute um dos seguintes comandos:
   ```bash
   npm run dev
   ```

6. **Abra no navegador**  
   Acesse [http://localhost:3000](http://localhost:3000) para visualizar o Projeto.

7. **Abra no navegador**  
   Acesse [http://localhost:5555/](http://localhost:5555/) para visualizar o Banco de Dados com Prisma Studio.

</details>


## ✨ Funcionalidades Implementadas

A plataforma foi desenvolvida para atender às necessidades de gerenciamento de usuários, projetos, cursos, eventos, aulas e de conteúdos didáticos.

### 👥 Gestão de Usuários e Autenticação

O sistema de cadastro e acesso foi desenvolvido para garantir que apenas **professores da UEFS** possam se cadastrar como usuários ativos da plataforma para a disponibilização de projetos, cursos e eventos. Com o seguinte fluxo de aprovação de segurança:

1.  **Pré-cadastro com Verificação por E-mail:** O usuário inicia o cadastro e recebe um **código de confirmação por e-mail** para validar o endereço antes de finalizar o processo.
2.  **Fluxo de Aprovação de Segurança (Professores):**
    * Um novo cadastro é inicialmente criado com o *status* **Pendente**.
    * Para ter acesso, o pedido deve ser **aprovado** por um usuário do tipo **"Super"** (Administrador).
    * Apenas após a aprovação, o usuário tem seu tipo alterado para **"Normal"** (Professor Ativo) e pode realizar o login.
3.  **Controle de Acesso "Super":** Usuários com o *tipo* **"Super"** (administradores) têm privilégios exclusivos para gerenciar a base de professores, incluindo:
    * **Aceitar/Aprovar** pedidos de novos cadastros (mudando de Pendente para Normal).
    * **Bloquear** usuários existentes.
    * **Excluir** permanentemente contas de usuários.

### 📚 Gestão de Conteúdo e Hierarquia

A plataforma organiza o conhecimento em uma estrutura hierárquica clara, permitindo que os professores criem e gerenciem diversos tipos de conteúdo:

| Nível | Entidade | Atributos Chave | Professor Responsável |
| :---: | :--- | :--- | :--- |
| **1** | **Projetos** | Data de Início e Fim | Cadastro exclusivo do Professor. |
| **2** | **Cursos** | Data de Início e Fim, Vínculo com **Projetos** | Vínculado ao Professor que cadastrou o Projeto. |
| **3** | **Aulas** | N/A | Vínculadas ao Curso específico. |
| **4** | **Conteúdo da Aula** | **Vídeos**, **Apostilas** e **Podcasts** | Material de apoio direto da Aula. |

### 📅 Gestão de Eventos

Professores cadastrados podem criar e gerenciar **Eventos** promovidos pela UEFS, que são independentes da estrutura de Cursos/Projetos:

* **Campos Chave:** Data de Início e Fim, Horário.
* **Recurso:** Cada evento pode ter uma **galeria de fotos** associada.

<details>
  <summary><b>📚 Recursos para Desenvolvimento e Aprendizado</b></summary>

## 📚 Recursos para Desenvolvimento e Aprendizado

Esta seção fornece links e documentações oficiais para as tecnologias centrais do projeto, auxiliando desenvolvedores a entender o *framework*, as linguagens e a arquitetura de *deploy*.

### 💻 Frontend (Next.js & React)

| Ícone | Recurso | Descrição | Link |
| :---: | :--- | :--- | :--- |
| 📖 | **Documentação Next.js** | O guia completo para as funcionalidades de *routing*, renderização e API Routes do Next.js. | [https://nextjs.org/docs](https://nextjs.org/docs) |
| 🎓 | **Tutorial Interativo Next.js** | Aprenda os fundamentos do Next.js e React através de um tutorial prático e guiado. | [https://nextjs.org/learn](https://nextjs.org/learn) |
| 🛠️ | **Repositório do Next.js no GitHub** | Explore o código-fonte da *framework* e veja exemplos de uso avançado. | [https://github.com/vercel/next.js](https://www.google.com/search?q=https://github.com/vercel/next.js) |
| ⚛️ | **Documentação Oficial do React** | Fundamentos da biblioteca React, essencial para o desenvolvimento de componentes. | [https://react.dev/](https://react.dev/) |

### 🐘 Banco de Dados (PostgreSQL)

| Ícone | Recurso | Descrição | Link |
| :---: | :--- | :--- | :--- |
| 💾 | **Documentação Oficial do PostgreSQL** | Referência completa sobre a sintaxe SQL, tipos de dados e recursos avançados do PostgreSQL. | [https://www.postgresql.org/docs/](https://www.postgresql.org/docs/) |
| 📜 | **Documentação do Prisma ORM** | Guia e referência para o *Object-Relational Mapper* (ORM) utilizado para interação com o banco de dados. | [https://www.prisma.io/docs/](https://www.prisma.io/docs/) |

### 🐳 Infraestrutura (Docker & Docker Compose)

| Ícone | Recurso | Descrição | Link |
| :---: | :--- | :--- | :--- |
| 🚢 | **Documentação Oficial do Docker** | Tudo sobre a criação de imagens, a execução de containers e o Docker Engine. | [https://docs.docker.com/](https://docs.docker.com/) |
| 🔗 | **Visão Geral do Docker Compose** | Entenda como o `docker-compose.yml` orquestra os múltiplos serviços (Next.js App e PostgreSQL DB). | [https://docs.docker.com/compose/](https://docs.docker.com/compose/) |
| 💡 | **Docker Hub** | O registro de imagens públicas onde estão as bases de Linux, Node.js e PostgreSQL utilizadas no *deploy*. | [https://hub.docker.com/](https://hub.docker.com/) |

### 🌐 Versionamento (Git & GitHub)

| Ícone | Recurso | Descrição | Link |
| :---: | :--- | :--- | :--- |
| 🌳 | **Documentação Oficial do Git** | Referência sobre comandos e o fluxo de trabalho de *branching* e *merging*. | [https://git-scm.com/doc](https://git-scm.com/doc) |
| 🧑‍💻 | **Guia de Início Rápido do GitHub** | Aprenda a contribuir, criar *pull requests* e revisar o código dentro do ambiente GitHub. | [https://docs.github.com/pt/get-started](https://docs.github.com/pt/get-started) |

</details>

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

