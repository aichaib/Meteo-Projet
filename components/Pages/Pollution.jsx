"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { FaDatabase } from "react-icons/fa";

export default function Pollution() {
  const [provinces, setProvinces] = useState([]);
  const [pollution, setPollution] = useState([]);     // <- minuscule
  const [loading, setLoading] = useState(false);
  const [selectedProvince, setSelectedProvince] = useState("toutes");
  const [selectedAnnee, setSelectedAnnee] = useState("toutes");
  const [annees, setAnnees] = useState([]);
  const [error, setError] = useState(null);

  // dérivés (nom et url de source)
  const sourceList = [...new Set(pollution.map(r => r.source_nom))].join(", ");
  const sourceURLs = [...new Set(pollution.map(r => r.source_url).filter(Boolean))];

  useEffect(() => {
    (async () => {
      try {
        const r = await fetch("/api/provinces");
        setProvinces(await r.json());
      } catch (e) {
        console.error(e);
        setError("Impossible de charger les provinces");
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const r = await fetch("/api/faits?type=annees");
        setAnnees(await r.json());
      } catch (e) {
        console.error(e);
        setError("Impossible de charger les années");
      }
    })();
  }, []);

  const fetchPollution = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ metric: "co2" });
      if (selectedProvince !== "toutes") params.set("province", selectedProvince);
      if (selectedAnnee !== "toutes") params.set("annee", selectedAnnee);

      const r = await fetch(`/api/faits?${params.toString()}`);
      const data = await r.json();

      // Sécurité: si l’API ne filtrait pas, on garde ton filtre client
      const filtered = Array.isArray(data)
        ? data.filter(item => {
          const okProv =
            selectedProvince === "toutes" || item.province_code === selectedProvince;
          const okYear =
            selectedAnnee === "toutes" || item.annee === parseInt(selectedAnnee);
          return okProv && okYear && item.co2_moy_mt !== null;
        })
        : [];
      setPollution(filtered);
    } catch (e) {
      console.error("Erreur CO₂ :", e);
      setError("Impossible de charger les données de pollution");
      setPollution([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPollution();
  }, [selectedProvince, selectedAnnee]);

  // Moyenne affichée
  const avgCO2 =
    pollution.length > 0
      ? (pollution.reduce((s, x) => s + (x.co2_moy_mt || 0), 0) / pollution.length).toFixed(2)
      : "0.00";

  return (
    <section id="pollution" className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50 py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-yellow-500 to-red-500 bg-clip-text text-transparent mb-4">
            Données de la Pollution (CO₂)
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Explorez les émissions moyennes par province (2019–2023).
          </p>

          {/* Lien vers Power BI */}
          <div className="text-center mt-12">
            <a
              href="https://app.powerbi.com/groups/me/reports/1dada293-3eaa-495e-9d35-d15b60f0d5d4/32ba38f7505e068a113d?experience=power-bi"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white text-yellow-600 font-bold py-3 px-6 rounded-xl shadow hover:bg-yellow-100 transition-all duration-300"
            >
              Accéder au rapport de pollution par province et année (Power BI)
            </a>
          </div>
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

        {/* Filtres */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 mb-8 border border-white/20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-bold bg-gradient-to-r from-yellow-500 to-red-500 bg-clip-text text-transparent mb-2">
                Province
              </label>
              <select
                value={selectedProvince}
                onChange={(e) => setSelectedProvince(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-300"
                disabled={provinces.length === 0}
              >
                <option value="toutes">Toutes les provinces</option>
                {provinces.map((p) => (
                  <option key={p.code} value={p.code}>{p.nom}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold bg-gradient-to-r from-yellow-500 to-red-500 bg-clip-text text-transparent mb-2">
                Année
              </label>
              <select
                value={selectedAnnee}
                onChange={(e) => setSelectedAnnee(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all durée-300"
                disabled={annees.length === 0}
              >
                <option value="toutes">Toutes les années</option>
                {annees.map((a) => (
                  <option key={a.annee} value={a.annee}>{a.annee}</option>
                ))}
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={() => {
                  setSelectedProvince("toutes");
                  setSelectedAnnee("toutes");
                }}
                className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 text-white py-3 px-6 rounded-xl font-semibold hover:from-violet-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-300"

              >
                Réinitialiser
              </button>
            </div>
          </div>
        </div>

        {/* Cartes résumé */}
        {pollution.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20">
              <div className="flex items-center">
                <Image src="/img/Temperature.webp" alt="CO₂" width={48} height={48} className="w-12 h-12 mr-4" />
                <div>
                  <p className="text-sm text-gray-600">CO₂ moyen</p>
                  <p className="text-2xl font-bold text-red-600">{avgCO2} Mt CO₂e</p>
                </div>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20">
              <div className="flex items-center">
                <Image src="/img/provinces.webp" alt="Provinces" width={48} height={48} className="w-12 h-12 mr-4" />
                <div>
                  <p className="text-sm text-gray-600">Provinces couvertes</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {new Set(pollution.map(x => x.province_code)).size}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20">
              <div className="flex items-center">
                <FaDatabase className="w-12 h-12 text-blue-600 mr-4" />
                <div className="min-w-0">
                  <p className="text-sm text-gray-600">Source</p>
                  <p className="text-sm font-semibold text-blue-700 truncate" title={sourceList}>
                    {sourceList || "—"}
                  </p>

                  {sourceURLs.length === 1 && (
                    <a
                      href={sourceURLs[0]}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-blue-600 underline break-all"
                    >
                      {sourceURLs[0]}
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tableau */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Chargement des données...</p>
            </div>
          ) : pollution.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-bold bg-gradient-to-r from-yellow-500 to-red-500 bg-clip-text text-transparent">Province</th>
                    <th className="px-6 py-4 text-left text-sm font-bold bg-gradient-to-r from-yellow-500 to-red-500 bg-clip-text text-transparent">Année</th>
                    <th className="px-6 py-4 text-left text-sm font-bold bg-gradient-to-r from-yellow-500 to-red-500 bg-clip-text text-transparent">CO₂ (Mt CO₂e)</th>
                    <th className="px-6 py-4 text-left text-sm font-bold bg-gradient-to-r from-yellow-500 to-red-500 bg-clip-text text-transparent">Source</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {pollution.map((item, idx) => (
                    <tr key={idx} className="hover:bg-gray-50 transition-colors duration-200">
                      <td className="px-6 py-4 text-sm text-gray-900 font-medium">{item.province_nom}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{item.annee}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{item.co2_moy_mt?.toFixed(2)}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {item.source_url ? (
                          <a href={item.source_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                            {item.source_nom}
                          </a>
                        ) : (
                          item.source_nom || "—"
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🫧</span>
              </div>
              <p className="text-gray-600">Aucune donnée CO₂ trouvée pour les critères sélectionnés.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
