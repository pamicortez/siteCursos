import Image from "next/image";
import Navbar from "@/components/Navbar";
import Curso from "./curso/page";
import Projeto from "@/app/projeto/page";
import ProjetoHome from "@/app/projeto/detalhes/page"
import HomePage from "@/home/page";
export default function Home() {

  return (
    <div>
    <Navbar />
    <ProjetoHome />
  </div>
  );
}
