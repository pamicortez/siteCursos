-- Inserindo usuários
INSERT INTO "Usuario" (email, "fotoPerfil", senha, "Nome", "Titulacao", "instituicaoEnsino", "formacaoAcademica", "resumoPessoal", "createdAt", "updatedAt")
VALUES
('joao@email.com', 'https://example.com/foto1.jpg', 'senha123', 'João Silva', 'Doutor', 'Universidade X', 'Engenharia de Software', 'Pesquisador na área de IA', NOW(), NOW()),
('maria@email.com', 'https://example.com/foto2.jpg', 'senha456', 'Maria Souza', 'Mestre', 'Universidade Y', 'Ciência da Computação', 'Especialista em segurança digital', NOW(), NOW());

-- Inserindo projetos
INSERT INTO "Projeto" (titulo, imagem, descricao, categoria, "dataInicio", "dataFim", "createdAt", "updatedAt")
VALUES
('Projeto AI', 'https://example.com/projeto1.jpg', 'Projeto sobre inteligência artificial', 'Tecnologia', '2024-01-10', '2024-12-20', NOW(), NOW()),
('Projeto Bio', 'https://example.com/projeto2.jpg', 'Projeto sobre biotecnologia', 'Ciências', '2024-02-15', '2024-11-30', NOW(), NOW());

-- Inserindo cursos
INSERT INTO "Curso" (titulo, imagem, descricao, categoria, "cargaHoraria", "linkInscricao", vagas, bibliografia, metodologia, "metodoAvaliacao", "idProjeto", "idUsuario", "createdAt", "updatedAt")
VALUES
('Curso de IA', 'https://example.com/curso1.jpg', 'Curso sobre inteligência artificial', 'CienciasAgrarias', 40, 'https://inscricao.com/curso1', 50, 'Bibliografia AI', 'Metodologia prática', 'Provas e projetos', 1, 1, NOW(), NOW()),
('Curso de Biotecnologia', 'https://example.com/curso2.jpg', 'Curso sobre biotecnologia', 'CienciasAgrarias', 35, 'https://inscricao.com/curso2', 30, 'Bibliografia Bio', 'Aulas expositivas', 'Trabalhos e provas', 2, 2, NOW(), NOW());

-- Inserindo aulas
INSERT INTO "Aula" (titulo, "linkPdf", "linkVideo", "idCurso", "createdAt", "updatedAt")
VALUES
('Introdução à IA', 'https://example.com/ia1.pdf', 'https://example.com/ia1.mp4', 1, NOW(), NOW()),
('Fundamentos de Biotecnologia', 'https://example.com/bio1.pdf', 'https://example.com/bio1.mp4', 2, NOW(), NOW());

-- Inserindo eventos
INSERT INTO "Evento" (titulo, descricao, "data", "linkParticipacao", "createdAt", "updatedAt")
VALUES
('Congresso de IA', 'Evento sobre inteligência artificial', '2024-09-10', 'https://evento.com/ia', NOW(), NOW()),
('Seminário de Biotecnologia', 'Discussões sobre biotecnologia avançada', '2024-10-15', 'https://evento.com/bio', NOW(), NOW());

-- Inserindo imagens dos eventos
INSERT INTO "imagemEvento" (link, "idEvento", "createdAt", "updatedAt")
VALUES
('https://example.com/evento1.jpg', 1, NOW(), NOW()),
('https://example.com/evento2.jpg', 2, NOW(), NOW());

-- Inserindo participação nos eventos
INSERT INTO "eventoUsuario" ("idUsuario", "idEvento", "tipoParticipacao", "createdAt", "updatedAt")
VALUES
(1, 1, 'Palestrante', NOW(), NOW()),
(2, 2, 'Ouvinte', NOW(), NOW());

-- Inserindo links dos usuários
INSERT INTO "Link" (link, "idUsuario", "createdAt", "updatedAt")
VALUES
('https://github.com/joaosilva', 1, NOW(), NOW()),
('https://linkedin.com/mariasouza', 2, NOW(), NOW());

-- Inserindo publicações
INSERT INTO "Publicacao" (descricao, link, "idUsuario", "createdAt", "updatedAt")
VALUES
('Artigo sobre redes neurais', 'https://arxiv.org/ai', 1, NOW(), NOW()),
('Pesquisa sobre genômica', 'https://arxiv.org/bio', 2, NOW(), NOW()),
('Projeto de IA', 'link', 1, NOW(), NOW()),
('Projeto de Biotecnologia', 'link', 2, NOW(), NOW());

-- Relacionando usuários com cursos
INSERT INTO "cursoUsuario" ("idCurso", "idUsuario", "createdAt", "updatedAt")
VALUES
(1, 1, NOW(), NOW()),
(2, 2, NOW(), NOW());

-- Relacionando usuários com projetos
INSERT INTO "projetoUsuario" ("idProjeto", "idUsuario", "createdAt", "updatedAt")
VALUES
(1, 1, NOW(), NOW()),
(2, 2, NOW(), NOW());
