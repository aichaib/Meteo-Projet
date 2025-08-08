'use client';

import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useState } from 'react';

export default function Members() {

    const [searchTerm, setSearchTerm] = useState("");

    const members = [
        {

            name: "Aïchath Olouwakemi Awèni Ibikunle",
            description: "developpement backend, API, base de données et hébergement",
            image: "/img/aichath.webp"
        },
        {
            name: "Miguel Proulx",
            description: "ajout des données et filtres de température",
            image: "/img/miguel.webp"
        },
        {
            name: "Taha Ait Bella ",
            description: "enrichi la partie précipitations et optimisé la page d’accueil",
            image: "/img/taha.webp"
        },
        {
            name: "Kossi Amen Adzoyi",
            description: "page des membres de l'équipe, header, creation des graphes et ajout des codes pour l'affichage (power BI)",
            image: "/img/amen.webp"
        },

    ];

    return (
        <div className="max-w-4xl mx-auto">

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {members.filter(member => member.name.toLowerCase().includes(searchTerm.toLowerCase())).map((member, index) => (
                    <div key={index} className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300">
                        <Image src={member.image} alt={member.name} width={400} height={400} className="w-full h-48 object-cover" />
                        <div className="p-4">
                            <h2 className="text-xl text-black font-semibold">{member.name}</h2>
                            <p className="text-black">{member.description}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}