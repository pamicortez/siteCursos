import { PrismaClient, categoriaCurso, colaboradorCategoria, Titulacao, tipoLink } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();
const SALT_ROUNDS = 10;

async function main() {
  // Limpando tabelas na ordem correta para evitar erros de FK
  await prisma.link.deleteMany();
  await prisma.projetoColaborador.deleteMany();
  await prisma.colaborador.deleteMany();
  await prisma.publicacao.deleteMany();
  await prisma.aula.deleteMany();
  await prisma.curso.deleteMany();
  await prisma.projeto.deleteMany();
  await prisma.usuario.deleteMany();

  // Senha criptografada
  const senhaCriptografada = await bcrypt.hash('senha123', SALT_ROUNDS);

  // Usuários
  await prisma.usuario.createMany({
    data: [
      {
        email: 'joao.silva@example.com',
        fotoPerfil: '/prof1.jpg',
        senha: senhaCriptografada,
        Nome: 'João Silva',
        Titulacao: Titulacao.Especialista,
        instituicaoEnsino: 'Instituto de Tecnologia XYZ',
        formacaoAcademica: 'Inteligência Artificial',
        resumoPessoal: 'Especialista em IA.',
      },
      {
        email: 'ana.souza@example.com',
        fotoPerfil: '/prof2.jpg',
        senha: senhaCriptografada,
        Nome: 'Ana Souza',
        Titulacao: Titulacao.Doutor,
        instituicaoEnsino: 'Universidade de Dados ABC',
        formacaoAcademica: 'Big Data',
        resumoPessoal: 'Doutora em Big Data.',
      },
      {
        email: 'carlos.mendes@example.com',
        fotoPerfil: '/prof3.jpg',
        senha: senhaCriptografada,
        Nome: 'Carlos Mendes',
        Titulacao: Titulacao.Doutor,
        instituicaoEnsino: 'Instituto de Robótica RST',
        formacaoAcademica: 'Robótica',
        resumoPessoal: 'PhD em Robótica.',
      },
      {
        email: 'mariana.lima@example.com',
        fotoPerfil: '/prof4.jpg',
        senha: senhaCriptografada,
        Nome: 'Mariana Lima',
        Titulacao: Titulacao.Especialista,
        instituicaoEnsino: 'Faculdade de Engenharia DEF',
        formacaoAcademica: 'Engenharia de Software',
        resumoPessoal: 'Engenheira de Software.',
      },
      {
        email: 'ricardo.santos@example.com',
        fotoPerfil: '/prof5.jpg',
        senha: senhaCriptografada,
        Nome: 'Ricardo Santos',
        Titulacao: Titulacao.Mestre,
        instituicaoEnsino: 'Universidade de Redes UVW',
        formacaoAcademica: 'Redes de Computadores',
        resumoPessoal: 'Especialista em Redes.',
      },
    ],
  });

  // Projetos
  await prisma.projeto.createMany({
    data: [
      {
        titulo: 'Tecnologia da Informação',
        imagem: '/proj1.jpg',
        descricao: 'Curso de introdução e especialização em TI.',
        categoria: 'TECNOLOGIA',
        dataInicio: new Date('2024-01-01'),
        dataFim: new Date('2024-02-19'),
      },
      {
        titulo: 'Física',
        imagem: '/proj2.jpg',
        descricao: 'Projeto de pesquisa e desenvolvimento em física aplicada.',
        categoria: 'FISICA',
        dataInicio: new Date('2024-01-01'),
        dataFim: new Date('2024-03-31'),
      },
      {
        titulo: 'Química',
        imagem: '/proj3.jpg',
        descricao: 'Curso focado em experimentos e teoria química avançada.',
        categoria: 'QUIMICA',
        dataInicio: new Date('2024-01-01'),
        dataFim: new Date('2024-03-10'),
      },
      {
        titulo: 'Matemática',
        imagem: '/proj4.jpg',
        descricao: 'Projeto de inovação em métodos de ensino matemático.',
        categoria: 'MATEMATICA',
        dataInicio: new Date('2024-01-01'),
        dataFim: new Date('2024-03-01'),
      },
      {
        titulo: 'História',
        imagem: '/proj5.jpg',
        descricao: 'Curso de história mundial e metodologias de pesquisa histórica.',
        categoria: 'HISTORIA',
        dataInicio: new Date('2024-01-01'),
        dataFim: new Date('2024-02-11'),
      },
      {
        titulo: 'Inglês',
        imagem: '/proj5.jpg',
        descricao: 'Curso de Inglês técnico.',
        categoria: 'LINGUA_ESTRANGEIRA',
        dataInicio: new Date('2024-01-01'),
        dataFim: new Date('2024-02-11'),
      },
    ],
  });

  
  // Colaboradores
  await prisma.colaborador.createMany({
    data: [
      { nome: 'João Silva' },
      { nome: 'Maria Souza' },
    ],
  });

  // Relacionamentos projeto-colaborador
  const joao = await prisma.colaborador.findFirst({ where: { nome: 'João Silva' } });
  const maria = await prisma.colaborador.findFirst({ where: { nome: 'Maria Souza' } });
  const projetoTI = await prisma.projeto.findFirst({ where: { titulo: 'Tecnologia da Informação' } });

  if (joao && maria && projetoTI) {
    await prisma.projetoColaborador.createMany({
      data: [
        {
          idColaborador: joao.id,
          idProjeto: projetoTI.id,
          categoria: colaboradorCategoria.Bolsista,
        },
        {
          idColaborador: maria.id,
          idProjeto: projetoTI.id,
          categoria: colaboradorCategoria.Coordenador,
        }
      ]
    });
  }


  // Cursos
  await prisma.curso.createMany({
    data: [
      {
        titulo: 'Python',
        imagem: '/proj1.jpg',
        descricao: 'Curso intensivo de programação em Python para iniciantes e avançados.',
        categoria: categoriaCurso.TecnologiaEComputacao,
        cargaHoraria: 40,
        linkInscricao: 'https://inscricao.com/python',
        vagas: 30,
        bibliografia: 'Livro Python para Todos',
        metodologia: 'Aulas teóricas e práticas',
        metodoAvaliacao: 'Projetos e testes',
        idProjeto: 1,
        idUsuario: 1,
      },
      {
        titulo: 'React',
        imagem: '/proj2.jpg',
        descricao: 'Curso prático de desenvolvimento com React para aplicações web.',
        categoria: categoriaCurso.TecnologiaEComputacao,
        cargaHoraria: 50,
        linkInscricao: 'https://inscricao.com/react',
        vagas: 25,
        bibliografia: 'Documentação oficial React',
        metodologia: 'Workshops e projetos',
        metodoAvaliacao: 'Avaliação contínua',
        idProjeto: 1,
        idUsuario: 4,
      },
      {
        titulo: 'Inglês',
        imagem: '/proj3.jpg',
        descricao: 'Curso de inglês básico a avançado, focado em conversação e gramática.',
        categoria: categoriaCurso.LinguagensLetrasEComunicacao,
        cargaHoraria: 60,
        linkInscricao: 'https://inscricao.com/ingles',
        vagas: 20,
        bibliografia: 'Cambridge English Grammar',
        metodologia: 'Conversação e leitura',
        metodoAvaliacao: 'Testes orais e escritos',
        idProjeto: 6,
        idUsuario: 5,
      },
      {
        titulo: 'Sistemas Embarcados',
        imagem: '/proj4.jpg',
        descricao: 'Curso completo sobre sistemas embarcados com prática em hardware e software.',
        categoria: categoriaCurso.TecnologiaEComputacao,
        cargaHoraria: 80,
        linkInscricao: 'https://inscricao.com/embarcados',
        vagas: 15,
        bibliografia: 'Livro Sistemas Embarcados Modernos',
        metodologia: 'Aulas práticas com kits',
        metodoAvaliacao: 'Projetos em grupo',
        idProjeto: 1,
        idUsuario: 3,
      },
      {
        titulo: 'C/C++',
        imagem: '/proj5.jpg',
        descricao: 'Curso aprofundado em C e C++ com projetos práticos e desafios de programação.',
        categoria: categoriaCurso.TecnologiaEComputacao,
        cargaHoraria: 70,
        linkInscricao: 'https://inscricao.com/c-cpp',
        vagas: 30,
        bibliografia: 'Livro C++ Primer',
        metodologia: 'Desenvolvimento orientado a projetos',
        metodoAvaliacao: 'Desafios semanais',
        idProjeto: 1,
        idUsuario: 2,
      },
    ],
  });

  // Aulas
  await prisma.aula.createMany({
    data: [
      {
        titulo: 'Introdução à IA',
        linkPdf: 'https://example.com/ia_intro.pdf',
        linkVideo: 'https://example.com/ia_intro.mp4',
        idCurso: 1,
      },
      {
        titulo: 'Big Data no mundo real',
        linkPdf: 'https://example.com/bigdata_real.pdf',
        linkVideo: 'https://example.com/bigdata_real.mp4',
        idCurso: 1,
      },
    ],
  });

  // Eventos
  await prisma.evento.createMany({
    data: [
      {
        titulo: 'Workshop de IA',
        descricao: 'Evento sobre IA aplicada',
        data: new Date('2024-06-15'),
        linkParticipacao: 'https://evento.com/workshop_ia',
      },
      {
        titulo: 'Congresso de Dados',
        descricao: 'Discussões sobre Big Data',
        data: new Date('2024-09-10'),
        linkParticipacao: 'https://evento.com/congresso_dados',
      },
    ],
  });

  // Links
  await prisma.link.createMany({
    data: [
      {
        link: 'https://linkedin.com/in/user1',
        idUsuario: 1,
        tipo: tipoLink.Linkedin,
      },
      {
        link: 'https://instagram.com/user2',
        idUsuario: 2,
        tipo: tipoLink.Instragram,
      },
    ],
  });

  // Publicações
  await prisma.publicacao.createMany({
    data: [
      {
        descricao: 'Artigo sobre IA',
        link: 'https://arxiv.org/ia_paper',
        idUsuario: 1,
      },
      {
        descricao: 'Pesquisa em Big Data',
        link: 'https://research.com/bigdata',
        idUsuario: 2,
      },
    ],
  });
}

main()
  .then(() => {
    console.log('Seed executado com sucesso!');
  })
  .catch((e) => {
    console.error('Erro no seed:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
