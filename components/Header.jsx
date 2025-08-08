import Image from 'next/image';
import Link from 'next/link';
import { Users } from 'lucide-react';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-lg shadow-xl">
      <nav className="bg-gradient-to-br from-indigo-600 via-blue-600 to-teal-500 text-white px-4 py-4">
        <div className="max-w-7xl mx-auto flex flex-col space-y-4">
          <div className="flex items-center justify-between">
            {/* Logo et titre */}
            <Link href="/" className="flex items-center space-x-3">
              <Image
                src="/img/meteo.webp"
                alt="Logo ClimatWatch"
                width={56}
                height={56}
                className="rounded-lg bg-white p-2 shadow-sm"
              />
              <div className="hidden sm:flex flex-col">
                <span className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                  ClimatWatch
                </span>
                <span className="text-xs sm:text-sm text-white/90">
                  Analyse des données climatiques
                </span>
              </div>
            </Link>

            {/* Zone d’informations et bouton */}
            <div className="flex items-center space-x-6">
              <div className="text-right">
                <h2 className="text-sm sm:text-base font-semibold">
                  Sensibilisation au réchauffement
                </h2>
                <p className="text-xs text-white/80">
                  Données en temps réel · 2019–2024
                </p>
                <Link
                  href="/Contact"
                  className="text-xs sm:text-sm text-white/80 underline underline-offset-4 hover:text-white transition"
                >
                  Contactez-nous
                </Link>
              </div>
              <Link
                href="/Members"
                className="flex items-center space-x-2 bg-purple-700 hover:bg-purple-800 px-5 py-2 rounded-lg shadow-md font-medium text-sm transition"
              >
                <Users className="w-4 h-4" />
                <span>Membres</span>
              </Link>
            </div>
          </div>

          {/* Barre décorative animée */}
          <div className="h-[2px] bg-white/30 rounded-full overflow-hidden relative">
            <div className="absolute inset-0 h-full w-1/2 bg-white animate-pulse rounded-full"></div>
          </div>
        </div>
      </nav>
    </header>
  );
}
