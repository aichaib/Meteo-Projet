import Image from "next/image";
import Accueil from "@/components/Accueil";
import Pollution from "@/components/Pages/Pollution";
import Precipitations from "@/components/Pages/Precipitations";
import Temperature from "@/components/Pages/Temperature";
import Contact from "@/components/Contact";
export default function Home() {
  return (
   <>
   <Accueil />
    <Temperature />
    <Precipitations />
    <Pollution />
    <Contact />
   </>
  );
}
