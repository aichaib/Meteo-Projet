import Image from "next/image";
import Accueil from "@/components/Accueil";
import Pollution from "@/components/Pages/Pollution";
import Precipitations from "@/components/Pages/Precipitations";
import Temperature from "@/components/Pages/Temperature";
export default function Home() {
  return (
   <>
   <Accueil />
    <Temperature />
    <Precipitations />
    <Pollution />
   </>
  );
}
