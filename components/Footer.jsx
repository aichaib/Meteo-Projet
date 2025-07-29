"use client";
import { useEffect, useState } from "react";

export default function Footer() {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const dateStr = now.toLocaleDateString(undefined, {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const timeStr = now.toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  return (
    <footer className="w-full text-center py-2 mt-auto border-t text-sm text-gray-500">
      <div>
        {dateStr} — {timeStr}
      </div>
      <div className="mt-1 italic">
        Informez vous sur les changements climatiques et la météo au Canada
      </div>
    </footer>
  );
}
