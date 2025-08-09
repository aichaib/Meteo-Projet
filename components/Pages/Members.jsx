'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import { FaSearch, FaInfoCircle } from 'react-icons/fa';

export default function Members() {
  const [searchTerm, setSearchTerm] = useState('');

  const members = [
    {
      name: 'Aïchath Ibikunle',
      description:
        "Développement backend, API, base de données et hébergement. Création de la page web initiale, optimisation des sections précipitations et températures, et création de la page pollution.",
      image: '/img/aichath.webp',
    },
    {
      name: 'Miguel Proulx',
      description:
        'Recherche des données de précipitations et de température. Création de la page température et gestion des filtres.',
      image: '/img/miguel.webp',
    },
    {
      name: 'Taha Ait Bella',
      description:
        "Mise en forme de la page d’accueil, création de la page précipitations et gestion des filtres associés.",
      image: '/img/taha.webp',
    },
    {
      name: 'Kossi Amen Adzoyi',
      description:
        "Page des membres, en-tête, intégration de graphiques et affichage Power BI.",
      image: '/img/amen.webp',
    },
  ];

  const filtered = useMemo(
    () =>
      members.filter((m) =>
        (m.name + ' ' + m.description)
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      ),
    [searchTerm]
  );

  return (
    <section className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-amber-50 py-12">
      <div className="mx-auto max-w-6xl px-4">
        {/* Hero */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-700 via-blue-600 to-cyan-500 p-8 shadow-xl">
          <div className="relative z-10">
            <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
              À propos & Équipe
            </h1>
            <p className="mt-3 max-w-3xl text-indigo-100">
              Notre site explore l’évolution du climat au Canada entre 2019 et
              2024 : températures moyennes, précipitations et émissions de GES.
              Nous agrégeons des sources ouvertes (Open-Meteo & rapports
              ECCC), stockons les données dans Azure SQL, et offrons des
              visualisations et comparatifs par année et province.
            </p>
          </div>
          <div className="pointer-events-none absolute inset-0 opacity-20">
            <div className="absolute -top-32 -right-24 h-72 w-72 rounded-full bg-white blur-3xl" />
            <div className="absolute -bottom-24 -left-16 h-72 w-72 rounded-full bg-white blur-3xl" />
          </div>
        </div>

        {/* Bloc d’explication court */}
        <div className="mt-6 rounded-2xl border border-slate-200 bg-white/80 backdrop-blur p-5 shadow">
          <div className="flex items-start gap-3">
            <span className="mt-1 rounded-xl bg-slate-900/90 p-2 text-white">
              <FaInfoCircle className="h-4 w-4" />
            </span>
            <p className="text-slate-700">
              Le but de ce site est d’aider à comprendre, comparer et suivre
              les tendances climatiques par province. Vous pouvez filtrer par
              année, consulter les moyennes, et voir d’un coup d’œil les
              périodes/provinces les plus chaudes, pluvieuses ou polluées.
            </p>
          </div>
        </div>

        {/* Barre de recherche */}
        <div className="mt-8 flex items-center gap-3">
          <div className="relative w-full md:w-96">
            <FaSearch className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Rechercher un membre ou un rôle…"
              className="w-full rounded-xl border border-slate-200 bg-white/80 pl-10 pr-3 py-2.5 shadow-sm outline-none ring-0 placeholder:text-slate-400 focus:border-indigo-400"
            />
          </div>
        </div>

        {/* Cartes membres */}
        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {filtered.map((member, i) => (
            <article
              key={i}
              className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="relative h-44 w-full">
                <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  sizes="(max-width:768px) 100vw, (max-width:1200px) 50vw, 25vw"
                  className="object-cover"
                  priority={i < 2}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 transition group-hover:opacity-100" />
              </div>
              <div className="p-4">
                <h2 className="text-lg font-semibold text-slate-900">
                  {member.name}
                </h2>
                <p className="mt-1 text-sm leading-relaxed text-slate-600">
                  {member.description}
                </p>
              </div>
            </article>
          ))}
        </div>

        {/* Petit footer contextuel */}
        <p className="mt-8 text-center text-xs text-slate-400">
          Données: Open-Meteo (temp/precip) & ECCC – National Inventory Report
          (GES). Hébergement Azure. Projet académique.
        </p>
      </div>
    </section>
  );
}
