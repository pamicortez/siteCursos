"use client";

import React, { useState, useEffect } from "react";
import { Menu, X, User, Search, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import Logo from "./Logo";
import { useIsMobile } from "@/hooks/use-mobile";
import { useSession, signOut } from "next-auth/react";
import axios from "axios";
import { useRouter } from 'next/navigation';

interface Usuario {
  id: number;
  email: string;
  fotoPerfil: string;
  Nome: string;
  Titulacao: string;
  instituicaoEnsino: string;
  formacaoAcademica: string;
  resumoPessoal: string;
  tipo: string;
  createdAt: string;
}

interface Category {
  value: string;
  label: string;
}

const Navbar = () => {
  const { data: session, status } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [categoryMenuOpen, setCategoryMenuOpen] = useState(false);
  const [categoryTimeout, setCategoryTimeout] = useState<NodeJS.Timeout | null>(null);
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [userLoading, setUserLoading] = useState(false);
  const isMobile = useIsMobile();

  const [hasUser, setHasUser] = useState(false);
  const [currentPath, setCurrentPath] = useState('/');
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [navClass, setNavClass] = useState('fixed w-full z-40 transition-all duration-300 ease-in-out shadow-md top-0');
  const router = useRouter();

  const [searchTerm, setSearchTerm] = useState("");

  // Carregar dados do usuário logado
  useEffect(() => {
    const fetchUsuario = async () => {
      if (session?.user?.id && status === "authenticated") {
        setUserLoading(true);
        try {
          const response = await axios.get(`/api/usuario?id=${session.user.id}`);
          setUsuario(response.data);
          setHasUser(true);
        } catch (error) {
          console.error("Erro ao carregar usuário:", error);
          setHasUser(false);
        } finally {
          setUserLoading(false);
        }
      } else if (status === "unauthenticated") {
        setHasUser(false);
        setUsuario(null);
      }
    };

    fetchUsuario();
  }, [session, status]);

  useEffect(() => {
    setNavClass(prev => prev.replace('top-0', 'top-6'));
  }, []);

  useEffect(() => {
    setCurrentPath(window.location.pathname);

    const handlePathChange = () => {
      setCurrentPath(window.location.pathname);
    };

    window.addEventListener('popstate', handlePathChange);
    return () => window.removeEventListener('popstate', handlePathChange);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
    setUserMenuOpen(false);
    setCategoryMenuOpen(false);
  }, [currentPath]);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (userMenuOpen && !(e.target as Element).closest('#user-menu-container')) {
        setUserMenuOpen(false);
      }
      if (categoryMenuOpen && !(e.target as Element).closest('#category-menu-container')) {
        setCategoryMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [userMenuOpen, categoryMenuOpen]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/enums/categoriaCurso");
        if (!response.ok) {
          throw new Error("Erro ao buscar categorias de projeto");
        }
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error("Erro:", error);
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);


  const handleCategoryMouseEnter = () => {
    if (categoryTimeout) {
      clearTimeout(categoryTimeout);
      setCategoryTimeout(null);
    }
    setCategoryMenuOpen(true);
  };

  const handleCategoryMouseLeave = () => {
    const timeout = setTimeout(() => {
      setCategoryMenuOpen(false);
    }, 300);
    setCategoryTimeout(timeout);
  };

  const toggleUserMenu = (e: React.MouseEvent) => {
    e.stopPropagation();
    setUserMenuOpen(!userMenuOpen);
  };

  const handleNavigation = (path: string, e?: React.MouseEvent) => {
    e?.preventDefault();
    router.push(path);  // ✅ Usar router em vez de window.location
  };

  const handleSignOut = async () => {
    try {
      await signOut({
        redirect: false  // ✅ Desabilita redirecionamento automático
      });
      // Usar router para navegação
      router.push('/login');  // ✅ Preserva o host
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      router.push('/login');
    }
  };

  // Função para formatar o nome da categoria para exibição (igual ao CardCurso)
  // const formatarCategoria = (categoria: string) => {
  //   const categoriaMap: { [key: string]: string } = {
  //     "LinguagensLetrasEComunicacao": "Linguagens, Letras e Comunicação",
  //     "ArtesECultura": "Artes e Cultura",
  //     "CienciasAgrarias": "Ciências Agrárias",
  //     "PesquisaEInovacao": "Pesquisa e Inovação",
  //     "ServicosSociasEComunitarios": "Serviços Sociais e Comunitários",
  //     "GestaoEPlanejamento": "Gestão e Planejamento",
  //     "CienciasSociaisAplicadasANegocios": "Ciências Sociais Aplicadas a Negócios",
  //     "ComunicacaoEInformacao": "Comunicação e Informação",
  //     "CienciasBiologicasENaturais": "Ciências Biológicas e Naturais",
  //     "EngenhariaEProducao": "Engenharia e Produção",
  //     "TecnologiaEComputacao": "Tecnologia e Computação",
  //     "ProducaoEConstrucao": "Produção e Construção",
  //     "SaudeEBemEstar": "Saúde e Bem-estar",
  //     "EducacaoEFormacaoDeProfessores": "Educação e Formação de Professores",
  //     "NegociosAdministracaoEDireito": "Negócios, Administração e Direito",
  //     "CienciasExatas": "Ciências Exatas",
  //     "CienciasHumanas": "Ciências Humanas",
  //     "MeioAmbienteESustentabilidade": "Meio Ambiente e Sustentabilidade"
  //   }
  //   return categoriaMap[categoria] || categoria
  // }

  // Função para fechar o menu mobile
  const closeMobileMenu = () => {
    setIsOpen(false);
  };

  return (
    <>
      <nav
        className={cn(
          "fixed w-full z-40 transition-all duration-300 ease-in-out shadow-md top-0",
          scrolled
            ? "backdrop-blur-xl bg-gray-900/80 border-b border-gray-700 py-4"
            : "bg-gray-900 py-6"
        )}
      >
        <div className="container mx-auto px-6 md:px-8">
          <div className="flex items-center">
            {/* Logo and Categories */}
            <div className="flex items-center space-x-20 w-1/4">
              <Logo />

              {/* Categories Dropdown */}
              <div
                id="category-menu-container"
                className="hidden md:flex items-center space-x-2 relative"
                onMouseEnter={handleCategoryMouseEnter}
                onMouseLeave={handleCategoryMouseLeave}
              >
                <span className="text-gray-200">Categorias</span>
                <button className="flex items-center justify-center w-9 h-9 bg-gray-700 rounded-full hover:bg-gray-600 transition-colors cursor-pointer">
                  <ChevronDown className="w-5 h-5 text-gray-200" />
                </button>

                {/* Categories Dropdown Menu */}
                <div
                  className={cn(
                    "absolute left-0 mt-2 w-max top-full rounded-md bg-gray-800 py-2 shadow-lg ring-1 ring-gray-700 focus:outline-none transition-all duration-200 ease-in-out",
                    categoryMenuOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2 pointer-events-none"
                  )}
                >
                  {categories.map((category) => (
                    <button
                      key={`desktop-${category.value}`}
                      onClick={() => {
                        router.push(`/search?categoria=${encodeURIComponent(category.value)}`);
                        setCategoryMenuOpen(false);
                      }}
                      className="block text-left w-full whitespace-nowrap px-4 py-2 text-sm text-gray-200 hover:bg-gray-700"
                    >
                      {category.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Search Bar */}
            <div className="hidden md:flex justify-center flex-1 px-4">
              <div className="relative w-full max-w-xl">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Search className="w-4 h-4 text-gray-400" />
                </div>
                <input
                  type="search"
                  className="block w-full p-2 pl-10 text-sm border border-gray-700 rounded-full bg-gray-800 focus:outline-none focus:ring-1 focus:ring-gray-600 text-gray-200 placeholder-gray-400"
                  placeholder="Pesquise aqui"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      router.push(`/search?searchTerm=${encodeURIComponent(searchTerm)}`);
                    }
                  }}
                />
              </div>
            </div>

            {/* User Profile / Login Buttons */}
            <div className="flex items-center justify-end w-1/4 gap-4">
              {hasUser ? (
                    <div className="hidden md:flex items-center relative" id="user-menu-container">
                      <button
                        onClick={toggleUserMenu}
                        className="flex items-center justify-center w-9 h-9 bg-gray-700 rounded-full hover:bg-gray-600 transition-colors overflow-hidden"
                      >
                    {userLoading ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-200"></div>
                    ) : usuario?.fotoPerfil ? (
                      <img
                        src={usuario.fotoPerfil}
                        alt="Foto de perfil"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="w-5 h-5 text-gray-200" />
                    )}
                  </button>

                  <div
                    className={cn(
                      "absolute right-0 w-48 rounded-md bg-gray-800 py-2 shadow-lg ring-1 ring-gray-700 transition-all duration-200",
                      "top-[calc(100%_+_0.25rem)]",
                      userMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"
                    )}
                  >
                    <div className="px-4 py-2 text-sm text-gray-200 border-b border-gray-700">
                      <div className="font-medium">{usuario?.Nome || "Carregando..."}</div>
                      <div className="text-xs text-gray-400">{usuario?.email || "..."}</div>
                    </div>
                    <a 
                      href="/profile" 
                      onClick={(e) => handleNavigation('/profile', e)} 
                      className="block px-4 py-2 text-sm text-gray-200 hover:bg-gray-700"
                    >
                      Perfil
                    </a>
                    {usuario?.tipo === 'Super' && (
                      <a
                        href="/userManagement"
                        onClick={(e) => handleNavigation('/pages/userManagement', e)}
                        className="block px-4 py-2 text-sm text-gray-200 hover:bg-gray-700"
                      >
                        Gerenciar Usuários
                      </a>
                    )}
                    <button
                      onClick={handleSignOut}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-200 hover:bg-gray-700"
                    >
                      Sair
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <button
                    onClick={(e) => handleNavigation('/login', e)}
                    className="hidden md:flex items-center relative group px-4 py-2 text-gray-200 hover:text-white transition-colors"
                  >
                    <span className="relative z-10">Entrar</span>
                    <span className="absolute bottom-0 left-0 w-full h-px bg-gray-200 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-in-out origin-left"></span>
                  </button>
                  <button
                    onClick={(e) => handleNavigation('/criar-conta', e)}
                    className="hidden md:flex items-center px-4 py-2 bg-transparent border border-gray-200 text-gray-200 rounded-md hover:bg-gray-200 hover:text-gray-900 transition-colors"
                  >
                    Cadastrar
                  </button>
                </>
              )}

              {/* Mobile Menu Button */}
              <button
                className="md:hidden text-gray-200 focus:outline-none transition-all duration-200 ease-in-out"
                onClick={() => setIsOpen(!isOpen)}
                aria-label={isOpen ? "Close Menu" : "Open Menu"}
              >
                {isOpen ? (
                  <X className="w-6 h-6 transition-all duration-300 ease-in-out" />
                ) : (
                  <Menu className="w-6 h-6 transition-all duration-300 ease-in-out" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div
          className={cn(
            "fixed inset-0 bg-gray-900 z-50 transition-all duration-300 ease-in-out md:hidden overflow-y-auto",
            isOpen ? "opacity-100 translate-x-0" : "opacity-0 translate-x-full pointer-events-none"
          )}
        >
          <div className="flex items-center justify-between p-6 border-b border-gray-700">
            <div className="flex items-center">
              <Logo />
            </div>
            <button
              onClick={closeMobileMenu}
              className="text-gray-200 focus:outline-none transition-all duration-200 ease-in-out"
              aria-label="Fechar Menu"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="flex flex-col h-full pt-4">
            {/* Mobile Search */}
            <div className="px-6 mb-6">
              <div className="relative w-full">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Search className="w-4 h-4 text-gray-400" />
                </div>
                <input
                  type="search"
                  className="block w-full p-3 pl-10 text-sm border border-gray-700 rounded-lg bg-gray-800 text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-600"
                  placeholder="Pesquise aqui"
                />
              </div>
            </div>

            {/* Mobile Login/Signup Buttons */}
            {!hasUser && (
              <div className="px-6 space-y-4 mb-6">
                <button
                  onClick={(e) => {
                    handleNavigation('/login', e);
                    closeMobileMenu();
                  }}
                  className="w-full py-3 px-4 text-center text-gray-200 hover:bg-gray-800 rounded-lg transition-colors"
                >
                  Entrar
                </button>
                <button
                  onClick={(e) => {
                    handleNavigation('/criar-conta', e);
                    closeMobileMenu();
                  }}
                  className="w-full py-3 px-4 text-center border border-gray-200 text-gray-200 hover:bg-gray-200 hover:text-gray-900 rounded-lg transition-colors"
                >
                  Cadastrar
                </button>
              </div>
            )}

            {/* Mobile User Info */}
            {hasUser && usuario && (
              <div className="px-6 mb-6">
                <div className="flex items-center space-x-4 p-4 bg-gray-800 rounded-lg">
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-700 flex items-center justify-center flex-shrink-0">
                    {usuario.fotoPerfil ? (
                      <img
                        src={usuario.fotoPerfil}
                        alt="Foto de perfil"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="w-6 h-6 text-gray-200" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-gray-200 font-medium truncate">{usuario.Nome}</div>
                    <div className="text-gray-400 text-sm truncate">{usuario.email}</div>
                  </div>
                </div>
              </div>
            )}

            {/* Mobile Categories */}
            <div className="px-6 mb-6">
              <div className="font-medium mb-3 text-gray-200 text-lg">Categorias</div>
              <div className="space-y-1 max-h-40 overflow-y-auto">
                {categories.map((category) => (
                  <a
                    key={`mobile-${category.value}`}
                    onClick={(e) => {
                      e.preventDefault();
                      router.push(`/search?categoria=${encodeURIComponent(category.value)}`);
                      closeMobileMenu();
                    }}
                    href={`/search?categoria=${encodeURIComponent(category.value)}`}
                    className="block py-2 px-3 text-gray-400 hover:text-white hover:bg-gray-800 rounded-md transition-colors"
                  >
                    {category.label}
                  </a>
                ))}
              </div>
            </div>

            {/* Mobile Menu Options */}
            {hasUser && (
              <div className="px-6 space-y-2 mb-6">
                <a
                  href="/profile"
                  className="flex items-center space-x-3 py-3 px-4 text-gray-200 hover:bg-gray-800 rounded-lg transition-colors"
                  onClick={(e) => {
                    handleNavigation('/profile', e);
                    closeMobileMenu();
                  }}
                >
                  <User className="w-5 h-5" />
                  <span>Perfil</span>
                </a>
                
                {usuario?.tipo === 'Super' && (
                  <a
                    href="/userManagement"
                    className="flex items-center space-x-3 py-3 px-4 text-gray-200 hover:bg-gray-800 rounded-lg transition-colors"
                    onClick={(e) => {
                      handleNavigation('/pages/userManagement', e);
                      closeMobileMenu();
                    }}
                  >
                    <User className="w-5 h-5" />
                    <span>Gerenciar Usuários</span>
                  </a>
                )}
                
                <button
                  onClick={() => {
                    handleSignOut();
                    closeMobileMenu();
                  }}
                  className="flex items-center space-x-3 py-3 px-4 text-gray-200 hover:bg-gray-800 rounded-lg transition-colors w-full text-left"
                >
                  <X className="w-5 h-5" />
                  <span>Sair</span>
                </button>
              </div>
            )}

            <div className="flex-1"></div>
          </div>
        </div>
      </nav>

      <div
        className={cn(
          "w-full",
          hasUser ? (scrolled ? "h-28" : "h-32") : (scrolled ? "h-24" : "h-32")
        )}
      ></div>
    </>
  );
};

export default Navbar;