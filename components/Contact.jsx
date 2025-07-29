"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import emailjs from "@emailjs/browser";

const FIELD_CLASSES = "w-full px-4 py-2 border border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400";
const ERROR_MSG_CLASSES = "mt-1 text-red-600 text-sm";


export default function Contact() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    getValues,
    reset,
  } = useForm({
    defaultValues: { nom: "", email: "", sujet: "", message: "" },
    mode: "onBlur",
  });

  const [feedback, setFeedback] = useState("");

  const sendEmail = async () => {
    setFeedback("");
    try {
      const params = {
        name: getValues().nom,
        email: getValues().email,
        subject: getValues().sujet,
        message: getValues().message,
      };
      await emailjs.send(
        "service_d0tb7i7",
        "template_9un9bma",
        params,
        "ri0Uxh9OEehteqdOw"
      );
      reset();
      setFeedback("Merci ! Votre message a bien été envoyé.");
    } catch {
      setFeedback("Oups, une erreur est survenue. Réessayez plus tard.");
    } finally {
      setTimeout(() => setFeedback(""), 5000);
    }
  };

  // Déclaration DRY des champs
  const fields = [
    {
      name: "nom",
      label: "Nom",
      type: "text",
      registerOptions: {
        required: "champ obligatoire",
        minLength: { value: 2, message: "Au moins 2 caractères" },
      },
    },
    {
      name: "email",
      label: "Email",
      type: "email",
      registerOptions: {
        required: "champ obligatoire",
        pattern: {
          value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
          message: "Email invalide",
        },
      },
    },
    {
      name: "sujet",
      label: "Sujet",
      type: "text",
      registerOptions: { required: "champ obligatoire" },
    },
    {
      name: "message",
      label: "Message",
      as: "textarea",
      rows: 4,
      registerOptions: {
        required: "champ obligatoire",
        minLength: { value: 10, message: "Au moins 10 caractères" },
      },
    },
  ];

  return (
    <div id="contact" className="relative w-full min-h-screen flex items-center justify-center ">
      {/* 1) Image de fond optimisée pour LCP */}
      <form
        onSubmit={handleSubmit(sendEmail)}
        noValidate
        className="w-full max-w-md bg-white/80 backdrop-blur-md rounded-xl shadow-lg p-8 space-y-6"
      >
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 text-center">
          Contactez-nous
        </h2>

        {fields.map(({ name, label, type = "text", as, rows, registerOptions }) => (
          <div key={name}>
            <label htmlFor={name} className="block mb-1 font-medium text-gray-700">
              {label}
            </label>

            {as === "textarea" ? (
              <textarea
                id={name}
                rows={rows}
                {...register(name, registerOptions)}
                className={FIELD_CLASSES}
              />
            ) : (
              <input
                id={name}
                type={type}
                {...register(name, registerOptions)}
                className={FIELD_CLASSES}
              />
            )}

            {errors[name] && (
              <p className={ERROR_MSG_CLASSES}>{errors[name].message}</p>
            )}
          </div>
        ))}

        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-3 rounded-lg text-black font-medium transition ${isSubmitting ? "bg-gray-400" : "bg-white hover:bg-blue-700"
            }`}
        >
          {isSubmitting ? "Envoi…" : "Envoyer"}
        </button>

        {feedback && <p className="mt-4 text-center text-green-700">{feedback}</p>}
      </form>
    </div>
  );
}
