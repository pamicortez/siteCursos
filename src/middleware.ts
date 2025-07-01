import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // verifica se a rota é um nome (ex: /pamela)
  if (pathname.match(/^\/[^\/]+$/)) {
    const nome = pathname.slice(1);

    const nomeParaId: Record<string, number> = {
      'pamela': 1,
      'tassio': 2,
    };

    const usuarioId = nomeParaId[nome.toLowerCase()];

    if (usuarioId) {
      // reescreve internamente para /usuario/[id] sem mudar a URL
      return NextResponse.rewrite(new URL(`/usuario/${usuarioId}`, request.url));
    }
  }

  return NextResponse.next();
}

// configuração para aplicar o middleware apenas em rotas específicas
export const config = {
  matcher: ['/:nome'],
};