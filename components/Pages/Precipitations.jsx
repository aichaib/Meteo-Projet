"use client";
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { FaDatabase } from "react-icons/fa";

export default function Precipitations() {
    const [provinces, setProvinces] = useState([]);
    const [precipitations, setPrecipitations] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedProvince, setSelectedProvince] = useState('toutes');
    const [selectedAnnee, setSelectedAnnee] = useState('toutes');
    const [annees, setAnnees] = useState([]);
    const [error, setError] = useState(null);
    const sourceList = [...new Set(precipitations.map(t => t.source_nom))].join(", ");
    const sourceURL = [...new Set(precipitations.map(t => t.source_url))].join(", ");

    // Récupérer les provinces
    useEffect(() => {
        const fetchProvinces = async () => {
            try {
                const response = await fetch('/api/provinces');
                if (!response.ok) {
                    throw new Error(`Erreur HTTP: ${response.status}`);
                }
                const data = await response.json();
                if (Array.isArray(data)) {
                    setProvinces(data);
                } else {
                    console.error('Données de provinces invalides:', data);
                    setProvinces([]);
                }
            } catch (error) {
                console.error('Erreur lors du chargement des provinces:', error);
                setError('Impossible de charger les provinces');
                setProvinces([]);
            }
        };
        fetchProvinces();
    }, []);

    // Récupérer les années disponibles
    useEffect(() => {
        const fetchAnnees = async () => {
            try {
                const response = await fetch('/api/faits?type=annees');
                if (!response.ok) {
                    throw new Error(`Erreur HTTP: ${response.status}`);
                }
                const data = await response.json();
                if (Array.isArray(data)) {
                    setAnnees(data);
                } else {
                    console.error('Données d\'années invalides:', data);
                    setAnnees([]);
                }
            } catch (error) {
                console.error('Erreur lors du chargement des années:', error);
                setError('Impossible de charger les années');
                setAnnees([]);
            }
        };
        fetchAnnees();
    }, []);

    // Récupérer les données de précipitations
    const fetchPrecipitations = async () => {
        setLoading(true);
        setError(null);
        try {
            const params = new URLSearchParams();
            if (selectedProvince !== 'toutes') params.append('province', selectedProvince);
            if (selectedAnnee !== 'toutes') params.append('annee', selectedAnnee);

 
            const response = await fetch(`/api/faits?${params.toString()}`);

            if (!response.ok) {
                throw new Error(`Erreur HTTP: ${response.status}`);
            }
            const data = await response.json();
            if (Array.isArray(data)) {
                setPrecipitations(data.filter(d => d.precipitation_moy !== null));
            } else {
                console.error('Données de précipitations invalides:', data);
                setPrecipitations([]);
            }
        } catch (error) {
            console.error('Erreur lors du chargement des précipitations:', error);
            setError('Impossible de charger les données de précipitations');
            setPrecipitations([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPrecipitations();
    }, [selectedProvince, selectedAnnee]);

    return (
        <section id="precipitations" className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 py-12">
            <div className="container mx-auto px-4">
                {/* En-tête */}
                <div className="text-center mb-8">
                    <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent mb-4">
                        Données de Précipitations
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Explorez les données de précipitations au Canada entre 2019 et 2024.
                        Filtrez par province et année pour analyser les tendances climatiques.
                    </p>

                        {/* Lien vers Power BI */}
                    <div className="text-center mt-12">
                        <iframe
                            title="Precipitations"
                            width="1140"
                            height="541.25"
                            src="https://app.powerbi.com/reportEmbed?reportId=764d3e9b-ac72-4a1e-864c-92249ce360e7&autoAuth=true&ctid=ad8a84ef-f1f3-4b14-ad08-b99ca66f7e30"
                            frameBorder="0"
                            allowFullScreen
                        ></iframe>
                    </div>
                </div>

                {/* Message d'erreur */}
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

                {/* Filtres */}
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 mb-8 border border-white/20">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Filtre Province */}
                        <div>
                            <label className="block text-sm font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent mb-2">
                                Province
                            </label>
                            <select
                                value={selectedProvince}
                                onChange={(e) => setSelectedProvince(e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                                disabled={provinces.length === 0}
                            >
                                <option value="toutes">Toutes les provinces</option>
                                {Array.isArray(provinces) && provinces.map((province, index) => (
                                    <option key={index} value={province.code}>
                                        {province.nom}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Filtre Année */}
                        <div>
                            <label className="block text-sm font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent mb-2">
                                Année
                            </label>
                            <select
                                value={selectedAnnee}
                                onChange={(e) => setSelectedAnnee(e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                                disabled={annees.length === 0}
                            >
                                <option value="toutes">Toutes les années</option>
                                {Array.isArray(annees) && annees.map((annee, index) => (
                                    <option key={index} value={annee.annee}>
                                        {annee.annee}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Bouton de réinitialisation */}
                        <div className="flex items-end">
                            <button
                                onClick={() => {
                                    setSelectedProvince('toutes');
                                    setSelectedAnnee('toutes');
                                }}
                                className="w-full bg-gradient-to-r from-blue-500 to-green-500 text-white py-3 px-6 rounded-xl font-semibold hover:from-blue-600 hover:to-green-600 transform hover:scale-105 transition-all duration-300"
                            >
                                Réinitialiser
                            </button>
                        </div>
                    </div>
                </div>

                {/* Statistiques */}
                {precipitations.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20">
                            <div className="flex items-center">
                                <Image
                                    src="/img/Precipitation.webp"
                                    alt="Précipitations"
                                    width={48}
                                    height={48}
                                    className="w-12 h-12 mr-4"
                                />
                                <div>
                                    <p className="text-sm text-gray-600">Total Précipitations</p>
                                    <p className="text-2xl font-bold text-blue-600">
                                        {precipitations.reduce((sum, item) => sum + (item.precipitation_moy || 0), 0).toFixed(1)} mm
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20">
                            <div className="flex items-center">
                                <Image
                                    src="/img/provinces.webp"
                                    alt="Provinces"
                                    width={48}
                                    height={48}
                                    className="w-12 h-12 mr-4"
                                />
                                <div>
                                    <p className="text-sm text-gray-600">Stations</p>
                                    <p className="text-2xl font-bold text-purple-600">
                                        {new Set(precipitations.map(item => item.station)).size}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20">
                            <div className="flex items-center">
                                <FaDatabase className="w-12 h-12 text-blue-600 mr-4" />
                                <div>
                                    <p className="text-sm text-gray-600">Sources de données</p>
                                    <p className="text-2xl font-bold text-blue-600">{sourceList}</p>
                                    <p className="text-2xl font-bold text-blue-600">{sourceURL}</p>

                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Tableau de données */}
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden">

                    {loading ? (
                        <div className="p-8 text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                            <p className="mt-4 text-gray-600">Chargement des données...</p>
                        </div>
                    ) : precipitations.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                    <tr>

                                        <th className="px-6 py-4 text-left text-sm font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">Province</th>
                                        <th className="px-6 py-4 text-left text-sm font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">Année</th>
                                        <th className="px-6 py-4 text-left text-sm font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">Précipitations (mm)</th>
                                        <th className="px-6 py-4 text-left text-sm font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">Station</th>
                                        <th className="px-6 py-4 text-left text-sm font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">Latitude</th>
                                        <th className="px-6 py-4 text-left text-sm font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">Longitude</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {precipitations.map((item, index) => (
                                        <tr key={index} className="hover:bg-gray-50 transition-colors duration-200">
                                            <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                                                {item.province_nom}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-700">
                                                {item.annee}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-700">
                                                {item.precipitation_moy ? `${item.precipitation_moy.toFixed(1)} mm` : 'N/A'}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-700">
                                                {item.station}
                                            </td>

                                            <td className="px-6 py-4 text-sm text-gray-700">{item.latitude?.toFixed(2)}</td>
                                            <td className="px-6 py-4 text-sm text-gray-700">{item.longitude?.toFixed(2)}</td>


                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="p-8 text-center">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-2xl">🌧️</span>
                            </div>
                            <p className="text-gray-600">
                                {error ? 'Erreur lors du chargement des données' : 'Aucune donnée de précipitations trouvée pour les critères sélectionnés.'}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}