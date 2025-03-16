import Image from "next/image";
import Navbar from "@/components/Navbar";
import Curso from "./curso/page";
import Projeto from "@/projeto/page";
export default function Home() {

  return (
    <div>
    <Navbar />
    <Projeto />
  </div>
  );
}
