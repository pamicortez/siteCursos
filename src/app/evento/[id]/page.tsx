"use client"
import { Badge } from "@/components/ui/badge"
import { PencilLine } from "lucide-react"
import { useEffect, useState } from "react";
import { notFound, useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react"
import Carrossel from "@/components/Carrossel"
import CardImagem from "@/components/CardImagem"

export type Evento = {
  id: number;
  titulo: string;
  descricao: string;
  dataInicio: string;
  dataFim: string;
  linkParticipacao: string | null;
  categoria: string;
  local: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  eventoUsuario: EventoUsuario[];
  imagemEvento: ImagemEvento[];
  eventoColaborador: EventoColaborador[];
}

type EventoUsuario = {
  id: number;
  idUsuario: number;
  idEvento: number;
  tipoParticipacao: string;
  usuario: {
    id: number;
    Nome: string;
  };
}

type ImagemEvento = {
  id: number;
  link: string;
  idEvento: number;
}

type EventoColaborador = {
  id: number;
  categoria: string;
  idEvento: number;
  idColaborador: number;
  colaborador: {
    id: number;
    nome: string;
  };
}

interface Category {
  value: string;
  label: string;
}

export default function DetalhesEvento() {
  const { data: session, status } = useSession();
  const params = useParams();
  const router = useRouter();

  const id = params.id;

  const [evento, setEvento] = useState<Evento | null>(null);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);
  const [mostrarTodasImagens, setMostrarTodasImagens] = useState(false);

  // Estados para o modal de imagem
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [showImageModal, setShowImageModal] = useState(false);
  const [isImageModalClosing, setIsImageModalClosing] = useState(false);

  useEffect(() => {
    async function loadEventoAndCategories() {
      try {
        // Load Evento
        const resEvento = await fetch(`/api/evento?id=${id}`);
        if (!resEvento.ok) {
          throw new Error('Failed to load event');
        }
        const dataEvento = await resEvento.json();
        setEvento(dataEvento);

        // Load Categories
        const resCategories = await fetch("/api/enums/categoriaCurso");
        if (!resCategories.ok) {
          throw new Error("Erro ao buscar categorias de evento");
        }
        const dataCategories = await resCategories.json();
        setCategories(dataCategories);

      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      } finally {
        setLoading(false);
      }
    }
    loadEventoAndCategories();
  }, [id]);

  // Funções para controlar o modal de imagem
  const handleOpenImageModal = (imageUrl: string) => {
    setSelectedImage(imageUrl);
    setShowImageModal(true);
  };

  const handleCloseImageModal = () => {
    setIsImageModalClosing(true);
    setTimeout(() => {
      setShowImageModal(false);
      setIsImageModalClosing(false);
      setSelectedImage(null);
    }, 700); // Duração da animação de fade out
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
        <p className="ml-4 text-lg text-gray-700">Carregando evento...</p>
      </div>
    );
  }

  if (!evento) {
    return notFound();
  }

  const absoluteLink = (url: any) => {
    return url.startsWith('http://') || url.startsWith('https://')
      ? url
      : `https://${url}`;
  }

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR") + " às " + date.toLocaleTimeString("pt-BR", { hour: '2-digit', minute: '2-digit' });
  }

  const categoriaMapeada = categories.find((category) => category.value === evento?.categoria);

  // Encontra o coordenador (usuário com tipo de participação 'Coordenador' ou o primeiro da lista)
  const coordenador = evento?.eventoUsuario?.find(eu => eu.tipoParticipacao === 'Coordenador') || evento?.eventoUsuario?.[0];

  // Verifica se o usuário atual é o coordenador do evento
  const isEventOwner = coordenador?.idUsuario === Number(session?.user.id);

  // Pega a primeira imagem para o background
  const backgroundImage = evento?.imagemEvento?.[0]?.link;

  return (
    <div>
      <div
        className="bg-gray-200 bg-cover bg-center bg-no-repeat relative min-h-[400px]"
        style={{
          backgroundImage: backgroundImage ? `url(${backgroundImage})` : undefined,
        }}
      >
        {/* Overlay para melhorar legibilidade */}
        <div className="absolute inset-0 bg-black/20"></div>

        {/* Conteúdo com z-index para ficar acima da overlay */}
        <div className="relative z-10 flex flex-col md:flex-row w-full mx-auto px-8 py-10">

          <div className="w-full md:w-1/2 md:pr-10">
            <h1 className="text-3xl md:text-5xl font-bold pb-6 text-white drop-shadow-lg">
              {evento?.titulo}
              {isEventOwner && (
                <button
                  className="p-0 ml-2 border-none bg-transparent cursor-pointer hover:opacity-70 transition-opacity"
                  onClick={() => router.push(`/evento/editar/${evento?.id}`)}
                  aria-label="Editar Evento"
                >
                  <img
                    src="/pen.png"
                    alt="Editar"
                    className="w-6 h-6 filter brightness-0 invert"
                  />
                </button>
              )}
            </h1>

            <p className="text-justify text-white drop-shadow-md">{evento?.descricao}</p>
            <div className="flex">
              <Badge className="mr-2 my-5">{categoriaMapeada?.label}</Badge>
            </div>

            {evento?.linkParticipacao && (
              <div>
                <Button asChild size="sm" className="transition-all duration-300 ease-in-out hover:shadow-lg hover:shadow-white/50 hover:scale-105 hover:brightness-110">
                  <a
                    href={absoluteLink(evento?.linkParticipacao)}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <PencilLine />
                    Participar
                  </a>
                </Button>
              </div>
            )}
          </div>

          <div className="w-full md:w-1/2 flex justify-center items-start pt-10 md:mt-0">
            <div className="p-5 rounded-lg shadow-md flex flex-col space-y-2 bg-gray-900/80 backdrop-blur-sm text-gray-200">
              <p><strong>Início:</strong> {formatDateTime(evento?.dataInicio)}</p>
              <p><strong>Fim:</strong> {formatDateTime(evento?.dataFim)}</p>
              <p><strong>Local:</strong> {evento?.local}</p>
              <p><strong>Coordenador:</strong> {coordenador?.usuario?.Nome || 'Não informado'}</p>
              <div>
                <strong>Colaboradores:</strong>
                <ul className="list-disc pl-5 mt-2 text-sm line-clamp-1">
                  {(!evento.eventoColaborador || evento.eventoColaborador.length === 0) &&
                    (!evento.eventoUsuario || !evento.eventoUsuario.some((u) => u.tipoParticipacao !== "Coordenador")) ? (
                    <li>Nenhum colaborador</li>
                  ) : (
                    <>
                      {/* Lista de colaboradores externos */}
                      {evento.eventoColaborador?.map((colab, index) => (
                        <li key={`colab-${index}`}>
                          {colab.colaborador.nome} - {colab.categoria}
                        </li>
                      ))}

                      {/* Usuários do sistema que não são coordenadores */}
                      {evento.eventoUsuario
                        ?.filter((u) => u.tipoParticipacao !== "Coordenador")
                        .map((user, index) => (
                          <li key={`user-${index}`}>
                            {user.usuario.Nome} - {user.tipoParticipacao}
                          </li>
                        ))}
                    </>
                  )}
                </ul>
              </div>
              <p><strong>Última Atualização:</strong> {new Date(evento?.updatedAt).toLocaleDateString("pt-BR")}</p>
            </div>
          </div>

        </div>
      </div>

      {/* CONTEÚDO DE IMAGENS */}
      <div className="flex flex-col items-center px-4">
        <div className="container mx-auto">
          <div className="mt-12">
            <h1 className="px-8 text-center text-3xl font-bold">Galeria</h1>
            {evento.imagemEvento.length > 0 ? (
              <Carrossel
                children={(() => {
                  // Prepara os cards das imagens
                  const imageCards = evento.imagemEvento.map((imagem, index) => (
                    <div
                      key={`image-${index}`}
                      onClick={() => handleOpenImageModal(imagem.link)}
                      className="cursor-pointer"
                    >
                      <CardImagem
                        src={imagem.link}
                        alt={`Imagem do evento ${index + 1}`}
                      />
                    </div>
                  ));

                  // Se houver menos de 3 imagens, adiciona cards vazios para completar
                  if (imageCards.length < 4) {
                    const emptyCardsNeeded = 3 - imageCards.length;
                    for (let i = 0; i < emptyCardsNeeded; i++) {
                      imageCards.push(
                        <div
                          key={`empty-${i}`}
                          className="bg-gray-100 rounded-lg shadow-md overflow-hidden"
                        >
                          <div className="w-72 h-42 flex items-center justify-center text-gray-400">
                          </div>
                        </div>
                      );
                    }
                  }

                  return imageCards;
                })()}
                linhas={1}
              />
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>Nenhuma imagem encontrada</p>
              </div>
            )}
          </div>
        </div>

        {/* Botão para mostrar todas as imagens */}
        {evento.imagemEvento.length > 0 && (
          <div className="mt-8">
            <Button
              onClick={() => setMostrarTodasImagens(!mostrarTodasImagens)}
              variant="outline"
              className="mb-6"
            >
              {mostrarTodasImagens ? 'Ocultar' : `Todas as Imagens (${evento.imagemEvento.length})`}
            </Button>
          </div>
        )}

        {/* Grid de todas as imagens (oculto por padrão) */}
        {mostrarTodasImagens && evento.imagemEvento.length > 0 && (
          <div className="w-full md:w-[70%] px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6 mb-12">
              {evento.imagemEvento.map((imagem, index) => (
                <div
                  key={index}
                  className="aspect-video bg-gray-100 rounded-lg overflow-hidden cursor-pointer"
                  onClick={() => handleOpenImageModal(imagem.link)}
                >
                  <img
                    src={imagem.link}
                    alt={`Imagem do evento ${index + 1}`}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Modal de Imagem */}
      {showImageModal && selectedImage && (
        <div
          className={`fixed inset-0 flex items-center justify-center z-50 p-4 transition-all duration-700 ease-in-out ${isImageModalClosing
              ? 'bg-slate-600/0 backdrop-blur-none opacity-0'
              : 'bg-slate-600/40 backdrop-blur-sm opacity-100'
            }`}
          style={{
            backdropFilter: isImageModalClosing ? 'blur(0px)' : 'blur(8px)',
            background: isImageModalClosing
              ? 'rgba(71, 85, 105, 0)'
              : 'rgba(71, 85, 105, 0.4)'
          }}
          onClick={handleCloseImageModal}
        >
          <div
            className={`bg-white rounded-lg shadow-2xl max-w-4xl max-h-[90vh] w-full overflow-hidden transform transition-all duration-700 ease-in-out ${isImageModalClosing
                ? 'scale-95 opacity-0 translate-y-4'
                : 'scale-100 opacity-100 translate-y-0'
              }`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative">
              <button
                onClick={handleCloseImageModal}
                className="absolute top-4 right-4 z-10 bg-black/50 hover:bg-black/70 text-white rounded-full w-8 h-8 flex items-center justify-center text-lg font-light leading-none transition-colors duration-200"
              >
                ×
              </button>
              <img
                src={selectedImage}
                alt="Imagem ampliada"
                className="w-full h-auto max-h-[90vh] object-contain"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}