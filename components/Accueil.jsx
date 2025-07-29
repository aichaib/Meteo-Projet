import Image from 'next/image';
import Link from 'next/link';
const provinces = [
    'NL', 'PE', 'NS', 'NB', 'QC', 'ON', 'MB', 'SK', 'AB', 'BC', 'YT', 'NT', 'NU'
];

export default function HomePage() {
    return (
        <main className="flex flex-col md:flex-row gap-6 p-6">
            {/* Left panel */}
            <section className="md:w-1/2 bg-white rounded-2xl shadow-lg p-6">
                <div className="rounded-xl overflow-hidden mb-6">
                    <Image
                        src="/img/Image1.webp"
                        alt="Sensibilisation"
                        width={800}
                        height={450}
                        className="object-cover"
                    />
                </div>
                <h1 className="text-3xl font-bold mb-4">Sensibilisation au réchauffement climatique au Canada</h1>
                <p className="mb-6 text-gray-700">
                    Ce site présente des données 
                    réelles sur la température,
                     les précipitations et la pollution au Canada entre 2019 et 2024 afin de sensibiliser le public aux impacts du changement climatique.
                </p>
                <div className="rounded-xl overflow-hidden">
                    <Image
                        src="/img/Image2.webp"
                        alt="Comprendre pour agir"
                        width={800}
                        height={450}
                        className="object-cover"
                    />
                </div>
            </section>

            <aside className="md:w-1/2 bg-white rounded-2xl shadow-lg p-6">
            <nav className="mb-6">
                <ul className="flex space-x-6">
                    <li>
                        <Link href="#temperature" className="text-base text-gray-700 hover:underline transition duration-150">
                            Température
                        </Link>
                    </li>
                    <li >
                        <Link href="#precipitations" className="text-base text-gray-700 hover:underline transition duration-150">
                            Précipitations
                        </Link>
                    </li>
                    <li >
                        <Link href="#pollution" className="text-base text-gray-700 hover:underline transition duration-150">
                            Pollution
                        </Link>
                    </li>

                </ul>
            </nav>
                <h2 className="text-2xl font-semibold mb-4">Provinces du Canada</h2>
                <ul className="grid grid-cols-3 gap-4">
                    {provinces.map((code) => (
                        <li key={code} className="font-medium text-gray-800">
                            {code}
                        </li>
                    ))}
                </ul>
            </aside>
        </main>
    );
}
