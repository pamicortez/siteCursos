// Caminho do ficheiro: src/app/evento/editar/[id]/page.tsx

import Evento from "../../page"; // Importa o componente do formulário que está em 'src/app/evento/page.tsx'

export default function EditarEventoPage() {
  // Simplesmente renderizamos o componente 'Evento'.
  // Ele é inteligente o suficiente para ler o 'id' do URL e entrar no modo de edição.
  return <Evento />;
}