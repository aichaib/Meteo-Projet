import Image from 'next/image';
import Link from 'next/link';
export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white shadow p-4 mb-6">
      <div className="max-w-5xl mx-auto flex items-center justify-between">
        {/* 1) Bloc gauche : logo + titre */}
        <Link href="/" className="flex items-center space-x-2">
          <Image
            src="/img/logo.webp"
            alt="ClimateWatch Logo"
            width={40}
            height={40}
          />
          <span className="text-2xl font-bold">ClimateWatch</span>
        </Link>

        {/* 2) Bloc droit : lien de contact */}
        <Link
          href="#contact"
          className="text-sm text-gray-700 hover:underline transition duration-150"
        >
          Contactez‑Nous
        </Link>
      </div>
    </header>
  );
}
