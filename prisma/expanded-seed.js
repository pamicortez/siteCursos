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
            email: 'pamela@uefs.br',
            fotoPerfil: '/foto_pamela.jpg',
            senha: '$2b$10$JWQLu9Puay/5Qot040zvbO8sVSDNuYPjIrL9maYOC8Vr2KC86fxAa',
            Nome: 'Pâmela Cândida',
            Titulacao: client_1.Titulacao.Doutor,
            instituicaoEnsino: 'The University of Melbourne',
            formacaoAcademica: 'Ciências de Computação',
            resumoPessoal: 'Doutorado em Operations Research',
            tipo: client_1.tipoUser.Super,
        }),
        criarUsuarioSeNaoExistir({
            email: 'ana.souza@example.com',
            fotoPerfil: '/professor_woman_1.jpg',
            senha: senhaCriptografada,
            Nome: 'Ana Souza',
            Titulacao: client_1.Titulacao.Doutor,
            instituicaoEnsino: 'The University of Melbourne',
            formacaoAcademica: 'Big Data e Analytics',
            resumoPessoal: 'Doutora em Big Data com foco em machine learning.',
            tipo: client_1.tipoUser.Normal,
        }),
        criarUsuarioSeNaoExistir({
            email: 'carlos.santos@example.com',
            fotoPerfil: '/professor_man_2.jpg',
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
            fotoPerfil: '/professor_woman_2.jpg',
            senha: senhaCriptografada,
            Nome: 'Maria Oliveira',
            Titulacao: client_1.Titulacao.Doutor,
            instituicaoEnsino: 'UEFS - Universidade Estadual de Feira de Santana',
            formacaoAcademica: 'Ciências da Computação',
            resumoPessoal: 'Doutora em Computação, pesquisadora em redes neurais.',
            tipo: client_1.tipoUser.Normal,
        }),
        criarUsuarioSeNaoExistir({
            email: 'pedro.lima@example.com',
            fotoPerfil: '/professor_man_3.jpg',
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
            fotoPerfil: '/professor_woman_3.jpg',
            senha: senhaCriptografada,
            Nome: 'Julia Ferreira',
            Titulacao: client_1.Titulacao.Especialista,
            instituicaoEnsino: 'SENAC Bahia',
            formacaoAcademica: 'Design Digital e UX/UI',
            resumoPessoal: 'Especialista em UX/UI Design com foco em acessibilidade.',
            tipo: client_1.tipoUser.Normal,
        }),
        criarUsuarioSeNaoExistir({
            email: 'ricardo.mendes@example.com',
            fotoPerfil: '/professor_man_4.jpg',
            senha: senhaCriptografada,
            Nome: 'Ricardo Mendes',
            Titulacao: client_1.Titulacao.Especialista,
            instituicaoEnsino: 'Universidade Salvador',
            formacaoAcademica: 'Segurança da Informação',
            resumoPessoal: 'Especialista em cibersegurança e ethical hacking.',
            tipo: client_1.tipoUser.Normal,
        }),
        criarUsuarioSeNaoExistir({
            email: 'fernanda.costa@example.com',
            fotoPerfil: '/professor_woman_4.jpg',
            senha: senhaCriptografada,
            Nome: 'Fernanda Costa',
            Titulacao: client_1.Titulacao.Mestre,
            instituicaoEnsino: 'UFBA - Universidade Federal da Bahia',
            formacaoAcademica: 'Química Aplicada',
            resumoPessoal: 'Mestre em Química com foco em análise de materiais.',
            tipo: client_1.tipoUser.Normal,
        }),
        criarUsuarioSeNaoExistir({
            email: 'marcos.silva@example.com',
            fotoPerfil: '/professor_man_5.jpg',
            senha: senhaCriptografada,
            Nome: 'Marcos Silva',
            Titulacao: client_1.Titulacao.Doutor,
            instituicaoEnsino: 'UESC - Universidade Estadual de Santa Cruz',
            formacaoAcademica: 'Física Teórica',
            resumoPessoal: 'Doutor em Física, pesquisador em física quântica.',
            tipo: client_1.tipoUser.Normal,
        }),
        criarUsuarioSeNaoExistir({
            email: 'lucia.santos@example.com',
            fotoPerfil: '/professor_woman_5.jpg',
            senha: senhaCriptografada,
            Nome: 'Lúcia Santos',
            Titulacao: client_1.Titulacao.Mestre,
            instituicaoEnsino: 'UNEB - Universidade do Estado da Bahia',
            formacaoAcademica: 'História Social',
            resumoPessoal: 'Mestre em História, especialista em história do Brasil.',
            tipo: client_1.tipoUser.Normal,
        }),
    ]);

    // 2. Criar projetos diversos
    console.log('Criando projetos...');
    const projetos = await Promise.all([
        criarProjetoSeNaoExistir({
            titulo: 'Tecnologia da Informação',
            imagem: '/project_information_technology.jpg',
            descricao: 'Projeto de capacitação em tecnologias emergentes.',
            categoria: 'Tecnologia e Computação',
            dataInicio: new Date('2024-01-01'),
            dataFim: new Date('2024-12-31'),
        }),
        criarProjetoSeNaoExistir({
            titulo: 'Desenvolvimento Web Moderno',
            imagem: '/project_network.jpg',
            descricao: 'Projeto focado em ensinar as mais modernas tecnologias web.',
            categoria: 'Tecnologia e Computação',
            dataInicio: new Date('2024-03-01'),
            dataFim: new Date('2024-11-30'),
        }),
        criarProjetoSeNaoExistir({
            titulo: 'Ciência de Dados na Prática',
            imagem: '/project_math.jpg',
            descricao: 'Projeto de aplicação prática de ciência de dados em problemas reais.',
            categoria: 'Ciências Exatas',
            dataInicio: new Date('2024-02-15'),
            dataFim: new Date('2024-10-15'),
        }),
        criarProjetoSeNaoExistir({
            titulo: 'Design e Experiência do Usuário',
            imagem: '/course_ux_ui.jpg',
            descricao: 'Projeto de formação em design centrado no usuário.',
            categoria: 'Artes e Cultura',
            dataInicio: new Date('2024-04-01'),
            dataFim: new Date('2024-09-30'),
        }),
        criarProjetoSeNaoExistir({
            titulo: 'Agricultura Digital',
            imagem: '/course_agriculture.jpg',
            descricao: 'Projeto de digitalização e modernização da agricultura.',
            categoria: 'Ciências Agrárias',
            dataInicio: new Date('2024-05-01'),
            dataFim: new Date('2025-04-30'),
        }),
        criarProjetoSeNaoExistir({
            titulo: 'Cibersegurança e Proteção Digital',
            imagem: '/project_cyber_security.jpg',
            descricao: 'Projeto de capacitação em segurança da informação e proteção contra ameaças digitais.',
            categoria: 'Tecnologia e Computação',
            dataInicio: new Date('2024-06-01'),
            dataFim: new Date('2025-05-31'),
        }),
        criarProjetoSeNaoExistir({
            titulo: 'Inovação em Saúde Digital',
            imagem: '/project_health.jpg',
            descricao: 'Projeto voltado para desenvolvimento de soluções tecnológicas na área da saúde.',
            categoria: 'Saúde e Bem-Estar',
            dataInicio: new Date('2024-07-15'),
            dataFim: new Date('2025-01-15'),
        }),
        criarProjetoSeNaoExistir({
            titulo: 'Sustentabilidade e Tecnologia Verde',
            imagem: '/project_sustainability.jpg',
            descricao: 'Projeto de desenvolvimento de tecnologias sustentáveis e energias renováveis.',
            categoria: 'Meio Ambiente e Sustentabilidade',
            dataInicio: new Date('2024-08-01'),
            dataFim: new Date('2025-07-31'),
        }),
        criarProjetoSeNaoExistir({
            titulo: 'Química Aplicada e Análise de Materiais',
            imagem: '/project_chemistry.jpg',
            descricao: 'Projeto de pesquisa em química aplicada para desenvolvimento de novos materiais.',
            categoria: 'Ciências Biológicas e Naturais',
            dataInicio: new Date('2024-09-01'),
            dataFim: new Date('2025-08-31'),
        }),
        criarProjetoSeNaoExistir({
            titulo: 'Física Moderna e Aplicações Tecnológicas',
            imagem: '/project_physics.jpg',
            descricao: 'Projeto de estudo da física moderna e suas aplicações em tecnologias emergentes.',
            categoria: 'Ciências Exatas',
            dataInicio: new Date('2024-10-01'),
            dataFim: new Date('2025-09-30'),
        }),
    ]);

    // 3. Criar associações projetoUsuario (NOVO)
    console.log('Criando associações projetoUsuario...');

    // Função auxiliar para verificar se associação existe
    async function criarAssociacaoProjetoUsuarioSeNaoExistir(dadosAssociacao) {
        const associacaoExistente = await prisma.projetoUsuario.findFirst({
            where: {
                idProjeto: dadosAssociacao.idProjeto,
                idUsuario: dadosAssociacao.idUsuario
            }
        });

        if (associacaoExistente) {
            console.log(`Associação projeto-usuário já existe, pulando...`);
            return associacaoExistente;
        }

        return await prisma.projetoUsuario.create({ data: dadosAssociacao });
    }

    // Associações projetoUsuario - garantindo que cada projeto tenha pelo menos uma associação
    const associacoesProjetoUsuario = [
        // João Silva (índice 0) - responsável pelo projeto TI (índice 0)
        {
            idProjeto: projetos[0].id,
            idUsuario: novosUsuarios[0].id,
            funcao: client_1.funcaoProjeto.Coordenador
        },

        // Ana Souza (índice 1) - responsável pelo projeto Ciência de Dados (índice 2)
        {
            idProjeto: projetos[2].id,
            idUsuario: novosUsuarios[1].id,
            funcao: client_1.funcaoProjeto.Coordenador
        },

        // Carlos Santos (índice 2) - responsável pelo projeto Desenvolvimento Web (índice 1)
        {
            idProjeto: projetos[1].id,
            idUsuario: novosUsuarios[2].id,
            funcao: client_1.funcaoProjeto.Coordenador
        },

        // Maria Oliveira (índice 3) - responsável pelo projeto Cibersegurança (índice 5)
        {
            idProjeto: projetos[5].id,
            idUsuario: novosUsuarios[3].id,
            funcao: client_1.funcaoProjeto.Coordenador
        },

        // Pedro Lima (índice 4) - colaborador no projeto Design UX/UI (índice 3)
        {
            idProjeto: projetos[3].id,
            idUsuario: novosUsuarios[4].id,
            funcao: client_1.funcaoProjeto.Colaborador
        },

        // Julia Ferreira (índice 5) - responsável pelo projeto Design UX/UI (índice 3)
        {
            idProjeto: projetos[3].id,
            idUsuario: novosUsuarios[5].id,
            funcao: client_1.funcaoProjeto.Coordenador
        },

        // Ricardo Mendes (índice 6) - colaborador no projeto Cibersegurança (índice 5)
        {
            idProjeto: projetos[5].id,
            idUsuario: novosUsuarios[6].id,
            funcao: client_1.funcaoProjeto.Colaborador
        },

        // Fernanda Costa (índice 7) - responsável pelo projeto Química (índice 8)
        {
            idProjeto: projetos[8].id,
            idUsuario: novosUsuarios[7].id,
            funcao: client_1.funcaoProjeto.Coordenador
        },

        // Marcos Silva (índice 8) - responsável pelo projeto Física (índice 9)
        {
            idProjeto: projetos[9].id,
            idUsuario: novosUsuarios[8].id,
            funcao: client_1.funcaoProjeto.Coordenador
        },

        // Lúcia Santos (índice 9) - responsável pelo projeto Agricultura Digital (índice 4)
        {
            idProjeto: projetos[4].id,
            idUsuario: novosUsuarios[9].id,
            funcao: client_1.funcaoProjeto.Coordenador
        },

        // Associações adicionais para projetos que ainda não têm coordenador
        // Projeto Saúde Digital (índice 6) - João Silva como colaborador
        {
            idProjeto: projetos[6].id,
            idUsuario: novosUsuarios[0].id,
            funcao: client_1.funcaoProjeto.Colaborador
        },

        // Projeto Sustentabilidade (índice 7) - Ana Souza como coordenadora
        {
            idProjeto: projetos[7].id,
            idUsuario: novosUsuarios[1].id,
            funcao: client_1.funcaoProjeto.Coordenador
        },
    ];

    // Criar as associações
    for (const associacao of associacoesProjetoUsuario) {
        try {
            await criarAssociacaoProjetoUsuarioSeNaoExistir(associacao);

            // Buscar informações para log
            const projeto = projetos.find(p => p.id === associacao.idProjeto);
            const usuario = novosUsuarios.find(u => u.id === associacao.idUsuario);

            console.log(`✅ Associação criada: ${usuario.Nome} -> ${projeto.titulo} (${associacao.funcao})`);
        } catch (error) {
            console.error(`❌ Erro ao criar associação projetoUsuario:`, error);
        }
    }

    // Verificar se todos os projetos têm pelo menos uma associação
    console.log('Verificando se todos os projetos têm associações...');
    for (const projeto of projetos) {
        const associacoes = await prisma.projetoUsuario.count({
            where: { idProjeto: projeto.id }
        });

        if (associacoes === 0) {
            console.log(`⚠️  AVISO: Projeto "${projeto.titulo}" não possui associações projetoUsuario!`);
        } else {
            console.log(`✅ Projeto "${projeto.titulo}" possui ${associacoes} associação(ões)`);
        }
    }

    // 4. Criar colaboradores se não existirem
    console.log('Criando colaboradores...');
    const colaboradores = [];
    const nomesColaboradores = [
        'Pâmela Cândida', 'Maria Souza', 'Carlos Mendes', 'Ana Paula',
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

    // 5. Associar colaboradores aos projetos (CORRIGIDO)
    console.log('Associando colaboradores aos projetos...');

    // Criar colaboradores baseados nos usuários, se não existirem
    const colaboradoresUsuarios = [];
    for (const usuario of novosUsuarios) {
        const colaboradorExistente = await prisma.colaborador.findFirst({
            where: { nome: usuario.Nome }
        });

        if (!colaboradorExistente) {
            const novoColaborador = await prisma.colaborador.create({
                data: { nome: usuario.Nome }
            });
            colaboradoresUsuarios.push(novoColaborador);
        } else {
            colaboradoresUsuarios.push(colaboradorExistente);
        }
    }

    // Associações corrigidas com índices válidos (baseado em 10 usuários e 10 projetos)
    const associacoesColaborador = [
        // João Silva (índice 0) - coordenador do projeto TI
        { colaboradorIdx: 0, projetoIdx: 0, categoria: client_1.colaboradorCategoria.Coordenador },

        // Ana Souza (índice 1) - coordenadora do projeto Ciência de Dados
        { colaboradorIdx: 1, projetoIdx: 2, categoria: client_1.colaboradorCategoria.Coordenador },

        // Carlos Santos (índice 2) - coordenador do projeto Desenvolvimento Web
        { colaboradorIdx: 2, projetoIdx: 1, categoria: client_1.colaboradorCategoria.Coordenador },

        // Maria Oliveira (índice 3) - coordenadora do projeto Cibersegurança
        { colaboradorIdx: 3, projetoIdx: 5, categoria: client_1.colaboradorCategoria.Coordenador },

        // Pedro Lima (índice 4) - colaborador no projeto TI
        { colaboradorIdx: 4, projetoIdx: 0, categoria: client_1.colaboradorCategoria.Colaborador },

        // Julia Ferreira (índice 5) - coordenadora do projeto Design UX/UI
        { colaboradorIdx: 5, projetoIdx: 3, categoria: client_1.colaboradorCategoria.Coordenador },

        // Ricardo Mendes (índice 6) - coordenador do projeto Cibersegurança (como segundo coordenador)
        { colaboradorIdx: 6, projetoIdx: 5, categoria: client_1.colaboradorCategoria.Voluntário },

        // Fernanda Costa (índice 7) - coordenadora do projeto Química
        { colaboradorIdx: 7, projetoIdx: 8, categoria: client_1.colaboradorCategoria.Coordenador },

        // Marcos Silva (índice 8) - coordenador do projeto Física
        { colaboradorIdx: 8, projetoIdx: 9, categoria: client_1.colaboradorCategoria.Coordenador },

        // Lúcia Santos (índice 9) - voluntária em projeto de Sustentabilidade
        { colaboradorIdx: 9, projetoIdx: 7, categoria: client_1.colaboradorCategoria.Voluntário },

        // Associações adicionais dentro dos limites válidos
        { colaboradorIdx: 0, projetoIdx: 4, categoria: client_1.colaboradorCategoria.Voluntário }, // João no projeto Agricultura
        { colaboradorIdx: 1, projetoIdx: 6, categoria: client_1.colaboradorCategoria.Bolsista }, // Ana no projeto Saúde Digital
        { colaboradorIdx: 2, projetoIdx: 7, categoria: client_1.colaboradorCategoria.Colaborador }, // Carlos no projeto Sustentabilidade
        { colaboradorIdx: 4, projetoIdx: 3, categoria: client_1.colaboradorCategoria.Bolsista }, // Pedro no projeto Design
    ];

    for (const assoc of associacoesColaborador) {
        // Verificar se os índices existem antes de usar
        if (assoc.colaboradorIdx >= colaboradoresUsuarios.length || assoc.projetoIdx >= projetos.length) {
            console.log(`Pulando associação - índices inválidos: colaborador ${assoc.colaboradorIdx}, projeto ${assoc.projetoIdx}`);
            continue;
        }

        const existeAssociacao = await prisma.projetoColaborador.findFirst({
            where: {
                idColaborador: colaboradoresUsuarios[assoc.colaboradorIdx].id,
                idProjeto: projetos[assoc.projetoIdx].id,
            }
        });

        if (!existeAssociacao) {
            await prisma.projetoColaborador.create({
                data: {
                    idColaborador: colaboradoresUsuarios[assoc.colaboradorIdx].id,
                    idProjeto: projetos[assoc.projetoIdx].id,
                    categoria: assoc.categoria,
                }
            });
            console.log(`✅ Associação criada: ${colaboradoresUsuarios[assoc.colaboradorIdx].nome} -> ${projetos[assoc.projetoIdx].titulo}`);
        } else {
            console.log(`Associação já existe: ${colaboradoresUsuarios[assoc.colaboradorIdx].nome} -> ${projetos[assoc.projetoIdx].titulo}`);
        }
    }


    // 6. Criar cursos diversos (CORRIGIDO)
    console.log('Criando cursos...');
    const cursosData = [
        {
            titulo: 'Python para Iniciantes',
            imagem: '/course_python.jpg',
            descricao: 'Curso completo de programação em Python do básico ao avançado.',
            categoria: client_1.categoriaCurso.TecnologiaEComputacao,
            cargaHoraria: 40,
            linkInscricao: 'https://inscricao.com/python',
            vagas: 30,
            bibliografia: 'Python Crash Course, Automate the Boring Stuff',
            metodologia: 'Aulas práticas com projetos reais',
            metodoAvaliacao: 'Projetos práticos e exercícios',
            idProjeto: projetos[0].id, // Usando índice 0
            idUsuario: novosUsuarios[0].id, // Usando índice 0
        },
        {
            titulo: 'JavaScript e Node.js',
            imagem: '/course_javascript.jpg',
            descricao: 'Desenvolvimento web moderno com JavaScript e Node.js.',
            categoria: client_1.categoriaCurso.TecnologiaEComputacao,
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
            imagem: '/course_react.jpg',
            descricao: 'Criação de interfaces modernas com React e bibliotecas complementares.',
            categoria: client_1.categoriaCurso.TecnologiaEComputacao,
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
            imagem: '/course_data_analysis.jpg',
            descricao: 'Análise e visualização de dados usando Python, Pandas e Matplotlib.',
            categoria: client_1.categoriaCurso.CienciasExatas,
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
            imagem: '/course_ux_ui.jpg',
            descricao: 'Fundamentos de design centrado no usuário e interfaces intuitivas.',
            categoria: client_1.categoriaCurso.ArtesECultura,
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
            imagem: '/course_machine_learning.jpg',
            descricao: 'Implementação de algoritmos de aprendizado de máquina.',
            categoria: client_1.categoriaCurso.CienciasExatas,
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
            imagem: '/course_agriculture.jpg',
            descricao: 'Aplicação de IoT e sensores na agricultura moderna.',
            categoria: client_1.categoriaCurso.CienciasAgrarias,
            cargaHoraria: 40,
            linkInscricao: 'https://inscricao.com/agro-tech',
            vagas: 30,
            bibliografia: 'Precision Agriculture, IoT in Agriculture',
            metodologia: 'Estudos de caso e projetos práticos',
            metodoAvaliacao: 'Desenvolvimento de soluções agro-tecnológicas',
            idProjeto: projetos[4].id,
            idUsuario: novosUsuarios[0].id,
        },
        {
            titulo: 'Segurança da Informação e Ethical Hacking',
            imagem: '/course_hacking.jpg',
            descricao: 'Curso abrangente sobre segurança cibernética, testes de penetração e proteção de sistemas.',
            categoria: client_1.categoriaCurso.TecnologiaEComputacao,
            cargaHoraria: 80,
            linkInscricao: 'https://inscricao.com/cybersecurity',
            vagas: 20,
            bibliografia: 'The Web Application Hacker\'s Handbook, Metasploit: The Penetration Tester\'s Guide',
            metodologia: 'Laboratórios práticos de pentest e análise de vulnerabilidades',
            metodoAvaliacao: 'Relatórios de penetration testing e projetos de segurança',
            idProjeto: projetos[5].id,
            idUsuario: novosUsuarios[6].id,
        },
        {
            titulo: 'Química Analítica e Instrumental',
            imagem: '/project_chemistry.jpg',
            descricao: 'Curso de química analítica com foco em técnicas instrumentais modernas.',
            categoria: client_1.categoriaCurso.CienciasBiologicasENaturais,
            cargaHoraria: 60,
            linkInscricao: 'https://inscricao.com/quimica-analitica',
            vagas: 25,
            bibliografia: 'Química Analítica Quantitativa, Análise Instrumental',
            metodologia: 'Laboratório prático e análise de amostras reais',
            metodoAvaliacao: 'Relatórios de laboratório e análises práticas',
            idProjeto: projetos[8].id,
            idUsuario: novosUsuarios[7].id,
        },
        {
            titulo: 'Física Moderna e Tecnologias Emergentes',
            imagem: '/project_physics.jpg',
            descricao: 'Estudo da física moderna e suas aplicações em tecnologias de ponta.',
            categoria: client_1.categoriaCurso.CienciasExatas,
            cargaHoraria: 50,
            linkInscricao: 'https://inscricao.com/fisica-moderna',
            vagas: 20,
            bibliografia: 'Física Moderna, Quantum Physics, Nanotechnology',
            metodologia: 'Seminários e projetos de pesquisa aplicada',
            metodoAvaliacao: 'Seminários e projetos científicos',
            idProjeto: projetos[9].id,
            idUsuario: novosUsuarios[8].id,
        },
    ];

    const cursos = [];
    for (const cursoData of cursosData) {
        const curso = await criarCursoSeNaoExistir(cursoData);
        cursos.push(curso);
    }

    // 7. Criar aulas para os cursos (CORRIGIDO)
    console.log('Criando aulas...');
    const aulasData = [
        // Aulas para Python (índice 0)
        { titulo: 'Introdução ao Python', idCurso: 0, linkPdf: 'https://example.com/python_intro.pdf', linkVideo: 'https://example.com/python_intro.mp4' },
        { titulo: 'Estruturas de Dados em Python', idCurso: 0, linkPdf: 'https://example.com/python_data.pdf', linkVideo: 'https://example.com/python_data.mp4' },
        { titulo: 'Programação Orientada a Objetos', idCurso: 0, linkPdf: 'https://example.com/python_oop.pdf', linkVideo: 'https://example.com/python_oop.mp4' },

        // Aulas para JavaScript (índice 1)
        { titulo: 'Fundamentos do JavaScript', idCurso: 1, linkPdf: 'https://example.com/js_basics.pdf', linkVideo: 'https://example.com/js_basics.mp4' },
        { titulo: 'Node.js e NPM', idCurso: 1, linkPdf: 'https://example.com/nodejs.pdf', linkVideo: 'https://example.com/nodejs.mp4' },

        // Aulas para React (índice 2)
        { titulo: 'Introdução ao React', idCurso: 2, linkPdf: 'https://example.com/react_intro.pdf', linkVideo: 'https://example.com/react_intro.mp4' },
        { titulo: 'Hooks no React', idCurso: 2, linkPdf: 'https://example.com/react_hooks.pdf', linkVideo: 'https://example.com/react_hooks.mp4' },

        // Aulas para Análise de Dados (índice 3)
        { titulo: 'Pandas para Análise', idCurso: 3, linkPdf: 'https://example.com/pandas.pdf', linkVideo: 'https://example.com/pandas.mp4' },
        { titulo: 'Visualização com Matplotlib', idCurso: 3, linkPdf: 'https://example.com/matplotlib.pdf', linkVideo: 'https://example.com/matplotlib.mp4' },

        // Aulas para o curso de Segurança da Informação (índice 7)
        { titulo: 'Fundamentos de Segurança da Informação', idCurso: 7, linkPdf: 'https://example.com/security_fundamentals.pdf', linkVideo: 'https://example.com/security_fundamentals.mp4' },
        { titulo: 'Ethical Hacking e Penetration Testing', idCurso: 7, linkPdf: 'https://example.com/ethical_hacking.pdf', linkVideo: 'https://example.com/ethical_hacking.mp4' },
        { titulo: 'Análise de Vulnerabilidades', idCurso: 7, linkPdf: 'https://example.com/vulnerability_analysis.pdf', linkVideo: 'https://example.com/vulnerability_analysis.mp4' },
    ];

    for (const aulaData of aulasData) {
        // Verificar se o índice do curso é válido
        if (aulaData.idCurso >= cursos.length) {
            console.log(`Pulando aula "${aulaData.titulo}" - índice de curso inválido: ${aulaData.idCurso}`);
            continue;
        }

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

    // 8. Criar eventos diversos
    console.log('Criando eventos...');
    const eventosData = [
        {
            titulo: 'Workshop de Python Avançado',
            categoria: client_1.categoriaCurso.CienciasAgrarias,
            dataFim: new Date('2026-07-15'),
            local: "Remoto",
            descricao: 'Workshop prático sobre técnicas avançadas em Python.',
            dataInicio: new Date('2024-07-15'),
            linkParticipacao: 'https://evento.com/python-workshop',
        },
        {
            titulo: 'Hackathon de Desenvolvimento Web',
            categoria: client_1.categoriaCurso.CienciasAgrarias,
            dataFim: new Date('2026-07-15'),
            local: "Remoto",
            descricao: 'Competição de desenvolvimento de aplicações web em 48 horas.',
            dataInicio: new Date('2024-08-20'),
            linkParticipacao: 'https://evento.com/hackathon-web',
        },
        {
            titulo: 'Conferência de UX Design',
            categoria: client_1.categoriaCurso.CienciasAgrarias,
            dataFim: new Date('2026-07-15'),
            local: "Remoto",
            descricao: 'Conferência sobre tendências e práticas em UX/UI Design.',
            dataInicio: new Date('2024-09-05'),
            linkParticipacao: 'https://evento.com/ux-conference',
        },
        {
            titulo: 'Seminário de Agricultura 4.0',
            categoria: client_1.categoriaCurso.CienciasAgrarias,
            dataFim: new Date('2026-07-15'),
            local: "Remoto",
            descricao: 'Palestra sobre tecnologias emergentes na agricultura moderna.',
            dataInicio: new Date('2024-10-10'),
            linkParticipacao: 'https://evento.com/agricultura-40',
        },
        {
            titulo: 'Show Cultural de Forró',
            categoria: client_1.categoriaCurso.CienciasAgrarias,
            dataFim: new Date('2026-07-15'),
            local: "Remoto",
            descricao: 'Apresentação cultural de forró tradicional nordestino.',
            dataInicio: new Date('2024-11-15'),
            linkParticipacao: 'https://evento.com/forro-cultural',
        },
        {
            titulo: 'Festival de Música Universitária',
            categoria: client_1.categoriaCurso.CienciasAgrarias,
            dataFim: new Date('2026-07-15'),
            local: "Remoto",
            descricao: 'Festival com apresentações musicais de estudantes universitários.',
            dataInicio: new Date('2024-12-01'),
            linkParticipacao: 'https://evento.com/festival-musica',
        },
        {
            titulo: 'Círculo de Conversas sobre Tecnologia',
            categoria: client_1.categoriaCurso.CienciasAgrarias,
            dataFim: new Date('2026-07-15'),
            local: "Remoto",
            descricao: 'Roda de conversa sobre inovações tecnológicas e impactos sociais.',
            dataInicio: new Date('2025-01-20'),
            linkParticipacao: 'https://evento.com/circulo-tech',
        },
        {
            titulo: 'Corrida de Obstáculos Acadêmica',
            categoria: client_1.categoriaCurso.CienciasAgrarias,
            dataFim: new Date('2026-07-15'),
            local: "Remoto",
            descricao: 'Competição esportiva entre equipes acadêmicas com obstáculos.',
            dataInicio: new Date('2025-02-28'),
            linkParticipacao: 'https://evento.com/corrida-obstaculos',

        },
        {
            titulo: 'Concerto da Orquestra Universitária',
            categoria: client_1.categoriaCurso.CienciasAgrarias,
            dataFim: new Date('2026-07-15'),
            local: "Remoto",
            descricao: 'Apresentação musical da orquestra da universidade.',
            dataInicio: new Date('2025-03-15'),
            linkParticipacao: 'https://evento.com/concerto-orquestra',
        },
        {
            titulo: 'Show de Rock Estudantil',
            categoria: client_1.categoriaCurso.CienciasAgrarias,
            dataFim: new Date('2026-07-15'),
            local: "Remoto",
            descricao: 'Apresentação de bandas de rock formadas por estudantes.',
            dataInicio: new Date('2025-04-10'),
            linkParticipacao: 'https://evento.com/rock-estudantil',
        },
    ];

    const eventos = []; // Array para armazenar os eventos criados
    for (const eventoData of eventosData) {
        const eventoExistente = await prisma.evento.findFirst({
            where: { titulo: eventoData.titulo }
        });

        if (!eventoExistente) {
            const novoEvento = await prisma.evento.create({ data: eventoData });
            eventos.push(novoEvento);
            console.log(`✅ Evento criado: ${eventoData.titulo}`);
        } else {
            eventos.push(eventoExistente);
            console.log(`Evento "${eventoData.titulo}" já existe`);
        }
    }


    // 9. Criar links para os usuários
    console.log('Criando links dos usuários...');
    const linksData = [
        { link: 'https://github.com/pamicortez', email: 'pamela@uefs.br', tipo: client_1.tipoLink.Genérico },
        { link: 'https://linkedin.com/in/pamiccortez', email: 'pamela@uefs.br', tipo: client_1.tipoLink.Linkedin },
        { link: 'https://instagram.com/pamiccortez', email: 'pamela@uefs.br', tipo: client_1.tipoLink.Instragram },
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

    // 9. Criar imagens dos eventos
    console.log('Criando imagens dos eventos...');

    // Função auxiliar para extrair descrição da imagem baseada no nome do arquivo
    function extrairDescricaoImagem(nomeArquivo) {
        const nomeBase = nomeArquivo.replace('event_', '').replace('.jpg', '');
        const palavras = nomeBase.split('_');

        // Traduções específicas
        const traducoes = {
            'conference': 'conferência',
            'conversation': 'conversa',
            'circle': 'círculo',
            'forro': 'forró',
            'show': 'show',
            'lecture': 'palestra',
            'meeting': 'reunião',
            'music': 'música',
            'festival': 'festival',
            'obstacle': 'obstáculo',
            'race': 'corrida',
            'orchestra': 'orquestra',
            'rock': 'rock',
            'concert': 'concerto'
        };

        const palavrasTraduzidas = palavras.map(palavra => traducoes[palavra] || palavra);
        return palavrasTraduzidas.join(' ');
    }

    const imagensEventoData = [
        { link: '/event_conference.jpg', idEvento: 0 }, // Conferência de UX Design
        { link: '/event_conference_2.jpg', idEvento: 0 }, // Imagem adicional para conferência
        { link: '/event_conversation_circle.jpg', idEvento: 6 }, // Círculo de Conversas
        { link: '/event_forro_show.jpg', idEvento: 4 }, // Show Cultural de Forró
        { link: '/event_lecture.jpg', idEvento: 0 }, // Workshop Python
        { link: '/event_lecture_2.jpg', idEvento: 3 }, // Seminário Agricultura
        { link: '/event_lecture_3.jpg', idEvento: 0 }, // Imagem adicional para workshop
        { link: '/event_meeting.jpg', idEvento: 1 }, // Hackathon
        { link: '/event_music_festival.jpg', idEvento: 5 }, // Festival de Música
        { link: '/event_obstacle_race.jpg', idEvento: 7 }, // Corrida de Obstáculos
        { link: '/event_orchestra.jpg', idEvento: 8 }, // Concerto da Orquestra
        { link: '/event_rock_concert.jpg', idEvento: 9 }, // Show de Rock
    ];

    for (const imagemData of imagensEventoData) {
        // Verificar se o índice do evento é válido
        if (imagemData.idEvento >= eventos.length) {
            console.log(`Pulando imagem - índice de evento inválido: ${imagemData.idEvento}`);
            continue;
        }

        const imagemExistente = await prisma.imagemEvento.findFirst({
            where: {
                link: imagemData.link,
                idEvento: eventos[imagemData.idEvento].id
            }
        });

        if (!imagemExistente) {
            await prisma.imagemEvento.create({
                data: {
                    link: imagemData.link,
                    idEvento: eventos[imagemData.idEvento].id,
                }
            });

            const descricaoImagem = extrairDescricaoImagem(imagemData.link);
            console.log(`✅ Imagem criada: ${descricaoImagem} para evento "${eventos[imagemData.idEvento].titulo}"`);
        } else {
            console.log(`Imagem ${imagemData.link} já existe para o evento`);
        }
    }

    // 10. Criar associações eventoUsuario
    console.log('Criando associações eventoUsuario...');

    // Função auxiliar para verificar se associação eventoUsuario existe
    async function criarAssociacaoEventoUsuarioSeNaoExistir(dadosAssociacao) {
        const associacaoExistente = await prisma.eventoUsuario.findFirst({
            where: {
                idEvento: dadosAssociacao.idEvento,
                idUsuario: dadosAssociacao.idUsuario
            }
        });

        if (associacaoExistente) {
            console.log(`Associação evento-usuário já existe, pulando...`);
            return associacaoExistente;
        }

        return await prisma.eventoUsuario.create({ data: dadosAssociacao });
    }

    const associacoesEventoUsuario = [
        // Workshop Python - João Silva como palestrante
        {
            idEvento: eventos[0].id,
            idUsuario: novosUsuarios[0].id,
            tipoParticipacao: client_1.tipoParticipacao.Palestrante
        },
        // Hackathon - Carlos Santos como organizador
        {
            idEvento: eventos[1].id,
            idUsuario: novosUsuarios[2].id,
            tipoParticipacao: client_1.tipoParticipacao.Organizador
        },
        // Conferência UX - Julia Ferreira como palestrante
        {
            idEvento: eventos[2].id,
            idUsuario: novosUsuarios[5].id,
            tipoParticipacao: client_1.tipoParticipacao.Palestrante
        },
        // Seminário Agricultura - Lúcia Santos como palestrante
        {
            idEvento: eventos[3].id,
            idUsuario: novosUsuarios[9].id,
            tipoParticipacao: client_1.tipoParticipacao.Palestrante
        },
        // Show de Forró - Maria Oliveira como organizadora
        {
            idEvento: eventos[4].id,
            idUsuario: novosUsuarios[3].id,
            tipoParticipacao: client_1.tipoParticipacao.Organizador
        },
        // Festival de Música - Pedro Lima como organizador
        {
            idEvento: eventos[5].id,
            idUsuario: novosUsuarios[4].id,
            tipoParticipacao: client_1.tipoParticipacao.Organizador
        },
        // Círculo de Conversas - Ana Souza como mediadora
        {
            idEvento: eventos[6].id,
            idUsuario: novosUsuarios[1].id,
            tipoParticipacao: client_1.tipoParticipacao.Palestrante
        },
        // Corrida de Obstáculos - Ricardo Mendes como organizador
        {
            idEvento: eventos[7].id,
            idUsuario: novosUsuarios[6].id,
            tipoParticipacao: client_1.tipoParticipacao.Organizador
        },
        // Concerto da Orquestra - Fernanda Costa como organizadora
        {
            idEvento: eventos[8].id,
            idUsuario: novosUsuarios[7].id,
            tipoParticipacao: client_1.tipoParticipacao.Organizador
        },
        // Show de Rock - Marcos Silva como organizador
        {
            idEvento: eventos[9].id,
            idUsuario: novosUsuarios[8].id,
            tipoParticipacao: client_1.tipoParticipacao.Organizador
        },

        // Associações adicionais - participantes como ouvintes
        {
            idEvento: eventos[0].id,
            idUsuario: novosUsuarios[1].id,
            tipoParticipacao: client_1.tipoParticipacao.Ouvinte
        },
        {
            idEvento: eventos[1].id,
            idUsuario: novosUsuarios[4].id,
            tipoParticipacao: client_1.tipoParticipacao.Ouvinte
        },
        {
            idEvento: eventos[2].id,
            idUsuario: novosUsuarios[4].id,
            tipoParticipacao: client_1.tipoParticipacao.Ouvinte
        },
        {
            idEvento: eventos[5].id,
            idUsuario: novosUsuarios[0].id,
            tipoParticipacao: client_1.tipoParticipacao.Ouvinte
        },
        {
            idEvento: eventos[6].id,
            idUsuario: novosUsuarios[3].id,
            tipoParticipacao: client_1.tipoParticipacao.Ouvinte
        },
    ];

    // Criar as associações eventoUsuario
    for (const associacao of associacoesEventoUsuario) {
        try {
            await criarAssociacaoEventoUsuarioSeNaoExistir(associacao);

            // Buscar informações para log
            const evento = eventos.find(e => e.id === associacao.idEvento);
            const usuario = novosUsuarios.find(u => u.id === associacao.idUsuario);

            console.log(`✅ Associação evento-usuário criada: ${usuario.Nome} -> ${evento.titulo} (${associacao.tipoParticipacao})`);
        } catch (error) {
            console.error(`❌ Erro ao criar associação eventoUsuario:`, error);
        }
    }

    // Verificar se todos os eventos têm pelo menos uma associação
    console.log('Verificando se todos os eventos têm associações...');
    for (const evento of eventos) {
        const associacoes = await prisma.eventoUsuario.count({
            where: { idEvento: evento.id }
        });

        if (associacoes === 0) {
            console.log(`⚠️  AVISO: Evento "${evento.titulo}" não possui associações eventoUsuario!`);
        } else {
            console.log(`✅ Evento "${evento.titulo}" possui ${associacoes} associação(ões)`);
        }
    }

    // 11. Criar publicações
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

    // 12. Criar carreiras para os usuários
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
            nome: 'Doutorado em Operations Research',
            descricao: 'Mathematical models for humanitarian logistics response in natural disasters',
            categoria: client_1.categoriaCarreira.acadêmica,
            dataInicio: new Date('2016-01-01'),
            dataFim: new Date('2024-12-31'),
            email: 'pamela@uefs.br',
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

        {
            nome: 'Especialização em cibersegurança e ethical hacking.',
            descricao: 'Especialização em cibersegurança e ethical hacking.',
            categoria: client_1.categoriaCarreira.acadêmica,
            dataInicio: new Date('2021-03-01'),
            dataFim: new Date('2023-02-28'),
            email: 'ricardo.mendes@example.com',
        },
        {
            nome: 'Mestrado em Química com foco em análise de materiais.',
            descricao: 'Pesquisa com foco em análise de materiais.',
            categoria: client_1.categoriaCarreira.acadêmica,
            dataInicio: new Date('2018-03-01'),
            dataFim: new Date('2022-12-15'),
            email: 'fernanda.costa@example.com',
        },
        {
            nome: 'Doutorado em Física, pesquisa em física quântica.',
            descricao: 'Pesquisador em física quântica.',
            categoria: client_1.categoriaCarreira.acadêmica,
            dataInicio: new Date('2021-01-15'),
            dataFim: new Date('2024-01-15'),
            email: 'marcos.silva@example.com',
        },
        {
            nome: 'Mestrado em História, especialização em história do Brasil.',
            descricao: 'Especialização em história do Brasil.',
            categoria: client_1.categoriaCarreira.profissional,
            dataInicio: new Date('2022-06-01'),
            dataFim: new Date('2024-05-31'),
            email: 'lucia.santos@example.com',
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
    console.log(`✅ Eventos criados/verificados: ${eventos.length}`);
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