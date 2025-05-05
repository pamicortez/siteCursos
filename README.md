# Documentação do Schema Prisma

## Introdução

Este projeto utiliza o Prisma ORM para gerenciar a estrutura do banco de dados PostgreSQL. O arquivo `schema.prisma` define a estrutura das tabelas, enums e relacionamentos.

## Configuração do Prisma

O Prisma utiliza um gerador para criar um cliente JavaScript para interagir com o banco de dados.

```prisma
generator client {
  provider = "prisma-client-js"
}
```

A conexão com o banco de dados é definida na fonte de dados:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

A URL de conexão é armazenada no arquivo `.env` para manter credenciais seguras.

---

## Enums

Os enums são utilizados para categorizar valores fixos, garantindo consistência nos dados.

### `tipoLink`

Enum para classificar os tipos de links dos usuários:

- `Instragram`
- `Whatsapp`
- `Linkedin`
- `Facebook`
- `Genérico`

### `funcaoProjeto`

Enum para definir o papel de um usuário em um projeto:

- `Coordenador`
- `Colaborador`
- `Bolsista`
- `Voluntário`

### `Titulacao`

Enum para classificação de formação acadêmica:

- `Bacharel`
- `Licenciado`
- `Especialista`
- `Mestre`
- `Doutor`

### `tipoParticipacao`

Enum para definir a participação em eventos:

- `Ouvinte`
- `Palestrante`
- `Organizador`

### `colaboradorCategoria`

Enum para categorizar colaboradores:

- `Coordenador`
- `Colaborador`
- `Bolsista`
- `Voluntário`

---

## Modelos do Banco de Dados

Os modelos representam tabelas do banco de dados, definindo suas propriedades e relacionamentos.

### `Projeto`
Tabela que armazena informações sobre projetos.

- `id`: Identificador único do projeto.
- `titulo`: Título do projeto.
- `imagem`: URL da imagem representativa.
- `descricao`: Descrição do projeto.
- `categoria`: Categoria do projeto.
- `dataInicio`: Data de início do projeto.
- `dataFim`: Data de término do projeto.
- `createdAt`: Data de criação.
- `updatedAt`: Data da última atualização.

### `Curso`
Armazena detalhes sobre cursos oferecidos.

- `id`: Identificador único do curso.
- `titulo`: Nome do curso.
- `imagem`: URL da imagem representativa.
- `descricao`: Descrição do curso.
- `categoria`: Categoria do curso.
- `cargaHoraria`: Duração do curso em horas.
- `linkInscricao`: URL para inscrição.
- `vagas`: Número de vagas disponíveis.
- `bibliografia`: Referências do curso.
- `metodologia`: Método de ensino utilizado.
- `metodoAvaliacao`: Critérios de avaliação.
- `idProjeto`: Referência ao projeto relacionado.
- `idUsuario`: Usuário responsável pela criação do curso.
- `createdAt`: Data de criação.
- `updatedAt`: Data da última atualização.

### `Aula`
Relacionada a cursos, armazenando informações sobre aulas.

- `id`: Identificador único da aula.
- `titulo`: Nome da aula.
- `linkPdf`: Link para o material em PDF.
- `linkVideo`: Link para o vídeo da aula.
- `idCurso`: Curso ao qual pertence.
- `createdAt`: Data de criação.
- `updatedAt`: Data da última atualização.

### `Usuario`
Tabela que representa os usuários do sistema.

- `id`: Identificador único do usuário.
- `email`: Endereço de e-mail único.
- `fotoPerfil`: URL da foto de perfil.
- `senha`: Senha do usuário.
- `Nome`: Nome completo.
- `Titulacao`: Titulação acadêmica.
- `instituicaoEnsino`: Nome da instituição acadêmica.
- `formacaoAcademica`: Formação acadêmica.
- `resumoPessoal`: Breve descrição do usuário.
- `createdAt`: Data de criação.
- `updatedAt`: Data da última atualização.

### `Link`
Armazena links associados aos usuários.

- `id`: Identificador único do link.
- `link`: URL do link.
- `idUsuario`: Referência ao usuário proprietário do link.
- `tipo`: Tipo de link (Instagram, Facebook, etc).
- `createdAt`: Data de criação.
- `updatedAt`: Data da última atualização.

### `Publicacao`
Registra publicações feitas por usuários.

- `id`: Identificador único da publicação.
- `descricao`: Descrição do conteúdo.
- `link`: URL da publicação.
- `idUsuario`: Usuário responsável.
- `createdAt`: Data de criação.
- `updatedAt`: Data da última atualização.

### `Colaborador`
Tabela de colaboradores vinculados a projetos.

- `id`: Identificador único do colaborador.
- `nome`: Nome do colaborador.
- `categoria`: Categoria do colaborador (Coordenador, Bolsista, etc).

### `Evento`
Armazena informações sobre eventos.

- `id`: Identificador único do evento.
- `titulo`: Nome do evento.
- `descricao`: Descrição do evento.
- `data`: Data e hora do evento.
- `linkParticipacao`: Link de participação.
- `createdAt`: Data de criação.
- `updatedAt`: Data da última atualização.

### `imagemEvento`
Relacionada a eventos, armazenando links de imagens.

- `id`: Identificador único da imagem.
- `link`: URL da imagem.
- `idEvento`: Evento associado.
- `createdAt`: Data de criação.
- `updatedAt`: Data da última atualização.

---

## Migrações

Para aplicar as alterações no banco de dados, utilize os seguintes comandos:

```sh
npx prisma migrate dev 
```

Para gerar o cliente Prisma:

```sh
npx prisma generate
```

Para visualizar o banco de dados com Prisma Studio:

```sh
npx prisma studio
```

---

Caso alguma dúvida o arquivo schema.prisma dentro da pasta prisma também está comentado
