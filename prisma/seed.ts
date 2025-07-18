import { PrismaClient, Titulacao, colaboradorCategoria, categoriaCurso, tipoLink } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();
const SALT_ROUNDS = 10;

async function main() {
  // 1. Limpeza em ordem reversa de dependência
  await prisma.link.deleteMany();
  await prisma.publicacao.deleteMany();
  await prisma.aula.deleteMany();
  await prisma.curso.deleteMany();
  await prisma.projetoColaborador.deleteMany();
  await prisma.colaborador.deleteMany();
  await prisma.projeto.deleteMany();
  await prisma.evento.deleteMany();
  await prisma.usuario.deleteMany();

  // 2. Criar usuários com senha criptografada
  const senhaCriptografada = await bcrypt.hash('senha123', SALT_ROUNDS);
  const usuarios = await Promise.all([
    prisma.usuario.create({
      data: {
        email: 'joao.silva@example.com',
        fotoPerfil: '/prof1.jpg',
        senha: senhaCriptografada,
        Nome: 'João Silva',
        Titulacao: Titulacao.Especialista,
        instituicaoEnsino: 'Instituto de Tecnologia XYZ',
        formacaoAcademica: 'Inteligência Artificial',
        resumoPessoal: 'Especialista em IA.',
      },
    }),
    prisma.usuario.create({
      data: {
        email: 'ana.souza@example.com',
        fotoPerfil: '/prof2.jpg',
        senha: senhaCriptografada,
        Nome: 'Ana Souza',
        Titulacao: Titulacao.Doutor,
        instituicaoEnsino: 'Universidade de Dados ABC',
        formacaoAcademica: 'Big Data',
        resumoPessoal: 'Doutora em Big Data.',
      },
    }),
  ]);

  // 3. Criar projeto
  const projeto = await prisma.projeto.create({
    data: {
      titulo: 'Tecnologia da Informação',
      imagem: '/proj1.jpg',
      descricao: 'Curso de introdução e especialização em TI.',
      categoria: 'TECNOLOGIA',
      dataInicio: new Date('2024-01-01'),
      dataFim: new Date('2024-02-19'),
    },
  });

  // 4. Criar colaboradores
  const [joaoColab, mariaColab] = await Promise.all([
    prisma.colaborador.create({ data: { nome: 'João Silva' } }),
    prisma.colaborador.create({ data: { nome: 'Maria Souza' } }),
  ]);

  // 5. Associar colaboradores ao projeto
  await prisma.projetoColaborador.createMany({
    data: [
      {
        idColaborador: joaoColab.id,
        idProjeto: projeto.id,
        categoria: colaboradorCategoria.Bolsista,
      },
      {
        idColaborador: mariaColab.id,
        idProjeto: projeto.id,
        categoria: colaboradorCategoria.Coordenador,
      },
    ],
  });

  // 6. Criar curso vinculado ao projeto e usuário
  const curso = await prisma.curso.create({
    data: {
      titulo: 'Python',
      imagem: '/python.jpg',
      descricao: 'Curso intensivo de programação em Python.',
      categoria: categoriaCurso.ComputacaoETecnologiaDaInformacao,
      cargaHoraria: 40,
      linkInscricao: 'https://inscricao.com/python',
      vagas: 30,
      bibliografia: 'Livro Python para Todos',
      metodologia: 'Aulas teóricas e práticas',
      metodoAvaliacao: 'Projetos e testes',
      idProjeto: projeto.id,
      idUsuario: usuarios[0].id, // João Silva
    },
  });

  // 7. Criar aulas para o curso
  await prisma.aula.createMany({
    data: [
      {
        titulo: 'Introdução à IA',
        linkPdf: 'https://example.com/ia_intro.pdf',
        linkVideo: 'https://example.com/ia_intro.mp4',
        idCurso: curso.id,
      },
      {
        titulo: 'Big Data no mundo real',
        linkPdf: 'https://example.com/bigdata_real.pdf',
        linkVideo: 'https://example.com/bigdata_real.mp4',
        idCurso: curso.id,
      },
    ],
  });

  // 8. Criar eventos
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

  // 9. Criar links para usuários
  await prisma.link.createMany({
    data: [
      {
        link: 'https://linkedin.com/in/user1',
        idUsuario: usuarios[0].id,
        tipo: tipoLink.Linkedin,
      },
      {
        link: 'https://instagram.com/user2',
        idUsuario: usuarios[1].id,
        tipo: tipoLink.Instragram,
      },
    ],
  });

  // 10. Criar publicações
  await prisma.publicacao.createMany({
    data: [
      {
        descricao: 'Artigo sobre IA',
        link: 'https://arxiv.org/ia_paper',
        idUsuario: usuarios[0].id,
      },
      {
        descricao: 'Estudo sobre Big Data',
        link: 'https://arxiv.org/bigdata_study',
        idUsuario: usuarios[1].id,
      },
    ],
  });

  console.log('Seed concluído com sucesso!');
}

main()
  .catch((e) => {
    console.error('Erro no seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
