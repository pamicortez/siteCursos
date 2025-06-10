-- Inserindo usuários (expandido para 5+)
INSERT INTO "Usuario" (email, "fotoPerfil", senha, "Nome", "Titulacao", "instituicaoEnsino", "formacaoAcademica", "resumoPessoal", "createdAt", "updatedAt")
VALUES
('jose@email.com', '/prof1.jpg', '$2b$10$pebYXLFuAwcyo0Esbiwuc.nUHkd73jmAGxZfHw06S1mD0JNtcoM6m', 'José Machado', 'Doutor', 'Universidade X', 'Engenharia de Software', 'Pesquisador na área de IA', NOW(), NOW()),
('julia@email.com', '/prof2.jpg', '$2b$10$pebYXLFuAwcyo0Esbiwuc.nUHkd73jmAGxZfHw06S1mD0JNtcoM6m', 'Júlia Souza', 'Mestre', 'Universidade Y', 'Ciência da Computação', 'Especialista em segurança digital', NOW(), NOW()),
('carlos@email.com', '/prof1.jpg', '$2b$10$pebYXLFuAwcyo0Esbiwuc.nUHkd73jmAGxZfHw06S1mD0JNtcoM6m', 'Carlos Silva', 'Especialista', 'Instituto Federal Z', 'Análise de Sistemas', 'Desenvolvedor full-stack com foco em aplicações web', NOW(), NOW()),
('ana@email.com', '/prof2.jpg', '$2b$10$pebYXLFuAwcyo0Esbiwuc.nUHkd73jmAGxZfHw06S1mD0JNtcoM6m', 'Ana Costa', 'Mestre', 'Universidade ABC', 'Biotecnologia', 'Pesquisadora em genética molecular', NOW(), NOW()),
('pedro@email.com', '/prof1.jpg', '$2b$10$pebYXLFuAwcyo0Esbiwuc.nUHkd73jmAGxZfHw06S1mD0JNtcoM6m', 'Pedro Santos', 'Doutor', 'Universidade DEF', 'Matemática Aplicada', 'Especialista em modelagem estatística', NOW(), NOW()),
('maria@email.com', '/prof2.jpg', '$2b$10$pebYXLFuAwcyo0Esbiwuc.nUHkd73jmAGxZfHw06S1mD0JNtcoM6m', 'Maria Oliveira', 'Bacharel', 'Faculdade GHI', 'Design Gráfico', 'Designer UX/UI com experiência em produtos digitais', NOW(), NOW());

-- Inserindo projetos (expandido para 5+)
INSERT INTO "Projeto" (titulo, imagem, descricao, categoria, "dataInicio", "dataFim", "createdAt", "updatedAt")
VALUES
('Projeto AI', '/proj1.jpg', 'Projeto sobre inteligência artificial', 'Tecnologia', '2024-01-10', '2024-12-20', NOW(), NOW()),
('Projeto Bio', '/proj3.jpg', 'Projeto sobre biotecnologia', 'Ciências', '2024-02-15', '2024-11-30', NOW(), NOW()),
('Projeto Sustentabilidade', '/proj1.jpg', 'Desenvolvimento de soluções sustentáveis para agricultura', 'Meio Ambiente', '2024-03-01', '2025-02-28', NOW(), NOW()),
('Projeto Educação Digital', '/proj3.jpg', 'Plataforma de ensino à distância para comunidades rurais', 'Educação', '2024-04-01', '2024-10-31', NOW(), NOW()),
('Projeto Saúde Comunitária', '/proj1.jpg', 'Sistema de monitoramento de saúde para comunidades carentes', 'Saúde', '2024-05-15', '2025-05-14', NOW(), NOW()),
('Projeto Inovação Social', '/proj3.jpg', 'Incubadora de startups sociais', 'Empreendedorismo', '2024-06-01', '2025-12-31', NOW(), NOW());

-- Inserindo cursos (expandido para 5+)
INSERT INTO "Curso" (titulo, imagem, descricao, categoria, "cargaHoraria", "linkInscricao", vagas, bibliografia, metodologia, "metodoAvaliacao", "idProjeto", "idUsuario", "createdAt", "updatedAt")
VALUES
('Curso de IA', '/proj1.jpg', 'Curso sobre inteligência artificial', 'CienciasAgrarias', 40, 'https://inscricao.com/curso1', 50, 'Bibliografia AI', 'Metodologia prática', 'Provas e projetos', 1, 1, NOW(), NOW()),
('Curso de Biotecnologia', '/proj3.jpg', 'Curso sobre biotecnologia', 'CienciasAgrarias', 35, 'https://inscricao.com/curso2', 30, 'Bibliografia Bio', 'Aulas expositivas', 'Trabalhos e provas', 2, 2, NOW(), NOW()),
('Curso de Agricultura Sustentável', '/proj1.jpg', 'Técnicas modernas de agricultura sustentável', 'CienciasAgrarias', 60, 'https://inscricao.com/curso3', 40, 'Manual de Agricultura Sustentável', 'Aulas práticas e teóricas', 'Projetos práticos', 3, 3, NOW(), NOW()),
('Curso de Desenvolvimento Web', '/proj3.jpg', 'Desenvolvimento de aplicações web modernas', 'TecnologiaEComputacao', 80, 'https://inscricao.com/curso4', 25, 'Livros de JavaScript e React', 'Hands-on coding', 'Projetos finais', 4, 4, NOW(), NOW()),
('Curso de Estatística Aplicada', '/proj1.jpg', 'Análise estatística para pesquisa científica', 'CienciasExatas', 45, 'https://inscricao.com/curso5', 35, 'Livros de Estatística', 'Aulas expositivas e exercícios', 'Provas e trabalhos', 5, 5, NOW(), NOW()),
('Curso de Design Thinking', '/proj3.jpg', 'Metodologias de design para inovação', 'ArtesECultura', 30, 'https://inscricao.com/curso6', 20, 'Livros de Design Thinking', 'Workshops práticos', 'Projetos colaborativos', 6, 6, NOW(), NOW());

-- Inserindo aulas (expandido)
INSERT INTO "Aula" (titulo, "linkPdf", "linkVideo", "idCurso", "createdAt", "updatedAt")
VALUES
('Introdução à IA', 'https://example.com/ia1.pdf', 'https://example.com/ia1.mp4', 1, NOW(), NOW()),
('Fundamentos de Biotecnologia', 'https://example.com/bio1.pdf', 'https://example.com/bio1.mp4', 2, NOW(), NOW()),
('Machine Learning Básico', 'https://example.com/ia2.pdf', 'https://example.com/ia2.mp4', 1, NOW(), NOW()),
('Genética Molecular', 'https://example.com/bio2.pdf', 'https://example.com/bio2.mp4', 2, NOW(), NOW()),
('Técnicas de Compostagem', 'https://example.com/agri1.pdf', 'https://example.com/agri1.mp4', 3, NOW(), NOW()),
('HTML e CSS Avançado', 'https://example.com/web1.pdf', 'https://example.com/web1.mp4', 4, NOW(), NOW()),
('Análise de Regressão', 'https://example.com/stat1.pdf', 'https://example.com/stat1.mp4', 5, NOW(), NOW()),
('Prototipagem Rápida', 'https://example.com/design1.pdf', 'https://example.com/design1.mp4', 6, NOW(), NOW());

-- Inserindo eventos (expandido para 5+)
INSERT INTO "Evento" (titulo, descricao, "data", "linkParticipacao", "createdAt", "updatedAt")
VALUES
('Congresso de IA', 'Evento sobre inteligência artificial', '2024-09-10', 'https://evento.com/ia', NOW(), NOW()),
('Seminário de Biotecnologia', 'Discussões sobre biotecnologia avançada', '2024-10-15', 'https://evento.com/bio', NOW(), NOW()),
('Workshop de Sustentabilidade', 'Práticas sustentáveis para o futuro', '2024-11-20', 'https://evento.com/sustentabilidade', NOW(), NOW()),
('Hackathon de Educação', 'Desenvolvimento de soluções educacionais', '2024-12-05', 'https://evento.com/hackathon', NOW(), NOW()),
('Conferência de Saúde Digital', 'Inovações em saúde e tecnologia', '2025-01-15', 'https://evento.com/saude', NOW(), NOW()),
('Feira de Inovação Social', 'Exposição de projetos de impacto social', '2025-02-10', 'https://evento.com/inovacao', NOW(), NOW());

-- Inserindo imagens dos eventos (expandido)
INSERT INTO "imagemEvento" (link, "idEvento", "createdAt", "updatedAt")
VALUES
('/event1.jpg', 1, NOW(), NOW()),
('/event2.jpg', 2, NOW(), NOW()),
('/event3.jpg', 3, NOW(), NOW()),
('/event1.jpg', 4, NOW(), NOW()),
('/event2.jpg', 5, NOW(), NOW()),
('/event3.jpg', 6, NOW(), NOW());

-- Inserindo participação nos eventos (expandido)
INSERT INTO "eventoUsuario" ("idUsuario", "idEvento", "tipoParticipacao", "createdAt", "updatedAt")
VALUES
(1, 1, 'Palestrante', NOW(), NOW()),
(2, 2, 'Ouvinte', NOW(), NOW()),
(3, 3, 'Organizador', NOW(), NOW()),
(4, 4, 'Palestrante', NOW(), NOW()),
(5, 5, 'Ouvinte', NOW(), NOW()),
(6, 6, 'Organizador', NOW(), NOW()),
(1, 3, 'Ouvinte', NOW(), NOW()),
(2, 4, 'Palestrante', NOW(), NOW());

-- Inserindo links dos usuários (expandido para 5+ por usuário)
INSERT INTO "Link" (link, "idUsuario", tipo, "createdAt", "updatedAt")
VALUES
('https://github.com/josemachado', 1, 'Genérico', NOW(), NOW()),
('https://linkedin.com/in/josemachado', 1, 'Linkedin', NOW(), NOW()),
('https://instagram.com/josemachado', 1, 'Instragram', NOW(), NOW()),
('https://linkedin.com/in/juliasouza', 2, 'Linkedin', NOW(), NOW()),
('https://github.com/juliasouza', 2, 'Genérico', NOW(), NOW()),
('https://github.com/carlossilva', 3, 'Genérico', NOW(), NOW()),
('https://linkedin.com/in/carlossilva', 3, 'Linkedin', NOW(), NOW()),
('https://wa.me/5511999999999', 3, 'Whatsapp', NOW(), NOW()),
('https://linkedin.com/in/anacosta', 4, 'Linkedin', NOW(), NOW()),
('https://facebook.com/anacosta', 4, 'Facebook', NOW(), NOW()),
('https://github.com/pedrosantos', 5, 'Genérico', NOW(), NOW()),
('https://linkedin.com/in/pedrosantos', 5, 'Linkedin', NOW(), NOW()),
('https://behance.net/mariaoliveira', 6, 'Genérico', NOW(), NOW()),
('https://linkedin.com/in/mariaoliveira', 6, 'Linkedin', NOW(), NOW()),
('https://instagram.com/mariaoliveira', 6, 'Instragram', NOW(), NOW());

-- Inserindo publicações (expandido)
INSERT INTO "Publicacao" (descricao, link, "idUsuario", "createdAt", "updatedAt")
VALUES
('Artigo sobre redes neurais', 'https://arxiv.org/ai', 1, NOW(), NOW()),
('Pesquisa sobre genômica', 'https://arxiv.org/bio', 2, NOW(), NOW()),
('Projeto de IA', 'https://github.com/josemachado/ai-project', 1, NOW(), NOW()),
('Projeto de Biotecnologia', 'https://github.com/juliasouza/bio-project', 2, NOW(), NOW()),
('Sistema de Gestão Agrícola', 'https://github.com/carlossilva/agri-system', 3, NOW(), NOW()),
('Análise de Dados Genômicos', 'https://pubmed.ncbi.nlm.nih.gov/12345', 4, NOW(), NOW()),
('Modelo Estatístico para Previsão', 'https://arxiv.org/stat/12345', 5, NOW(), NOW()),
('Portfolio de Design UX', 'https://behance.net/mariaoliveira/portfolio', 6, NOW(), NOW()),
('Artigo sobre Deep Learning', 'https://medium.com/@josemachado/deep-learning', 1, NOW(), NOW()),
('Estudo sobre CRISPR', 'https://nature.com/articles/crispr-study', 2, NOW(), NOW());

-- Inserindo colaboradores
INSERT INTO "Colaborador" (nome)
VALUES
('Dr. Roberto Lima'),
('Profa. Fernanda Alves'),
('Eng. Marcos Pereira'),
('Dra. Luciana Martins'),
('Prof. Ricardo Gomes'),
('Dra. Patrícia Rocha');

-- Relacionando colaboradores com projetos
-- Usando os valores corretos do enum colaboradorCategoria
INSERT INTO "projetoColaborador" (categoria, "idProjeto", "idColaborador", "createdAt", "updatedAt")
VALUES
('Cordenador(a)', 1, 1, NOW(), NOW()),
('Colaborador(a)', 1, 2, NOW(), NOW()),
('Cordenador(a)', 2, 3, NOW(), NOW()),
('Bolsista', 2, 4, NOW(), NOW()),
('Cordenador(a)', 3, 5, NOW(), NOW()),
('Voluntário', 3, 6, NOW(), NOW()),
('Colaborador(a)', 4, 1, NOW(), NOW()),
('Cordenador(a)', 5, 2, NOW(), NOW()),
('Colaborador(a)', 6, 3, NOW(), NOW());

-- Relacionando usuários com cursos (expandido)
INSERT INTO "cursoUsuario" ("idCurso", "idUsuario", "createdAt", "updatedAt")
VALUES
(1, 1, NOW(), NOW()),
(2, 2, NOW(), NOW()),
(3, 3, NOW(), NOW()),
(4, 4, NOW(), NOW()),
(5, 5, NOW(), NOW()),
(6, 6, NOW(), NOW()),
(1, 3, NOW(), NOW()),
(2, 4, NOW(), NOW()),
(3, 5, NOW(), NOW()),
(4, 6, NOW(), NOW());

-- Relacionando usuários com projetos (expandido)
INSERT INTO "projetoUsuario" ("idProjeto", "idUsuario", funcao, "createdAt", "updatedAt")
VALUES
(1, 1, 'Coordenador', NOW(), NOW()),
(2, 2, 'Coordenador', NOW(), NOW()),
(3, 3, 'Coordenador', NOW(), NOW()),
(4, 4, 'Coordenador', NOW(), NOW()),
(5, 5, 'Coordenador', NOW(), NOW()),
(6, 6, 'Coordenador', NOW(), NOW()),
(1, 2, 'Colaborador', NOW(), NOW()),
(2, 3, 'Bolsista', NOW(), NOW()),
(3, 4, 'Voluntário', NOW(), NOW()),
(4, 5, 'Colaborador', NOW(), NOW()),
(5, 6, 'Bolsista', NOW(), NOW());

-- Inserindo carreiras para os usuários
-- CORREÇÃO: Usando os valores corretos do enum categoriaCarreira
INSERT INTO "Carreira" (nome, descricao, categoria, "dataInicio", "dataFim", "idUsuario", "createdAt", "updatedAt")
VALUES
('Doutorado em IA', 'Pesquisa em redes neurais profundas', 'Formação acadêmica', '2018-03-01', '2022-12-15', 1, NOW(), NOW()),
('Mestrado em Computação', 'Especialização em segurança cibernética', 'Formação acadêmica', '2019-02-01', '2021-07-30', 2, NOW(), NOW()),
('Desenvolvedor Senior', 'Desenvolvimento de sistemas web', 'Experiencia profissional', '2020-01-15', '2024-01-15', 3, NOW(), NOW()),
('Pesquisadora em Biotecnologia', 'Pesquisa em genética molecular', 'Experiencia profissional', '2021-06-01', '2024-06-01', 4, NOW(), NOW()),
('Professor de Estatística', 'Ensino de métodos estatísticos', 'Experiencia profissional', '2019-08-01', '2024-08-01', 5, NOW(), NOW()),
('Designer UX/UI', 'Design de interfaces digitais', 'Experiencia profissional', '2022-03-01', '2024-12-31', 6, NOW(), NOW());