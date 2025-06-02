"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcryptjs_1 = __importDefault(require("bcryptjs"));

const prisma = new client_1.PrismaClient();
const SALT_ROUNDS = 10;

async function main() {
    console.log('Iniciando seed expandido...');

    // Função auxiliar para verificar se usuário existe
    async function criarUsuarioSeNaoExistir(dadosUsuario) {
        const usuarioExistente = await prisma.usuario.findUnique({
            where: { email: dadosUsuario.email }
        });
        
        if (usuarioExistente) {
            console.log(`Usuário ${dadosUsuario.email} já existe, pulando...`);
            return usuarioExistente;
        }
        
        return await prisma.usuario.create({ data: dadosUsuario });
    }

    // Função auxiliar para verificar se projeto existe
    async function criarProjetoSeNaoExistir(dadosProjeto) {
        const projetoExistente = await prisma.projeto.findFirst({
            where: { titulo: dadosProjeto.titulo }
        });
        
        if (projetoExistente) {
            console.log(`Projeto ${dadosProjeto.titulo} já existe, pulando...`);
            return projetoExistente;
        }
        
        return await prisma.projeto.create({ data: dadosProjeto });
    }

    // Função auxiliar para verificar se curso existe
    async function criarCursoSeNaoExistir(dadosCurso) {
        const cursoExistente = await prisma.curso.findFirst({
            where: { 
                titulo: dadosCurso.titulo,
                idProjeto: dadosCurso.idProjeto 
            }
        });
        
        if (cursoExistente) {
            console.log(`Curso ${dadosCurso.titulo} já existe no projeto, pulando...`);
            return cursoExistente;
        }
        
        return await prisma.curso.create({ data: dadosCurso });
    }

    // Senha criptografada para todos os usuários
    const senhaCriptografada = await bcryptjs_1.default.hash('senha123', SALT_ROUNDS);

    // 1. Criar usuários diversos
    console.log('Criando usuários...');
    const novosUsuarios = await Promise.all([
        criarUsuarioSeNaoExistir({
            email: 'joao.silva@example.com',
            fotoPerfil: '/prof1.jpg', 
            senha: senhaCriptografada,
            Nome: 'João Silva',
            Titulacao: client_1.Titulacao.Especialista,
            instituicaoEnsino: 'Instituto de Tecnologia XYZ',
            formacaoAcademica: 'Inteligência Artificial',
            resumoPessoal: 'Especialista em IA com 5 anos de experiência.',
            tipo: client_1.tipoUser.Normal,
        }),
        criarUsuarioSeNaoExistir({
            email: 'ana.souza@example.com',
            fotoPerfil: '/prof2.jpg', 
            senha: senhaCriptografada,
            Nome: 'Ana Souza',
            Titulacao: client_1.Titulacao.Doutor,
            instituicaoEnsino: 'Universidade de Dados ABC',
            formacaoAcademica: 'Big Data e Analytics',
            resumoPessoal: 'Doutora em Big Data com foco em machine learning.',
            tipo: client_1.tipoUser.Normal,
        }),
        criarUsuarioSeNaoExistir({
            email: 'carlos.santos@example.com',
            fotoPerfil: '/prof3.jpg', 
            senha: senhaCriptografada,
            Nome: 'Carlos Santos',
            Titulacao: client_1.Titulacao.Mestre,
            instituicaoEnsino: 'Universidade Federal da Bahia',
            formacaoAcademica: 'Engenharia de Software',
            resumoPessoal: 'Mestre em Engenharia de Software, especialista em desenvolvimento web.',
            tipo: client_1.tipoUser.Normal,
        }),
        criarUsuarioSeNaoExistir({
            email: 'maria.oliveira@example.com',
            fotoPerfil: '/prof4.jpg', 
            senha: senhaCriptografada,
            Nome: 'Maria Oliveira',
            Titulacao: client_1.Titulacao.Doutor,
            instituicaoEnsino: 'UEFS - Universidade Estadual de Feira de Santana',
            formacaoAcademica: 'Ciências da Computação',
            resumoPessoal: 'Doutora em Computação, pesquisadora em redes neurais.',
            tipo: client_1.tipoUser.Super,
        }),
        criarUsuarioSeNaoExistir({
            email: 'pedro.lima@example.com',
            fotoPerfil: '/prof1.jpg',
            senha: senhaCriptografada,
            Nome: 'Pedro Lima',
            Titulacao: client_1.Titulacao.Bacharel,
            instituicaoEnsino: 'Instituto Federal da Bahia',
            formacaoAcademica: 'Sistemas de Informação',
            resumoPessoal: 'Bacharel em SI, desenvolvedor full-stack e instrutor.',
            tipo: client_1.tipoUser.Normal,
        }),
        criarUsuarioSeNaoExistir({
            email: 'julia.ferreira@example.com',
            fotoPerfil: '/prof2.jpg', 
            senha: senhaCriptografada,
            Nome: 'Julia Ferreira',
            Titulacao: client_1.Titulacao.Especialista,
            instituicaoEnsino: 'SENAC Bahia',
            formacaoAcademica: 'Design Digital e UX/UI',
            resumoPessoal: 'Especialista em UX/UI Design com foco em acessibilidade.',
            tipo: client_1.tipoUser.Normal,
        }),
    ]);

    // 2. Criar projetos diversos
    console.log('Criando projetos...');
    const projetos = await Promise.all([
        criarProjetoSeNaoExistir({
            titulo: 'Tecnologia da Informação',
            imagem: '/proj1.jpg',
            descricao: 'Projeto de capacitação em tecnologias emergentes.',
            categoria: 'TECNOLOGIA',
            dataInicio: new Date('2024-01-01'),
            dataFim: new Date('2024-12-31'),
        }),
        criarProjetoSeNaoExistir({
            titulo: 'Desenvolvimento Web Moderno',
            imagem: '/proj2.jpg',
            descricao: 'Projeto focado em ensinar as mais modernas tecnologias web.',
            categoria: 'DESENVOLVIMENTO',
            dataInicio: new Date('2024-03-01'),
            dataFim: new Date('2024-11-30'),
        }),
        criarProjetoSeNaoExistir({
            titulo: 'Ciência de Dados na Prática',
            imagem: '/proj3.jpg',
            descricao: 'Projeto de aplicação prática de ciência de dados em problemas reais.',
            categoria: 'DATA_SCIENCE',
            dataInicio: new Date('2024-02-15'),
            dataFim: new Date('2024-10-15'),
        }),
        criarProjetoSeNaoExistir({
            titulo: 'Design e Experiência do Usuário',
            imagem: '/proj4.jpg',
            descricao: 'Projeto de formação em design centrado no usuário.',
            categoria: 'DESIGN',
            dataInicio: new Date('2024-04-01'),
            dataFim: new Date('2024-09-30'),
        }),
        criarProjetoSeNaoExistir({
            titulo: 'Agricultura Digital',
            imagem: '/proj5.jpg',
            descricao: 'Projeto de digitalização e modernização da agricultura.',
            categoria: 'AGRO_TECH',
            dataInicio: new Date('2024-05-01'),
            dataFim: new Date('2025-04-30'),
        }),
        criarProjetoSeNaoExistir({
            titulo: 'Cibersegurança e Proteção Digital',
            imagem: '/proj1.jpg',
            descricao: 'Projeto de capacitação em segurança da informação e proteção contra ameaças digitais.',
            categoria: 'SEGURANCA',
            dataInicio: new Date('2024-06-01'),
            dataFim: new Date('2025-05-31'),
        }),
        criarProjetoSeNaoExistir({
            titulo: 'Inovação em Saúde Digital',
            imagem: '/proj2.jpg',
            descricao: 'Projeto voltado para desenvolvimento de soluções tecnológicas na área da saúde.',
            categoria: 'SAUDE_TECH',
            dataInicio: new Date('2024-07-15'),
            dataFim: new Date('2025-01-15'),
        }),
        criarProjetoSeNaoExistir({
            titulo: 'Sustentabilidade e Tecnologia Verde',
            imagem: '/proj3.jpg',
            descricao: 'Projeto de desenvolvimento de tecnologias sustentáveis e energias renováveis.',
            categoria: 'GREEN_TECH',
            dataInicio: new Date('2024-08-01'),
            dataFim: new Date('2025-07-31'),
        }),
    ]);

    // 3. Criar colaboradores se não existirem
    console.log('Criando colaboradores...');
    const colaboradores = [];
    const nomesColaboradores = [
        'João Silva', 'Maria Souza', 'Carlos Mendes', 'Ana Paula',
        'Roberto Costa', 'Fernanda Alves', 'Ricardo Pereira'
    ];

    for (const nome of nomesColaboradores) {
        const colaboradorExistente = await prisma.colaborador.findFirst({
            where: { nome }
        });
        
        if (!colaboradorExistente) {
            const novoColaborador = await prisma.colaborador.create({
                data: { nome }
            });
            colaboradores.push(novoColaborador);
        } else {
            colaboradores.push(colaboradorExistente);
        }
    }

    // 4. Associar colaboradores aos projetos
    console.log('Associando colaboradores aos projetos...');
    const associacoesColaborador = [
        { colaboradorIdx: 0, projetoIdx: 0, categoria: client_1.colaboradorCategoria.Coordenador },
        { colaboradorIdx: 1, projetoIdx: 0, categoria: client_1.colaboradorCategoria.Bolsista },
        { colaboradorIdx: 2, projetoIdx: 1, categoria: client_1.colaboradorCategoria.Coordenador },
        { colaboradorIdx: 3, projetoIdx: 1, categoria: client_1.colaboradorCategoria.Colaborador },
        { colaboradorIdx: 4, projetoIdx: 2, categoria: client_1.colaboradorCategoria.Coordenador },
        { colaboradorIdx: 5, projetoIdx: 3, categoria: client_1.colaboradorCategoria.Coordenador },
        { colaboradorIdx: 6, projetoIdx: 4, categoria: client_1.colaboradorCategoria.Voluntário },
        { colaboradorIdx: 0, projetoIdx: 5, categoria: client_1.colaboradorCategoria.Coordenador },
        { colaboradorIdx: 1, projetoIdx: 6, categoria: client_1.colaboradorCategoria.Coordenador },
        { colaboradorIdx: 2, projetoIdx: 7, categoria: client_1.colaboradorCategoria.Voluntário },
    ];

    for (const assoc of associacoesColaborador) {
        const existeAssociacao = await prisma.projetoColaborador.findFirst({
            where: {
                idColaborador: colaboradores[assoc.colaboradorIdx].id,
                idProjeto: projetos[assoc.projetoIdx].id,
            }
        });

        if (!existeAssociacao) {
            await prisma.projetoColaborador.create({
                data: {
                    idColaborador: colaboradores[assoc.colaboradorIdx].id,
                    idProjeto: projetos[assoc.projetoIdx].id,
                    categoria: assoc.categoria,
                }
            });
        }
    }

    // 5. Criar cursos diversos
    console.log('Criando cursos...');
    const cursosData = [
        {
            titulo: 'Python para Iniciantes',
            imagem: '/proj1.jpg',
            descricao: 'Curso completo de programação em Python do básico ao avançado.',
            categoria: client_1.categoriaCurso.ComputacaoETecnologiaDaInformacao,
            cargaHoraria: 40,
            linkInscricao: 'https://inscricao.com/python',
            vagas: 30,
            bibliografia: 'Python Crash Course, Automate the Boring Stuff',
            metodologia: 'Aulas práticas com projetos reais',
            metodoAvaliacao: 'Projetos práticos e exercícios',
            idProjeto: projetos[0].id,
            idUsuario: novosUsuarios[0].id,
        },
        {
            titulo: 'JavaScript e Node.js',
            imagem: '/proj2.jpg',
            descricao: 'Desenvolvimento web moderno com JavaScript e Node.js.',
            categoria: client_1.categoriaCurso.ComputacaoETecnologiaDaInformacao,
            cargaHoraria: 60,
            linkInscricao: 'https://inscricao.com/javascript',
            vagas: 25,
            bibliografia: 'Eloquent JavaScript, You Don\'t Know JS',
            metodologia: 'Projetos práticos e pair programming',
            metodoAvaliacao: 'Desenvolvimento de aplicações web',
            idProjeto: projetos[1].id,
            idUsuario: novosUsuarios[2].id,
        },
        {
            titulo: 'React e desenvolvimento Frontend',
            imagem: '/proj3.jpg',
            descricao: 'Criação de interfaces modernas com React e bibliotecas complementares.',
            categoria: client_1.categoriaCurso.ComputacaoETecnologiaDaInformacao,
            cargaHoraria: 50,
            linkInscricao: 'https://inscricao.com/react',
            vagas: 20,
            bibliografia: 'Learning React, React Up & Running',
            metodologia: 'Desenvolvimento de SPAs e componentes reutilizáveis',
            metodoAvaliacao: 'Portfólio de projetos React',
            idProjeto: projetos[1].id,
            idUsuario: novosUsuarios[4].id,
        },
        {
            titulo: 'Análise de Dados com Python',
            imagem: '/proj4.jpg',
            descricao: 'Análise e visualização de dados usando Python, Pandas e Matplotlib.',
            categoria: client_1.categoriaCurso.MatematicaEEstatistica,
            cargaHoraria: 45,
            linkInscricao: 'https://inscricao.com/analise-dados',
            vagas: 35,
            bibliografia: 'Python for Data Analysis, Data Science from Scratch',
            metodologia: 'Análise de datasets reais e estudos de caso',
            metodoAvaliacao: 'Relatórios de análise e dashboards',
            idProjeto: projetos[2].id,
            idUsuario: novosUsuarios[1].id,
        },
        {
            titulo: 'UX/UI Design Fundamentals',
            imagem: '/proj5.jpg',
            descricao: 'Fundamentos de design centrado no usuário e interfaces intuitivas.',
            categoria: client_1.categoriaCurso.ArtesEHumanidades,
            cargaHoraria: 35,
            linkInscricao: 'https://inscricao.com/ux-ui',
            vagas: 25,
            bibliografia: 'Don\'t Make Me Think, The Design of Everyday Things',
            metodologia: 'Workshops práticos e prototipação',
            metodoAvaliacao: 'Portfólio de projetos de design',
            idProjeto: projetos[3].id,
            idUsuario: novosUsuarios[5].id,
        },
        {
            titulo: 'Machine Learning na Prática',
            imagem: '/proj1.jpg',
            descricao: 'Implementação de algoritmos de aprendizado de máquina.',
            categoria: client_1.categoriaCurso.CienciasNaturais,
            cargaHoraria: 55,
            linkInscricao: 'https://inscricao.com/machine-learning',
            vagas: 15,
            bibliografia: 'Hands-On Machine Learning, Pattern Recognition',
            metodologia: 'Implementação prática de algoritmos',
            metodoAvaliacao: 'Projetos de ML aplicados',
            idProjeto: projetos[2].id,
            idUsuario: novosUsuarios[3].id,
        },
        {
            titulo: 'Tecnologias para Agricultura',
            imagem: '/proj2.jpg',
            descricao: 'Aplicação de IoT e sensores na agricultura moderna.',
            categoria: client_1.categoriaCurso.Agricultura,
            cargaHoraria: 40,
            linkInscricao: 'https://inscricao.com/agro-tech',
            vagas: 30,
            bibliografia: 'Precision Agriculture, IoT in Agriculture',
            metodologia: 'Estudos de caso e projetos práticos',
            metodoAvaliacao: 'Desenvolvimento de soluções agro-tecnológicas',
            idProjeto: projetos[4].id,
            idUsuario: novosUsuarios[0].id,
        },
        // NOVO CURSO
        {
            titulo: 'Segurança da Informação e Ethical Hacking',
            imagem: '/proj3.jpg',
            descricao: 'Curso abrangente sobre segurança cibernética, testes de penetração e proteção de sistemas.',
            categoria: client_1.categoriaCurso.ComputacaoETecnologiaDaInformacao,
            cargaHoraria: 80,
            linkInscricao: 'https://inscricao.com/cybersecurity',
            vagas: 20,
            bibliografia: 'The Web Application Hacker\'s Handbook, Metasploit: The Penetration Tester\'s Guide',
            metodologia: 'Laboratórios práticos de pentest e análise de vulnerabilidades',
            metodoAvaliacao: 'Relatórios de penetration testing e projetos de segurança',
            idProjeto: projetos[5].id, // Projeto de Cibersegurança
            idUsuario: novosUsuarios[2].id,
        },
    ];

    const cursos = [];
    for (const cursoData of cursosData) {
        const curso = await criarCursoSeNaoExistir(cursoData);
        cursos.push(curso);
    }

    // 6. Criar aulas para os cursos
    console.log('Criando aulas...');
    const aulasData = [
        // Aulas para Python
        { titulo: 'Introdução ao Python', idCurso: 0, linkPdf: 'https://example.com/python_intro.pdf', linkVideo: 'https://example.com/python_intro.mp4' },
        { titulo: 'Estruturas de Dados em Python', idCurso: 0, linkPdf: 'https://example.com/python_data.pdf', linkVideo: 'https://example.com/python_data.mp4' },
        { titulo: 'Programação Orientada a Objetos', idCurso: 0, linkPdf: 'https://example.com/python_oop.pdf', linkVideo: 'https://example.com/python_oop.mp4' },
        
        // Aulas para JavaScript
        { titulo: 'Fundamentos do JavaScript', idCurso: 1, linkPdf: 'https://example.com/js_basics.pdf', linkVideo: 'https://example.com/js_basics.mp4' },
        { titulo: 'Node.js e NPM', idCurso: 1, linkPdf: 'https://example.com/nodejs.pdf', linkVideo: 'https://example.com/nodejs.mp4' },
        
        // Aulas para React
        { titulo: 'Introdução ao React', idCurso: 2, linkPdf: 'https://example.com/react_intro.pdf', linkVideo: 'https://example.com/react_intro.mp4' },
        { titulo: 'Hooks no React', idCurso: 2, linkPdf: 'https://example.com/react_hooks.pdf', linkVideo: 'https://example.com/react_hooks.mp4' },
        
        // Aulas para Análise de Dados
        { titulo: 'Pandas para Análise', idCurso: 3, linkPdf: 'https://example.com/pandas.pdf', linkVideo: 'https://example.com/pandas.mp4' },
        { titulo: 'Visualização com Matplotlib', idCurso: 3, linkPdf: 'https://example.com/matplotlib.pdf', linkVideo: 'https://example.com/matplotlib.mp4' },
        
        // Aulas para o novo curso de Segurança da Informação
        { titulo: 'Fundamentos de Segurança da Informação', idCurso: 7, linkPdf: 'https://example.com/security_fundamentals.pdf', linkVideo: 'https://example.com/security_fundamentals.mp4' },
        { titulo: 'Ethical Hacking e Penetration Testing', idCurso: 7, linkPdf: 'https://example.com/ethical_hacking.pdf', linkVideo: 'https://example.com/ethical_hacking.mp4' },
        { titulo: 'Análise de Vulnerabilidades', idCurso: 7, linkPdf: 'https://example.com/vulnerability_analysis.pdf', linkVideo: 'https://example.com/vulnerability_analysis.mp4' },
    ];

    for (const aulaData of aulasData) {
        const aulaExistente = await prisma.aula.findFirst({
            where: {
                titulo: aulaData.titulo,
                idCurso: cursos[aulaData.idCurso].id
            }
        });

        if (!aulaExistente) {
            await prisma.aula.create({
                data: {
                    titulo: aulaData.titulo,
                    linkPdf: aulaData.linkPdf,
                    linkVideo: aulaData.linkVideo,
                    idCurso: cursos[aulaData.idCurso].id,
                }
            });
        }
    }

    // 7. Criar eventos diversos
    console.log('Criando eventos...');
    const eventosData = [
        {
            titulo: 'Workshop de Python Avançado',
            descricao: 'Workshop prático sobre técnicas avançadas em Python.',
            data: new Date('2024-07-15'),
            linkParticipacao: '/event1.jpg',
        },
        {
            titulo: 'Hackathon de Desenvolvimento Web',
            descricao: 'Competição de desenvolvimento de aplicações web.',
            data: new Date('2024-08-20'),
            linkParticipacao: '/event2.jpg',
        },
        {
            titulo: 'Conferência de UX Design',
            descricao: 'Tendências e práticas em UX/UI Design.',
            data: new Date('2024-09-05'),
            linkParticipacao: '/event3.jpg',
        },
        {
            titulo: 'Seminário de Agricultura 4.0',
            descricao: 'Tecnologias emergentes na agricultura.',
            data: new Date('2024-10-10'),
            linkParticipacao: '/event2.jpg',
        },
    ];

    for (const eventoData of eventosData) {
        const eventoExistente = await prisma.evento.findFirst({
            where: { titulo: eventoData.titulo }
        });

        if (!eventoExistente) {
            await prisma.evento.create({ data: eventoData });
        }
    }

    // 8. Criar links para os usuários
    console.log('Criando links dos usuários...');
    const linksData = [
        { link: 'https://linkedin.com/in/joaosilva', email: 'joao.silva@example.com', tipo: client_1.tipoLink.Linkedin },
        { link: 'https://github.com/joaosilva', email: 'joao.silva@example.com', tipo: client_1.tipoLink.Genérico },
        { link: 'https://twitter.com/anasouza', email: 'ana.souza@example.com', tipo: client_1.tipoLink.Genérico },
        { link: 'https://linkedin.com/in/anasouza', email: 'ana.souza@example.com', tipo: client_1.tipoLink.Linkedin },
        { link: 'https://portfolio.carlos.dev', email: 'carlos.santos@example.com', tipo: client_1.tipoLink.Genérico },
        { link: 'https://instagram.com/mariaoliveira', email: 'maria.oliveira@example.com', tipo: client_1.tipoLink.Instragram },
        { link: 'https://dribbble.com/juliaferreira', email: 'julia.ferreira@example.com', tipo: client_1.tipoLink.Genérico },
    ];

    // Buscar todos os usuários para garantir que temos IDs válidos
    const todosUsuariosParaLinks = await prisma.usuario.findMany({
        select: { id: true, email: true, Nome: true }
    });

    for (const linkData of linksData) {
        // Encontrar o usuário pelo email
        const usuario = todosUsuariosParaLinks.find(u => u.email === linkData.email);
        
        if (!usuario) {
            console.log(`Usuário com email ${linkData.email} não encontrado, pulando link...`);
            continue;
        }

        const linkExistente = await prisma.link.findFirst({
            where: {
                link: linkData.link,
                idUsuario: usuario.id,
            }
        });

        if (!linkExistente) {
            await prisma.link.create({
                data: {
                    link: linkData.link,
                    idUsuario: usuario.id,
                    tipo: linkData.tipo,
                }
            });
            console.log(`✅ Link criado para ${usuario.Nome}: ${linkData.link}`);
        } else {
            console.log(`Link ${linkData.link} já existe para ${usuario.Nome}`);
        }
    }

    // 9. Criar publicações
    console.log('Criando publicações...');
    const publicacoesData = [
        { descricao: 'Artigo sobre Machine Learning em Python', link: 'https://arxiv.org/ml-python', email: 'joao.silva@example.com' },
        { descricao: 'Estudo sobre Big Data Analytics', link: 'https://arxiv.org/bigdata-analytics', email: 'ana.souza@example.com' },
        { descricao: 'Guia de Desenvolvimento Web Moderno', link: 'https://medium.com/web-dev', email: 'carlos.santos@example.com' },
        { descricao: 'Pesquisa em Redes Neurais Convolucionais', link: 'https://arxiv.org/cnn-research', email: 'maria.oliveira@example.com' },
        { descricao: 'Tutorial de React Hooks', link: 'https://dev.to/react-hooks', email: 'pedro.lima@example.com' },
        { descricao: 'Design System e Acessibilidade', link: 'https://uxdesign.cc/design-system', email: 'julia.ferreira@example.com' },
    ];

    // Buscar todos os usuários para garantir que temos IDs válidos
    const todosUsuariosParaPublicacoes = await prisma.usuario.findMany({
        select: { id: true, email: true, Nome: true }
    });

    for (const pubData of publicacoesData) {
        // Encontrar o usuário pelo email
        const usuario = todosUsuariosParaPublicacoes.find(u => u.email === pubData.email);
        
        if (!usuario) {
            console.log(`Usuário com email ${pubData.email} não encontrado, pulando publicação...`);
            continue;
        }

        const publicacaoExistente = await prisma.publicacao.findFirst({
            where: {
                link: pubData.link,
                idUsuario: usuario.id,
            }
        });

        if (!publicacaoExistente) {
            await prisma.publicacao.create({
                data: {
                    descricao: pubData.descricao,
                    link: pubData.link,
                    idUsuario: usuario.id,
                }
            });
            console.log(`✅ Publicação criada para ${usuario.Nome}: ${pubData.descricao}`);
        } else {
            console.log(`Publicação "${pubData.descricao}" já existe para ${usuario.Nome}`);
        }
    }

    // 10. Criar carreiras para os usuários
    console.log('Criando carreiras...');
    
    // Buscar todos os usuários para garantir que temos IDs válidos
    const todosUsuarios = await prisma.usuario.findMany({
        select: { id: true, email: true, Nome: true }
    });
    
    if (todosUsuarios.length === 0) {
        console.log('Nenhum usuário encontrado, pulando criação de carreiras...');
        return;
    }

    const carreirasData = [
        {
            nome: 'Desenvolvedor Full Stack',
            descricao: 'Desenvolvimento de aplicações web completas',
            categoria: client_1.categoriaCarreira.profissional,
            dataInicio: new Date('2020-01-01'),
            dataFim: new Date('2023-12-31'),
            email: 'joao.silva@example.com',
        },
        {
            nome: 'Cientista de Dados',
            descricao: 'Análise e modelagem de dados para insights de negócio',
            categoria: client_1.categoriaCarreira.profissional,
            dataInicio: new Date('2019-06-01'),
            dataFim: new Date('2024-05-31'),
            email: 'ana.souza@example.com',
        },
        {
            nome: 'Mestrado em Ciência da Computação',
            descricao: 'Pesquisa em algoritmos de otimização',
            categoria: client_1.categoriaCarreira.acadêmica,
            dataInicio: new Date('2021-03-01'),
            dataFim: new Date('2023-02-28'),
            email: 'carlos.santos@example.com',
        },
        {
            nome: 'Doutorado em Ciências da Computação',
            descricao: 'Pesquisa em redes neurais e deep learning',
            categoria: client_1.categoriaCarreira.acadêmica,
            dataInicio: new Date('2018-03-01'),
            dataFim: new Date('2022-12-15'),
            email: 'maria.oliveira@example.com',
        },
        {
            nome: 'Analista de Sistemas',
            descricao: 'Análise e desenvolvimento de sistemas corporativos',
            categoria: client_1.categoriaCarreira.profissional,
            dataInicio: new Date('2021-01-15'),
            dataFim: new Date('2024-01-15'),
            email: 'pedro.lima@example.com',
        },
        {
            nome: 'UX Designer',
            descricao: 'Design de experiência do usuário para aplicações web e mobile',
            categoria: client_1.categoriaCarreira.profissional,
            dataInicio: new Date('2022-06-01'),
            dataFim: new Date('2024-05-31'),
            email: 'julia.ferreira@example.com',
        },
    ];

    for (const carreiraData of carreirasData) {
        // Encontrar o usuário pelo email
        const usuario = todosUsuarios.find(u => u.email === carreiraData.email);
        
        if (!usuario) {
            console.log(`Usuário com email ${carreiraData.email} não encontrado, pulando carreira ${carreiraData.nome}...`);
            continue;
        }

        const carreiraExistente = await prisma.carreira.findFirst({
            where: {
                nome: carreiraData.nome,
                idUsuario: usuario.id,
            }
        });

        if (!carreiraExistente) {
            await prisma.carreira.create({
                data: {
                    nome: carreiraData.nome,
                    descricao: carreiraData.descricao,
                    categoria: carreiraData.categoria,
                    dataInicio: carreiraData.dataInicio,
                    dataFim: carreiraData.dataFim,
                    idUsuario: usuario.id,
                }
            });
            console.log(`✅ Carreira "${carreiraData.nome}" criada para ${usuario.Nome}`);
        } else {
            console.log(`Carreira "${carreiraData.nome}" já existe para ${usuario.Nome}`);
        }
    }

    console.log('🎉 Seed expandido concluído com sucesso!');
    console.log(`✅ Usuários criados/verificados: ${novosUsuarios.length}`);
    console.log(`✅ Projetos criados/verificados: ${projetos.length}`);
    console.log(`✅ Cursos criados/verificados: ${cursos.length}`);
    console.log(`✅ Colaboradores criados/verificados: ${colaboradores.length}`);
}

main()
    .catch((e) => {
        console.error('❌ Erro no seed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });