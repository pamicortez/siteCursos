import Image from "next/image";
import Navbar from "@/components/Navbar";
import Curso from "./curso/page";

export default function Home() {

  return (
    <div>
    <Navbar />
    <Curso />
  </div>
  );
}
