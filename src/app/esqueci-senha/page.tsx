"use client"

import RecuperarSenha from '@/components/RecuperarSenha';

import { Suspense } from 'react';


export default function EsqueciSenhaPage() {
  //return <RecuperarSenha logo="/Brasao_da_UEFS.png" />;
    return (
    <Suspense fallback={<div>Carregando...</div>}>
      <RecuperarSenha logo="/Brasao_da_UEFS.png" />
    </Suspense>
  );
}
