import { Badge } from "@/components/ui/badge"
import { Link, TvMinimalPlay, Headphones, Images } from "lucide-react"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"


async function loadCurso(id: Number) {
    const res = await fetch(`http://localhost:3000/api/curso?id=${id}`); 

    return res.json();
}

export default async function DetalhesCurso({params}: any) {
  const {id} = await params
  const curso = await loadCurso(id);

  return (
    <div>
        <div className="flex w-100% h-100 bg-gray-200">
            
            <div className="w-1/2">
                <h1 className="text-5xl font-bold pt-12 pb-10 px-10 text-left">{curso.titulo} </h1>
                <p className="px-10 text-justify" >{curso.descricao}</p>
                <div className="flex">
                    <Badge className="ml-10 mr-2 my-5">{curso.categoria}</Badge>
                    {/* <Badge variant="outline" className="my-5">Outline</Badge> */}
                </div>
            </div>

            <div className="w-1/2 flex justify-center items-center">
              <div className="p-5 min-w-1/2 min-h-1/2 rounded-md border-3 border-[#cac4d0] border-solid">
                 <p>Instrutor: {curso.usuario.Nome}</p>
                 <p>Carga Horária: {curso.cargaHoraria}h</p>
                 <p>Última Atualização: {new Date(curso.updatedAt).toLocaleDateString("pt-BR")}</p>
              </div>
            </div>

        </div>
        
        <div className="flex flex-col items-center">
          <h1 className="text-5xl font-bold py-9">Materiais</h1>
          <div className="flex items-center hover:cursor-pointer">
            <Link /><span className="px-2 text-xl font-medium">Apostila</span>
          </div>

        <div className="mt-10 mx-20 w-[90%]">
          {curso.aula.map((aula: any, index: any) => (
            <div
              key={index}
              className="flex justify-between p-3 rounded-md border-3 border-[#cac4d0] mb-4"
            >
              <p className="font-medium text-xl">{aula.titulo}</p>
              <div className="flex gap-1 hover:cursor-pointer">
                <a href={aula.linkVideo} target="_blank"><TvMinimalPlay/></a>
                <Headphones />
                <a href={aula.linkPdf} target="_blank"><Images/></a>
              </div>
            </div>
          ))}
        </div>

         <Pagination className="m-20">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#" />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">1</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#" isActive>
                2
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">3</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
            <PaginationItem>
              <PaginationNext href="#" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>

        </div>
    </div>
  );
}

// precisa botar link apostila e link pra podcast
//precisa do formato da requisiçao pra fazer o post