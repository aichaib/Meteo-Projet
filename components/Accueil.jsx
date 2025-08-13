import Image from 'next/image';
import Link from 'next/link';

const provinces = [
    'NL', 'PE', 'NS', 'NB', 'QC', 'ON', 'MB', 'SK', 'AB', 'BC', 'YT', 'NT', 'NU'
];

export default function HomePage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
            <main className="container mx-auto px-4 py-8">
                {/* Hero Section */}
                <div className="text-center mb-12">
                    <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 via-green-600 to-blue-800 bg-clip-text text-transparent mb-4 animate-pulse">
                        Météo Canada
                    </h1>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Découvrez l'impact du changement climatique à travers les données réelles
                    </p>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Left panel - Main Content */}
                    <section className="lg:w-2/3">
                        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-white/20 hover:shadow-3xl transition-all duration-500">
                            {/* First Image Section */}
                            <div className="rounded-2xl overflow-hidden mb-8 transform hover:scale-105 transition-transform duration-300">
                                <Image
                                    src="/img/Image1.webp"
                                    alt="Sensibilisation au changement climatique"
                                    width={800}
                                    height={450}
                                    className="object-cover w-full h-64 md:h-80"
                                />
                            </div>

                            <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                                Sensibilisation au réchauffement climatique
                            </h2>

                            <p className="text-lg text-gray-700 leading-relaxed mb-8">
                                Ce site présente des données réelles sur la température,
                                les précipitations et la pollution au Canada entre 2019 et 2024
                                afin de sensibiliser le public aux impacts du changement climatique.
                            </p>

                            {/* Second Image Section */}
                            <div className="rounded-2xl overflow-hidden transform hover:scale-105 transition-transform duration-300">
                                <Image
                                    src="/img/Image2.webp"
                                    alt="Comprendre pour agir"
                                    width={800}
                                    height={450}
                                    className="object-cover w-full h-64 md:h-80"
                                />
                            </div>
                        </div>
                    </section>

                    {/* Right panel - Navigation & Provinces */}
                    <aside className="lg:w-1/3">
                        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-white/20 hover:shadow-3xl transition-all duration-500">
                            {/* Navigation */}
                            <nav className="mb-8">
                                <h3 className="text-2xl font-bold mb-6 text-gray-800">Explorer les données</h3>
                                <ul className="space-y-4">
                                    <li>
                                        <Link
                                            href="#temperature"
                                            className="flex items-center p-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transform hover:scale-105 transition-all duration-300 shadow-lg"
                                        >
                                            <Image
                                                src="/img/Temperature.webp"
                                                alt="Icône température"
                                                width={24}
                                                height={24}
                                                className="w-6 h-6"
                                            />
                                            <span className="font-semibold ml-3">Température</span>
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            href="#precipitations"
                                            className="flex items-center p-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transform hover:scale-105 transition-all duration-300 shadow-lg"
                                        >
                                            <Image
                                                src="/img/Precipitation.webp"
                                                alt="Icône précipitations"
                                                width={24}
                                                height={24}
                                                className="w-6 h-6"
                                            />
                                            <span className="font-semibold ml-3">Précipitations</span>
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            href="#pollution"
                                            className="flex items-center p-4 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl hover:from-purple-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-lg"
                                        >
                                            <Image
                                                src="/img/Polution.webp"
                                                alt="Icône pollution"
                                                width={24}
                                                height={24}
                                                className="w-6 h-6"
                                            />
                                            <span className="font-semibold ml-3">Pollution</span>
                                        </Link>
                                    </li>
                                </ul>
                            </nav>

                            {/* Provinces Section */}
                            <div>
                                <h3 className="text-2xl font-bold mb-6 text-gray-800">Provinces du Canada</h3>
                                <div className="grid grid-cols-3 gap-3">
                                    {provinces.map((code) => (
                                        <div
                                            key={code}
                                            className="bg-gradient-to-br from-gray-100 to-gray-200 hover:from-blue-100 hover:to-blue-200 text-gray-800 font-semibold py-3 px-2 rounded-xl text-center transform hover:scale-110 transition-all duration-300 cursor-pointer border border-gray-200 hover:border-blue-300"
                                        >
                                            {code}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </aside>
                </div>

                {/* Call to Action Section */}
                <div className="mt-12 text-center">
                    <div className="bg-gradient-to-r from-blue-600 to-green-600 rounded-3xl p-8 text-white shadow-2xl">
                        <h3 className="text-3xl font-bold mb-4">Prêt à explorer les données ?</h3>
                        <p className="text-xl mb-6 opacity-90">
                            Découvrez comment le climat change dans votre région
                        </p>
                        <button className="bg-white text-blue-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transform hover:scale-105 transition-all duration-300 shadow-lg">
                            Commencer l'exploration
                        </button>
                    </div>
                </div>
                <div className="mt-12 text-center">
                    <p className="text-lg font-semibold mb-4">Découvrez la carte des provinces</p>
                    <div className="rounded-2xl overflow-hidden shadow-2xl border border-gray-200">
                        <iframe
                            title="carteprojet"
                            width="100%"
                            height="541"
                            src="https://app.powerbi.com/reportEmbed?reportId=fb9c8c5e-87ec-41ad-96b7-5947b0959538&autoAuth=true&ctid=ad8a84ef-f1f3-4b14-ad08-b99ca66f7e30"
                            frameBorder="0"
                            allowFullScreen={true}
                        ></iframe>
                    </div>
                </div>

            </main>
        </div>
    );
}
