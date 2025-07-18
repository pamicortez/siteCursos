// Caminho do ficheiro: src/app/evento/editar/[id]/page.tsx

import Evento from "../../page"; // Importa o componente do formulário que está em 'src/app/evento/page.tsx'

export default function EditarEventoPage() {
   // console.log("URL de destino:", url); // Verificação de URL,M par aonde está indo
  // Essa parte renderiza o componente 'Evento', ele ler o 'id' do URL e entra no modo de edição.
  return <Evento />;
}