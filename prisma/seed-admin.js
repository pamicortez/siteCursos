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
    console.log('Iniciando seed para Pâmela Cândida...');

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

    // Senha criptografada
    const senhaCriptografada = await bcryptjs_1.default.hash('senha123', SALT_ROUNDS);

    // 1. Criar usuária Pâmela
    console.log('Criando usuária Pâmela Cândida...');
    const pamela = await criarUsuarioSeNaoExistir({
        email: 'pamela@uefs.br',
        fotoPerfil: '/foto_pamela.jpg',
        senha: '$2b$10$JWQLu9Puay/5Qot040zvbO8sVSDNuYPjIrL9maYOC8Vr2KC86fxAa',
        Nome: 'Pâmela Cândida',
        Titulacao: client_1.Titulacao.Doutor,
        instituicaoEnsino: 'The University of Melbourne',
        formacaoAcademica: 'Ciências de Computação',
        resumoPessoal: 'Doutorado em Operations Research',
        tipo: client_1.tipoUser.Super,
    });

    // 2. Criar 7 projetos
    console.log('Criando 7 projetos...');
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
    ]);

    // 3. Criar associações projetoUsuario - Pâmela como coordenadora de todos os 7 projetos
    console.log('Criando associações projetoUsuario...');

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

    for (const projeto of projetos) {
        await criarAssociacaoProjetoUsuarioSeNaoExistir({
            idProjeto: projeto.id,
            idUsuario: pamela.id,
            funcao: client_1.funcaoProjeto.Coordenador
        });
        console.log(`✅ Pâmela associada ao projeto: ${projeto.titulo}`);
    }

    // 4. Criar colaborador para Pâmela
    console.log('Criando colaborador...');
    let colaboradorPamela = await prisma.colaborador.findFirst({
        where: { nome: 'Pâmela Cândida' }
    });

    if (!colaboradorPamela) {
        colaboradorPamela = await prisma.colaborador.create({
            data: { nome: 'Pâmela Cândida' }
        });
    }

    // Associar colaborador aos projetos
    for (const projeto of projetos) {
        const existeAssociacao = await prisma.projetoColaborador.findFirst({
            where: {
                idColaborador: colaboradorPamela.id,
                idProjeto: projeto.id,
            }
        });

        if (!existeAssociacao) {
            await prisma.projetoColaborador.create({
                data: {
                    idColaborador: colaboradorPamela.id,
                    idProjeto: projeto.id,
                    categoria: client_1.colaboradorCategoria.Coordenador,
                }
            });
            console.log(`✅ Colaborador associado: Pâmela -> ${projeto.titulo}`);
        }
    }

    // 5. Criar 7 cursos (um para cada projeto)
    console.log('Criando 7 cursos...');
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
            idProjeto: projetos[0].id,
            idUsuario: pamela.id,
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
            idUsuario: pamela.id,
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
            idUsuario: pamela.id,
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
            idUsuario: pamela.id,
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
            idUsuario: pamela.id,
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
            idUsuario: pamela.id,
        },
        {
            titulo: 'Tecnologias em Saúde Digital',
            imagem: '/project_health.jpg',
            descricao: 'Desenvolvimento de aplicações e sistemas para a área da saúde.',
            categoria: client_1.categoriaCurso.SaudeEBemEstar,
            cargaHoraria: 50,
            linkInscricao: 'https://inscricao.com/saude-digital',
            vagas: 25,
            bibliografia: 'Digital Health, Healthcare IT',
            metodologia: 'Projetos práticos em sistemas de saúde',
            metodoAvaliacao: 'Desenvolvimento de protótipos e aplicações',
            idProjeto: projetos[6].id,
            idUsuario: pamela.id,
        },
    ];

    const cursos = [];
    for (const cursoData of cursosData) {
        const curso = await criarCursoSeNaoExistir(cursoData);
        cursos.push(curso);
        console.log(`✅ Curso criado: ${curso.titulo}`);
    }

    // 6. Criar aulas para os cursos
    console.log('Criando aulas...');
    const aulasData = [
        { titulo: 'Introdução ao Python', idCurso: 0, linkPdf: 'https://example.com/python_intro.pdf', linkVideo: 'https://example.com/python_intro.mp4' },
        { titulo: 'Estruturas de Dados em Python', idCurso: 0, linkPdf: 'https://example.com/python_data.pdf', linkVideo: 'https://example.com/python_data.mp4' },
        { titulo: 'Fundamentos do JavaScript', idCurso: 1, linkPdf: 'https://example.com/js_basics.pdf', linkVideo: 'https://example.com/js_basics.mp4' },
        { titulo: 'Node.js e NPM', idCurso: 1, linkPdf: 'https://example.com/nodejs.pdf', linkVideo: 'https://example.com/nodejs.mp4' },
        { titulo: 'Pandas para Análise', idCurso: 2, linkPdf: 'https://example.com/pandas.pdf', linkVideo: 'https://example.com/pandas.mp4' },
        { titulo: 'Visualização com Matplotlib', idCurso: 2, linkPdf: 'https://example.com/matplotlib.pdf', linkVideo: 'https://example.com/matplotlib.mp4' },
        { titulo: 'Princípios de UX Design', idCurso: 3, linkPdf: 'https://example.com/ux_principles.pdf', linkVideo: 'https://example.com/ux_principles.mp4' },
        { titulo: 'Prototipação em Figma', idCurso: 3, linkPdf: 'https://example.com/figma.pdf', linkVideo: 'https://example.com/figma.mp4' },
        { titulo: 'IoT na Agricultura', idCurso: 4, linkPdf: 'https://example.com/iot_agriculture.pdf', linkVideo: 'https://example.com/iot_agriculture.mp4' },
        { titulo: 'Sensores e Automação', idCurso: 4, linkPdf: 'https://example.com/sensors.pdf', linkVideo: 'https://example.com/sensors.mp4' },
        { titulo: 'Fundamentos de Segurança da Informação', idCurso: 5, linkPdf: 'https://example.com/security_fundamentals.pdf', linkVideo: 'https://example.com/security_fundamentals.mp4' },
        { titulo: 'Ethical Hacking e Penetration Testing', idCurso: 5, linkPdf: 'https://example.com/ethical_hacking.pdf', linkVideo: 'https://example.com/ethical_hacking.mp4' },
        { titulo: 'Sistemas de Saúde Digital', idCurso: 6, linkPdf: 'https://example.com/health_systems.pdf', linkVideo: 'https://example.com/health_systems.mp4' },
        { titulo: 'Telemedicina e Apps de Saúde', idCurso: 6, linkPdf: 'https://example.com/telemedicine.pdf', linkVideo: 'https://example.com/telemedicine.mp4' },
    ];

    for (const aulaData of aulasData) {
        if (aulaData.idCurso >= cursos.length) continue;

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
            console.log(`✅ Aula criada: ${aulaData.titulo}`);
        }
    }

    // 7. Criar 7 eventos
    console.log('Criando 7 eventos...');
    const eventosData = [
        {
            titulo: 'Workshop de Python Avançado',
            categoria: client_1.categoriaCurso.TecnologiaEComputacao,
            dataFim: new Date('2024-07-15'),
            local: "Remoto",
            descricao: 'Workshop prático sobre técnicas avançadas em Python.',
            dataInicio: new Date('2024-07-15'),
            linkParticipacao: 'https://evento.com/python-workshop',
        },
        {
            titulo: 'Hackathon de Desenvolvimento Web',
            categoria: client_1.categoriaCurso.TecnologiaEComputacao,
            dataFim: new Date('2024-08-20'),
            local: "Presencial - UEFS",
            descricao: 'Competição de desenvolvimento de aplicações web em 48 horas.',
            dataInicio: new Date('2024-08-20'),
            linkParticipacao: 'https://evento.com/hackathon-web',
        },
        {
            titulo: 'Conferência de UX Design',
            categoria: client_1.categoriaCurso.ArtesECultura,
            dataFim: new Date('2024-09-05'),
            local: "Remoto",
            descricao: 'Conferência sobre tendências e práticas em UX/UI Design.',
            dataInicio: new Date('2024-09-05'),
            linkParticipacao: 'https://evento.com/ux-conference',
        },
        {
            titulo: 'Seminário de Agricultura 4.0',
            categoria: client_1.categoriaCurso.CienciasAgrarias,
            dataFim: new Date('2024-10-10'),
            local: "Híbrido",
            descricao: 'Palestra sobre tecnologias emergentes na agricultura moderna.',
            dataInicio: new Date('2024-10-10'),
            linkParticipacao: 'https://evento.com/agricultura-40',
        },
        {
            titulo: 'Círculo de Conversas sobre Tecnologia',
            categoria: client_1.categoriaCurso.TecnologiaEComputacao,
            dataFim: new Date('2025-01-20'),
            local: "Remoto",
            descricao: 'Roda de conversa sobre inovações tecnológicas e impactos sociais.',
            dataInicio: new Date('2025-01-20'),
            linkParticipacao: 'https://evento.com/circulo-tech',
        },
        {
            titulo: 'Summit de Cibersegurança',
            categoria: client_1.categoriaCurso.TecnologiaEComputacao,
            dataFim: new Date('2025-02-15'),
            local: "Presencial - Salvador",
            descricao: 'Encontro de especialistas em segurança da informação e ethical hacking.',
            dataInicio: new Date('2025-02-15'),
            linkParticipacao: 'https://evento.com/cybersecurity-summit',
        },
        {
            titulo: 'Fórum de Saúde Digital',
            categoria: client_1.categoriaCurso.SaudeEBemEstar,
            dataFim: new Date('2025-03-10'),
            local: "Híbrido",
            descricao: 'Discussões sobre inovações tecnológicas aplicadas à saúde.',
            dataInicio: new Date('2025-03-10'),
            linkParticipacao: 'https://evento.com/saude-digital-forum',
        },
    ];

    const eventos = [];
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
        }
    }

    // 8. Criar imagens dos eventos
    console.log('Criando imagens dos eventos...');
    const imagensEventoData = [
        { link: '/event_lecture.jpg', idEvento: 0 },
        { link: '/event_meeting.jpg', idEvento: 1 },
        { link: '/event_conference.jpg', idEvento: 2 },
        { link: '/event_lecture_2.jpg', idEvento: 3 },
        { link: '/event_conversation_circle.jpg', idEvento: 4 },
        { link: '/event_lecture_3.jpg', idEvento: 5 },
        { link: '/event_conference_2.jpg', idEvento: 6 },
    ];

    for (const imagemData of imagensEventoData) {
        if (imagemData.idEvento >= eventos.length) continue;

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
            console.log(`✅ Imagem criada para evento: ${eventos[imagemData.idEvento].titulo}`);
        }
    }

    // 9. Criar associações eventoUsuario - Pâmela em todos os 7 eventos
    console.log('Criando associações eventoUsuario...');

    async function criarAssociacaoEventoUsuarioSeNaoExistir(dadosAssociacao) {
        const associacaoExistente = await prisma.eventoUsuario.findFirst({
            where: {
                idEvento: dadosAssociacao.idEvento,
                idUsuario: dadosAssociacao.idUsuario
            }
        });

        if (associacaoExistente) {
            return associacaoExistente;
        }

        return await prisma.eventoUsuario.create({ data: dadosAssociacao });
    }

    const tiposParticipacao = [
        client_1.tipoParticipacao.Palestrante,
        client_1.tipoParticipacao.Organizador,
        client_1.tipoParticipacao.Palestrante,
        client_1.tipoParticipacao.Palestrante,
        client_1.tipoParticipacao.Organizador,
        client_1.tipoParticipacao.Palestrante,
        client_1.tipoParticipacao.Organizador,
    ];

    for (let i = 0; i < eventos.length; i++) {
        await criarAssociacaoEventoUsuarioSeNaoExistir({
            idEvento: eventos[i].id,
            idUsuario: pamela.id,
            tipoParticipacao: tiposParticipacao[i]
        });
        console.log(`✅ Pâmela associada ao evento: ${eventos[i].titulo} (${tiposParticipacao[i]})`);
    }

    // 10. Criar links para Pâmela
    console.log('Criando links...');
    const linksData = [
        { link: 'https://github.com/pamicortez', tipo: client_1.tipoLink.Genérico },
        { link: 'https://linkedin.com/in/pamiccortez', tipo: client_1.tipoLink.Linkedin },
        { link: 'https://instagram.com/pamiccortez', tipo: client_1.tipoLink.Instragram },
    ];

    for (const linkData of linksData) {
        const linkExistente = await prisma.link.findFirst({
            where: {
                link: linkData.link,
                idUsuario: pamela.id,
            }
        });

        if (!linkExistente) {
            await prisma.link.create({
                data: {
                    link: linkData.link,
                    idUsuario: pamela.id,
                    tipo: linkData.tipo,
                }
            });
            console.log(`✅ Link criado: ${linkData.link}`);
        }
    }

    // 11. Criar publicações para Pâmela
    console.log('Criando publicações...');
    const publicacoesData = [
        { descricao: 'Artigo sobre Machine Learning em Python', link: 'https://arxiv.org/ml-python' },
        { descricao: 'Pesquisa em Operations Research aplicada', link: 'https://arxiv.org/operations-research' },
        { descricao: 'Estudo sobre Logística Humanitária', link: 'https://journal.com/humanitarian-logistics' },
    ];

    for (const pubData of publicacoesData) {
        const publicacaoExistente = await prisma.publicacao.findFirst({
            where: {
                link: pubData.link,
                idUsuario: pamela.id,
            }
        });

        if (!publicacaoExistente) {
            await prisma.publicacao.create({
                data: {
                    descricao: pubData.descricao,
                    link: pubData.link,
                    idUsuario: pamela.id,
                }
            });
            console.log(`✅ Publicação criada: ${pubData.descricao}`);
        }
    }

    // 12. Criar carreira para Pâmela
    console.log('Criando carreira...');
    const carreiraExistente = await prisma.carreira.findFirst({
        where: {
            nome: 'Doutorado em Operations Research',
            idUsuario: pamela.id,
        }
    });

    if (!carreiraExistente) {
        await prisma.carreira.create({
            data: {
                nome: 'Doutorado em Operations Research',
                descricao: 'Mathematical models for humanitarian logistics response in natural disasters',
                categoria: client_1.categoriaCarreira.acadêmica,
                dataInicio: new Date('2016-01-01'),
                dataFim: new Date('2024-12-31'),
                idUsuario: pamela.id,
            }
        });
        console.log('✅ Carreira criada para Pâmela');
    }

    console.log('🎉 Seed para Pâmela Cândida concluído com sucesso!');
    console.log(`✅ Usuária: Pâmela Cândida`);
    console.log(`✅ Projetos: ${projetos.length}`);
    console.log(`✅ Cursos: ${cursos.length}`);
    console.log(`✅ Eventos: ${eventos.length}`);
}

main()
    .catch((e) => {
        console.error('❌ Erro no seed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });