import { getServerSession } from "next-auth";
import ButtonLogout from "./ButtonLogout";
import { redirect } from "next/navigation";

export default async function Page() {
    // Obtendo a sessão do usuário no servidor
    const session = await getServerSession();

    // Se não houver sessão, redireciona para a página de login
    if (!session) {
        // Redirecionamento para /login se não estiver autenticado
        redirect("/login");
    }

    return (
        <div>
            <h1>Bem-vindo ao Dashboard</h1>
            <p>Olá {session.user?.name}</p>
            <div>
                <ButtonLogout />
            </div>
        </div>
    );
}
