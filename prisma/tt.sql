
-- Inserindo usuários
INSERT INTO "Usuario" ("email", "fotoPerfil", "senha", "Nome", "Titulacao", "instituicaoEnsino", "formacaoAcademica", "resumoPessoal", "createdAt", "updatedAt")
VALUES
  ('user1@example.com', 'https://example.com/user1.jpg', 'senha123', 'Usuário Um', 'Bacharel', 'Universidade X', 'Ciência da Computação', 'Entusiasta de tecnologia.', NOW(), NOW()),
  ('user2@example.com', 'https://example.com/user2.jpg', 'senha456', 'Usuário Dois', 'Mestre', 'Universidade Y', 'Engenharia de Software', 'Apaixonado por IA.', NOW(), NOW());

-- Inserindo projetos
INSERT INTO "Projeto" ("titulo", "imagem", "descricao", "categoria", "dataInicio", "dataFim", "createdAt", "updatedAt")
VALUES
  ('Projeto Alpha', 'https://example.com/projeto_alpha.jpg', 'Descrição do Projeto Alpha', 'Tecnologia', '2024-01-01', '2024-12-31', NOW(), NOW()),
  ('Projeto Beta', 'https://example.com/projeto_beta.jpg', 'Descrição do Projeto Beta', 'Educação', '2024-02-01', '2024-11-30', NOW(), NOW());
  ('Projeto AGamma', 'https://example.com/projeto_gamma.jpg', 'Descrição do Projeto Gamma', 'Saúde', '2024-03-01', '2024-09-30', NOW(), NOW()),
  ('Projeto Delta', 'https://example.com/projeto_delta.jpg', 'Descrição do Projeto Delta', 'Meio Ambiente', '2024-04-15', '2024-10-15', NOW(), NOW());

-- Inserindo cursos
INSERT INTO "Curso" ("titulo", "imagem", "descricao", "categoria", "cargaHoraria", "linkInscricao", "vagas", "bibliografia", "metodologia", "metodoAvaliacao", "idProjeto", "idUsuario", "createdAt", "updatedAt")
VALUES
  ('Curso de IA', 'https://example.com/curso_ia.jpg', 'Aprenda inteligência artificial', 'Tecnologia', 40, 'https://inscricao.com/curso_ia', 50, 'Livro AI Essentials', 'Aulas teóricas e práticas', 'Provas e projetos', 1, 1, NOW(), NOW()),
  ('Curso de Big Data', 'https://example.com/curso_bigdata.jpg', 'Fundamentos de Big Data', 'Dados', 30, 'https://inscricao.com/curso_bigdata', 40, 'Livro Big Data', 'Aulas interativas', 'Trabalho final', 2, 2, NOW(), NOW());

-- Inserindo aulas
INSERT INTO "Aula" ("titulo", "linkPdf", "linkVideo", "idCurso", "createdAt", "updatedAt")
VALUES
  ('Introdução à IA', 'https://example.com/ia_intro.pdf', 'https://example.com/ia_intro.mp4', 1, NOW(), NOW()),
  ('Big Data no mundo real', 'https://example.com/bigdata_real.pdf', 'https://example.com/bigdata_real.mp4', 2, NOW(), NOW());

-- Inserindo eventos
INSERT INTO "Evento" ("titulo", "descricao", "data", "linkParticipacao", "createdAt", "updatedAt")
VALUES
  ('Workshop de IA', 'Evento sobre IA aplicada', '2024-06-15', 'https://evento.com/workshop_ia', NOW(), NOW()),
  ('Congresso de Dados', 'Discussões sobre Big Data', '2024-09-10', 'https://evento.com/congresso_dados', NOW(), NOW());

-- Inserindo colaboradores
INSERT INTO "Colaborador" (nome, categoria)
VALUES
  ('João Silva', 'Cordenador(a)'),
  ('Maria Souza', 'Bolsista');


-- Inserindo links dos usuários
INSERT INTO "Link" ("link", "idUsuario", "tipo", "createdAt", "updatedAt")
VALUES
  ('https://linkedin.com/in/user1', 1, 'Linkedin', NOW(), NOW()),
  ('https://instagram.com/user2', 2, 'Instragram', NOW(), NOW());

-- Inserindo publicações
INSERT INTO "Publicacao" ("descricao", "link", "idUsuario", "createdAt", "updatedAt")
VALUES
  ('Artigo sobre IA', 'https://arxiv.org/ia_paper', 1, NOW(), NOW()),
  ('Pesquisa em Big Data', 'https://research.com/bigdata', 2, NOW(), NOW());


