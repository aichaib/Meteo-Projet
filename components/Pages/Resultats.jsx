"use client";
import { useEffect, useState } from "react";
import { FaCalendarAlt, FaCloudRain, FaThermometerHalf, FaIndustry, FaMapMarkerAlt } from "react-icons/fa";

function Card({ title, subtitle, value, unit, icon, accent = "from-indigo-500 to-blue-500" }) {
    const Icon = icon;
    return (
        <div className="rounded-2xl border border-white/30 bg-white/70 backdrop-blur p-5 shadow-xl hover:shadow-2xl transition">
            <div className="flex items-center gap-3 mb-3">
                <div className={`rounded-xl p-2 bg-gradient-to-r ${accent} text-white`}>
                    <Icon className="w-6 h-6" />
                </div>
                <div>
                    <p className="text-xs uppercase tracking-wide text-gray-500">{title}</p>
                    <p className="text-sm text-gray-700">{subtitle}</p>
                </div>
            </div>
            <div className="flex items-end justify-between">
                <div className="text-3xl font-extrabold text-gray-900">{value}</div>
                {unit && <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600">{unit}</span>}
            </div>
        </div>
    );
}

export default function Resultats({ y1 = 2019, y2 = 2024 }) {
    const [data, setData] = useState(null);
    const [err, setErr] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        fetch(`/api/resultats?y1=${y1}&y2=${y2}`)
            .then(r => r.json())
            .then(d => { setData(d); setLoading(false); })
            .catch(e => { setErr(String(e)); setLoading(false); });
    }, [y1, y2]);

    if (loading) {
        return (
            <div className="p-8 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto" />
                <p className="mt-4 text-gray-600">Chargement des statistiques…</p>
            </div>
        );
    }
    if (err || !data) {
        return <div className="p-6 bg-red-50 border border-red-200 rounded-xl text-red-700">Erreur: {err || "données indisponibles"}</div>;
    }

    // helpers pour piocher dans les deux lignes retournées par chaque SP
    const pick = (rows, typeKey) => rows?.find(r => r.type === typeKey) ?? null;

    const yHot = pick(data.temperature.year, "plus_chaude");
    const yCold = pick(data.temperature.year, "moins_chaude");
    const pHot = pick(data.temperature.province, "plus_chaude");
    const pCold = pick(data.temperature.province, "moins_chaude");

    const yWet = pick(data.precipitation.year, "plus_pluvieuse");
    const yDry = pick(data.precipitation.year, "moins_pluvieuse");
    const pWet = pick(data.precipitation.province, "plus_pluvieuse");
    const pDry = pick(data.precipitation.province, "moins_pluvieuse");

    const yPoll = pick(data.co2.year, "plus_polluee");
    const yClean = pick(data.co2.year, "moins_polluee");
    const pPoll = pick(data.co2.province, "plus_polluee");
    const pClean = pick(data.co2.province, "moins_polluee");

    return (
        <section className="py-8">
            <div className="mx-auto max-w-6xl px-4">
                {/* En-tête */}
                <div className="mb-6 flex items-center gap-3">
                    <div className="rounded-xl bg-indigo-700 text-white px-3 py-1 text-sm font-semibold">Resultats de recherche</div>
                    <div className="text-sm text-gray-500">Période {data.period.y1} – {data.period.y2}</div>
                </div>
                <p className="mb-2 text-xs font-semibold tracking-wider text-gray-500 uppercase">Résumé par années</p>
                <p className="mb-4 text-sm text-gray-600">
                    Années les plus/moins chaudes, pluvieuses et polluées sur la période.
                </p>
                <div className="h-[1px] w-full bg-gradient-to-r from-indigo-200 via-gray-200 to-transparent mb-4" />

                {/* Ligne 1 : Années */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
                    <Card
                        title="Année la plus chaude"
                        subtitle="Température moyenne la plus élevée"
                        value={yHot?.annee ?? "—"}
                        unit={yHot ? `${Number(yHot.avg_temp).toFixed(1)} °C` : ""}
                        icon={FaThermometerHalf}
                        accent="from-rose-500 to-orange-500"
                    />
                    <Card
                        title="Année la moins chaude"
                        subtitle="Température moyenne la plus basse"
                        value={yCold?.annee ?? "—"}
                        unit={yCold ? `${Number(yCold.avg_temp).toFixed(1)} °C` : ""}
                        icon={FaThermometerHalf}
                        accent="from-blue-500 to-indigo-500"
                    />
                    <Card
                        title="Année la plus pluvieuse"
                        subtitle="Précipitation moyenne"
                        value={yWet?.annee ?? "—"}
                        unit={yWet ? `${Number(yWet.avg_precip).toFixed(1)} mm` : ""}
                        icon={FaCloudRain}
                        accent="from-sky-500 to-emerald-500"
                    />
                    <Card
                        title="Année la moins pluvieuse"
                        subtitle="Précipitation moyenne"
                        value={yDry?.annee ?? "—"}
                        unit={yDry ? `${Number(yDry.avg_precip).toFixed(1)} mm` : ""}
                        icon={FaCloudRain}
                        accent="from-teal-500 to-cyan-500"
                    />

                    <Card
                        title="Année la plus polluée"
                        subtitle="Émissions moyennes"
                        value={yPoll?.annee ?? "—"}
                        unit={yPoll ? `${Number(yPoll.avg_co2 ?? yPoll.avg_co2_mt).toFixed(1)} Mt CO₂e` : ""}
                        icon={FaIndustry}
                        accent="from-slate-700 to-gray-500"
                    />
                    <Card
                        title="Année la moins polluée"
                        subtitle="Émissions moyennes"
                        value={yClean?.annee ?? "—"}
                        unit={yClean ? `${Number(yClean.avg_co2 ?? yClean.avg_co2_mt).toFixed(1)} Mt CO₂e` : ""}
                        icon={FaIndustry}
                        accent="from-gray-500 to-gray-300"
                    />
                </div>

                <p className="mb-2 text-xs font-semibold tracking-wider text-gray-500 uppercase">Résumé par provinces</p>
                <p className="mb-4 text-sm text-gray-600">
                    Provinces les plus/moins chaudes, pluvieuses et polluées sur la période.
                </p>
                <div className="h-[1px] w-full bg-gradient-to-r from-emerald-200 via-gray-200 to-transparent mb-4" />
                {/* Ligne 2 : Provinces */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <Card
                        title="Province la plus chaude"
                        subtitle="Température moyenne"
                        value={pHot?.province_nom ?? "—"}
                        unit={pHot ? `${Number(pHot.avg_temp).toFixed(1)} °C` : ""}
                        icon={FaMapMarkerAlt}
                        accent="from-rose-500 to-orange-500"
                    />
                    <Card
                        title="Province la moins chaude"
                        subtitle="Température moyenne"
                        value={pCold?.province_nom ?? "—"}
                        unit={pCold ? `${Number(pCold.avg_temp).toFixed(1)} °C` : ""}
                        icon={FaMapMarkerAlt}
                        accent="from-blue-500 to-indigo-500"
                    />

                    <Card
                        title="Province la plus pluvieuse"
                        subtitle="Précipitation moyenne"
                        value={pWet?.province_nom ?? "—"}
                        unit={pWet ? `${Number(pWet.avg_precip).toFixed(1)} mm` : ""}
                        icon={FaCloudRain}
                        accent="from-sky-500 to-emerald-500"
                    />

                    <Card
                        title="Province la moins pluvieuse"
                        subtitle="Précipitation moyenne"
                        value={pDry?.province_nom ?? "—"}
                        unit={pDry ? `${Number(pDry.avg_precip).toFixed(1)} mm` : ""}
                        icon={FaCloudRain}
                        accent="from-teal-500 to-cyan-500"
                    />

                    <Card
                        title="Province la plus polluée"
                        subtitle="Émissions moyennes"
                        value={pPoll?.province_nom ?? "—"}
                        unit={pPoll ? `${Number(pPoll.avg_co2 ?? pPoll.avg_co2_mt).toFixed(1)} Mt CO₂e` : ""}
                        icon={FaIndustry}
                        accent="from-slate-700 to-gray-500"
                    />

                    <Card
                        title="Province la moins polluée"
                        subtitle="Émissions moyennes"
                        value={pClean?.province_nom ?? "—"}
                        unit={pClean ? `${Number(pClean.avg_co2 ?? pClean.avg_co2_mt).toFixed(1)} Mt CO₂e` : ""}
                        icon={FaIndustry}
                        accent="from-gray-500 to-gray-300"
                    />
                </div>

                {/* Bas de carte : rappels */}
                <div className="mt-6 text-xs text-gray-500 flex items-center gap-2">
                    <FaCalendarAlt className="w-4 h-4" />
                    <span>Basé sur les moyennes {data.period.y1}–{data.period.y2}. Température en °C, précipitations en mm, émissions en mégatonnes CO₂e.</span>
                </div>
            </div>
        </section>
    );
}
