
-- Inserindo usuários
INSERT INTO "Usuario" ("email", "fotoPerfil", "senha", "Nome", "Titulacao", "instituicaoEnsino", "formacaoAcademica", "resumoPessoal", "createdAt", "updatedAt")
VALUES
  ('joao.silva@example.com', '/prof1.jpg', 'senha123', 'João Silva', 'Especialista', 'Instituto de Tecnologia XYZ', 'Inteligência Artificial', 'Especialista em IA.', NOW(), NOW()),
  ('ana.souza@example.com', '/prof2.jpg', 'senha123', 'Ana Souza', 'Doutor', 'Universidade de Dados ABC', 'Big Data', 'Doutora em Big Data.', NOW(), NOW()),
  ('carlos.mendes@example.com', '/prof3.jpg', 'senha123', 'Carlos Mendes', 'Doutor', 'Instituto de Robótica RST', 'Robótica', 'PhD em Robótica.', NOW(), NOW()),
  ('mariana.lima@example.com', '/prof4.jpg', 'senha123', 'Mariana Lima', 'Especialista', 'Faculdade de Engenharia DEF', 'Engenharia de Software', 'Engenheira de Software.', NOW(), NOW()),
  ('ricardo.santos@example.com', '/prof5.jpg', 'senha123', 'Ricardo Santos', 'Mestre', 'Universidade de Redes UVW', 'Redes de Computadores', 'Especialista em Redes.', NOW(), NOW());

-- Inserindo projetos
INSERT INTO "Projeto" ("titulo", "imagem", "descricao", "categoria", "dataInicio", "dataFim", "createdAt", "updatedAt")
VALUES
  ('Tecnologia da Informação', '/proj1.jpg', 'Curso de introdução e especialização em TI.', 'Tecnologia', '2024-01-01', '2024-02-19', NOW(), NOW()),
  ('Física', '/proj2.jpg', 'Projeto de pesquisa e desenvolvimento em física aplicada.', 'Física', '2024-01-01', '2024-03-31', NOW(), NOW()),
  ('Química', '/proj3.jpg', 'Curso focado em experimentos e teoria química avançada.', 'Química', '2024-01-01', '2024-03-10', NOW(), NOW()),
  ('Matemática', '/proj4.jpg', 'Projeto de inovação em métodos de ensino matemático.', 'Matemática', '2024-01-01', '2024-03-01', NOW(), NOW()),
  ('História', '/proj5.jpg', 'Curso de história mundial e metodologias de pesquisa histórica.', 'História', '2024-01-01', '2024-02-11', NOW(), NOW()),
  ('Inglês', '/proj5.jpg', 'Curso de Inglês técnico.', 'Língua Estrangeira', '2024-01-01', '2024-02-11', NOW(), NOW());

-- Inserindo cursos
INSERT INTO "Curso" ("titulo", "imagem", "descricao", "categoria", "cargaHoraria", "linkInscricao", "vagas", "bibliografia", "metodologia", "metodoAvaliacao", "idProjeto", "idUsuario", "createdAt", "updatedAt")
-- VALUES
--   ('Python', '/proj1.jpg', 'Curso intensivo de programação em Python para iniciantes e avançados.', 'Tecnologia', 40, 'https://inscricao.com/python', 30, 'Livro Python para Todos', 'Aulas teóricas e práticas', 'Projetos e testes', 23, 5, NOW(), NOW()),
--   ('React', '/proj2.jpg', 'Curso prático de desenvolvimento com React para aplicações web.', 'Tecnologia', 50, 'https://inscricao.com/react', 25, 'Documentação oficial React', 'Workshops e projetos', 'Avaliação contínua', 23, 8, NOW(), NOW()),
--   ('Inglês', '/proj3.jpg', 'Curso de inglês básico a avançado, focado em conversação e gramática.', 'Linguagens', 60, 'https://inscricao.com/ingles', 20, 'Cambridge English Grammar', 'Conversação e leitura', 'Testes orais e escritos', 28, 9, NOW(), NOW()),
--   ('Sistemas Embarcados', '/proj4.jpg', 'Curso completo sobre sistemas embarcados com prática em hardware e software.', 'Engenharia', 80, 'https://inscricao.com/embarcados', 15, 'Livro Sistemas Embarcados Modernos', 'Aulas práticas com kits', 'Projetos em grupo', 23, 7, NOW(), NOW()),
--   ('C/C++', '/proj5.jpg', 'Curso aprofundado em C e C++ com projetos práticos e desafios de programação.', 'Programação', 70, 'https://inscricao.com/c-cpp', 30, 'Livro C++ Primer', 'Desenvolvimento orientado a projetos', 'Desafios semanais', 23, 6, NOW(), NOW());
VALUES
  ('Python', '/proj1.jpg', 'Curso intensivo de programação em Python para iniciantes e avançados.', 'Tecnologia', 40, 'https://inscricao.com/python', 30, 'Livro Python para Todos', 'Aulas teóricas e práticas', 'Projetos e testes', 1, 1, NOW(), NOW()),
  ('React', '/proj2.jpg', 'Curso prático de desenvolvimento com React para aplicações web.', 'Tecnologia', 50, 'https://inscricao.com/react', 25, 'Documentação oficial React', 'Workshops e projetos', 'Avaliação contínua', 1, 4, NOW(), NOW()),
  ('Inglês', '/proj3.jpg', 'Curso de inglês básico a avançado, focado em conversação e gramática.', 'Linguagens', 60, 'https://inscricao.com/ingles', 20, 'Cambridge English Grammar', 'Conversação e leitura', 'Testes orais e escritos', 5, 5, NOW(), NOW()),
  ('Sistemas Embarcados', '/proj4.jpg', 'Curso completo sobre sistemas embarcados com prática em hardware e software.', 'Engenharia', 80, 'https://inscricao.com/embarcados', 15, 'Livro Sistemas Embarcados Modernos', 'Aulas práticas com kits', 'Projetos em grupo', 1, 3, NOW(), NOW()),
  ('C/C++', '/proj5.jpg', 'Curso aprofundado em C e C++ com projetos práticos e desafios de programação.', 'Programação', 70, 'https://inscricao.com/c-cpp', 30, 'Livro C++ Primer', 'Desenvolvimento orientado a projetos', 'Desafios semanais', 1, 2, NOW(), NOW());

-- Inserindo aulas
INSERT INTO "Aula" ("titulo", "linkPdf", "linkVideo", "idCurso", "createdAt", "updatedAt")
VALUES
  ('Introdução à IA', 'https://example.com/ia_intro.pdf', 'https://example.com/ia_intro.mp4', 1, NOW(), NOW()),
  ('Big Data no mundo real', 'https://example.com/bigdata_real.pdf', 'https://example.com/bigdata_real.mp4', 1, NOW(), NOW());

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


