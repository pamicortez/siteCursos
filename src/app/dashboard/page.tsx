import { getServerSession } from "next-auth";
import ButtonLogout from "./ButtonLogout";
import { redirect } from "next/navigation";

export default async function Page() {
    const session = await getServerSession();

    if (!session) {
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