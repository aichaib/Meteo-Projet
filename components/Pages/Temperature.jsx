"use client";
import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function Temperature() {
    const [provinces, setProvinces] = useState([]);
    const [temperatures, setTemperatures] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedProvince, setSelectedProvince] = useState('toutes');
    const [selectedAnnee, setSelectedAnnee] = useState('toutes');
    const [annees, setAnnees] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProvinces = async () => {
            try {
                const response = await fetch('/api/provinces');
                const data = await response.json();
                setProvinces(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error("Erreur provinces :", error);
                setError("Impossible de charger les provinces");
            }
        };
        fetchProvinces();
    }, []);

    useEffect(() => {
        const fetchAnnees = async () => {
            try {
                const response = await fetch('/api/faits?type=annees');
                const data = await response.json();
                setAnnees(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error("Erreur années :", error);
                setError("Impossible de charger les années");
            }
        };
        fetchAnnees();
    }, []);

    const fetchTemperatures = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch('/api/faits');
            const allData = await response.json();
            const filtered = allData.filter(item => {
                const matchProvince = selectedProvince === 'toutes' || item.province_code === selectedProvince;
                const matchAnnee = selectedAnnee === 'toutes' || item.annee === parseInt(selectedAnnee);
                return matchProvince && matchAnnee && item.temperature_moy !== null;
            });
            setTemperatures(filtered);
        } catch (error) {
            console.error('Erreur températures :', error);
            setError("Impossible de charger les températures");
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchTemperatures();
    }, [selectedProvince, selectedAnnee]);

    return (
        <section id="temperature" className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50 py-12">
            <div className="container mx-auto px-4">
                <div className="text-center mb-8">
                    <h2 className="text-4xl font-bold bg-gradient-to-r from-yellow-500 to-red-500 bg-clip-text text-transparent mb-4">
                        Données de Températures
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Explorez les températures moyennes au Canada. Filtrez par province et année pour voir les tendances climatiques.
                    </p>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
                        <div className="flex items-center">
                            <div className="w-5 h-5 bg-red-100 rounded-full flex items-center justify-center mr-3">
                                <span className="text-red-600 text-sm">⚠️</span>
                            </div>
                            <p className="text-red-700">{error}</p>
                        </div>
                    </div>
                )}

                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 mb-8 border border-white/20">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Province</label>
                            <select
                                value={selectedProvince}
                                onChange={(e) => setSelectedProvince(e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-300"
                                disabled={provinces.length === 0}
                            >
                                <option value="toutes">Toutes les provinces</option>
                                {provinces.map((province, index) => (
                                    <option key={index} value={province.code}>{province.nom}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Année</label>
                            <select
                                value={selectedAnnee}
                                onChange={(e) => setSelectedAnnee(e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-300"
                                disabled={annees.length === 0}
                            >
                                <option value="toutes">Toutes les années</option>
                                {annees.map((a, index) => (
                                    <option key={index} value={a.annee}>{a.annee}</option>
                                ))}
                            </select>
                        </div>

                        <div className="flex items-end">
                            <button
                                onClick={() => {
                                    setSelectedProvince('toutes');
                                    setSelectedAnnee('toutes');
                                }}
                                className="w-full bg-gradient-to-r from-yellow-500 to-red-500 text-white py-3 px-6 rounded-xl font-semibold hover:from-yellow-600 hover:to-red-600 transform hover:scale-105 transition-all duration-300"
                            >
                                Réinitialiser
                            </button>
                        </div>
                    </div>
                </div>

                {temperatures.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20">
                            <div className="flex items-center">
                                <Image
                                    src="/img/Temperature.webp"
                                    alt="Températures"
                                    width={48}
                                    height={48}
                                    className="w-12 h-12 mr-4"
                                />
                                <div>
                                    <p className="text-sm text-gray-600">Température Moyenne</p>
                                    <p className="text-2xl font-bold text-red-600">
                                        {(
                                            temperatures.reduce((sum, item) => sum + (item.temperature_moy || 0), 0) / temperatures.length
                                        ).toFixed(1)} °C
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20">
                            <div className="flex items-center">
                                <Image
                                    src="/img/provinces.webp"
                                    alt="Stations"
                                    width={48}
                                    height={48}
                                    className="w-12 h-12 mr-4"
                                />
                                <div>
                                    <p className="text-sm text-gray-600">Stations</p>
                                    <p className="text-2xl font-bold text-purple-600">
                                        {new Set(temperatures.map(item => item.station)).size}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden">
                    {loading ? (
                        <div className="p-8 text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600 mx-auto"></div>
                            <p className="mt-4 text-gray-600">Chargement des données...</p>
                        </div>
                    ) : temperatures.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Province</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Année</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Temp. Moy. (°C)</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Station</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {temperatures.map((item, index) => (
                                        <tr key={index} className="hover:bg-gray-50 transition-colors duration-200">
                                            <td className="px-6 py-4 text-sm text-gray-900 font-medium">{item.province_nom}</td>
                                            <td className="px-6 py-4 text-sm text-gray-700">{item.annee}</td>
                                            <td className="px-6 py-4 text-sm text-gray-700">{item.temperature_moy.toFixed(1)} °C</td>
                                            <td className="px-6 py-4 text-sm text-gray-700">{item.station}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="p-8 text-center">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-2xl">🌡️</span>
                            </div>
                            <p className="text-gray-600">
                                {error ? 'Erreur lors du chargement des données' : 'Aucune température trouvée pour les critères sélectionnés.'}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
