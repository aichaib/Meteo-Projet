import Image from 'next/image';
import Link from 'next/link';

export default function Header() {
  return (
    <header className="sticky top-0 z-50">
     
      <div className="bg-gradient-to-r from-green-500 via-teal-500 to-blue-600 text-white shadow-md px-2 py-2 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex flex-col">
          <div className="flex items-center justify-between mb-3">

            <div className="flex items-center space-x-4">
              <div className="">
                <Link href="/" className="flex items-center space-x-2">

                  <Image
                    src="/img/meteo.webp"
                    alt="Météo Canada Logo"
                    width={40}
                    height={40}
                    className="rounded-lg p-2 bg-white w-15 h-15  object-contain"
                  />
                  <div className="flex hidden sm:block border-l border-white h-8">
                    <h1 className="text-xl">ClimatWatch</h1>
                    <p>
                      <span className="text-xl font-semibold">

                        Analyse des données climatiques
                      </span>
                    </p>
                  </div>

                </Link>
              </div>
            </div>



            <div className="flex items-center space-x-4">
              <div className="text-right">
                <h2 className="text-sm sm:text-base font-medium">
                  Sensibilisation au réchauffement climatique
                </h2>
                <p className="text-xs opacity-80">
                  Données en temps réel&nbsp;·&nbsp;2019–2024
                </p>
                <p>
                  <Link href="/Contact" className=" opacity-80 hover:underline">
                    Contactez-nous
                  </Link>
                </p>
              </div>
              <Link
                href="/Members"
                className="flex items-center bg-purple-600 hover:bg-purple-700 transition-colors px-4 py-2 rounded-md"
              >
                <span className="mr-2 text-lg" />
                Membres
              </Link>
            </div>
          </div>

          <div className="h-[2px] bg-white/40 rounded-full overflow-hidden">
            <div className="w-2/3 h-full bg-white"></div>
          </div>
        </div>
      </div>
    </header>
  );
}
