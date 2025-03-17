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

export default async function DetalhesCurso({params}: any) {
  const {id} = await params
  return (
    <div>
        <div className="flex w-100% h-100 bg-gray-200">
            
            <div className="w-1/2">
                <h1 className="text-5xl font-bold pt-12 pb-10 px-10 text-left">Nome do Curso {id} </h1>
                <p className="px-10 text-justify" >"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."</p>
                <div className="flex">
                    <Badge className="ml-10 mr-2 my-5">Categoria</Badge>
                    {/* <Badge variant="outline" className="my-5">Outline</Badge> */}
                </div>
            </div>

            <div className="w-1/2 flex justify-center items-center">
              <div className="p-5 min-w-1/2 min-h-1/2 rounded-md border-2 border-blue-950 border-solid">
                 <p>Instrutor: ..... </p>
                 <p>Carga Horária: xh</p>
                 <p>Última Atualização: xx/xx/xxxx</p>
              </div>
            </div>

        </div>
        
        <div className="flex flex-col items-center">
          <h1 className="text-5xl font-bold py-9">Materiais</h1>
          <div className="flex items-center hover:cursor-pointer">
            <Link /><span className="px-2 text-xl font-medium">Apostila</span>
          </div>

          <div className="flex justify-between mt-10 mx-20 p-3 rounded-md border-2 border-blue-950 w-[90%]">
            <p className="font-medium text-xl">Aula 1</p> 
            <div className="flex gap-1 hover:cursor-pointer">
              <TvMinimalPlay />
              <Headphones />
              <Images />
            </div>
          </div>

          <div className="flex justify-between mt-5 mx-20 p-3 rounded-md border-2 border-blue-950 w-[90%]">
            <p className="font-medium text-xl">Aula 2</p> 
            <div className="flex gap-1 hover:cursor-pointer">
              <TvMinimalPlay />
              <Headphones />
              <Images />
            </div>
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
