import Image from 'next/image';
import Link from 'next/link';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-sm shadow-lg p-4 mb-6 border-b border-gray-200">
      <div className="max-w-5xl mx-auto flex items-center justify-between">
        {/* 1) Bloc gauche : logo + titre */}
        <Link href="/" className="flex items-center space-x-3 group">
          <div className="group-hover:scale-105 transition-transform duration-300">
            <Image
              src="/img/meteo.webp"
              alt="Météo Canada Logo"
              width={40}
              height={40}
              className="w-10 h-10"
            />
          </div>
          <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
            ClimateWatch
          </span>
        </Link>

        {/* 2) Bloc droit : lien de contact */}
        <Link
          href="#contact"
          className="text-sm text-gray-700 hover:text-blue-600 transition-colors duration-300 font-medium"
        >
          Contactez‑Nous
        </Link>
      </div>
    </header>
  );
}
