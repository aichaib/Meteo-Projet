import Image from "next/image";
import Accueil from "@/components/Accueil";
import Pollution from "@/components/Pages/Pollution";
import Precipitations from "@/components/Pages/Precipitations";
import Temperature from "@/components/Pages/Temperature";
import Resultats from "@/components/Pages/Resultats";
import Contact from "@/components/Contact";
export default function Home() {
  return (
   <>
      <Accueil />
      <Resultats />
      <Temperature />
      <Precipitations />  
      <Pollution />
      
   </>
  );
}
