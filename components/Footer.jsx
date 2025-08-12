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
    <footer className="w-full mt-auto">
      <div className="bg-gradient-to-r from-green-500 via-teal-500 to-blue-600 text-white shadow-md backdrop-blur-md px-2 py-3">
        <div className="max-w-7xl mx-auto flex flex-col items-center space-y-1">
          <div className="text-sm sm:text-base font-medium">

           <span suppressHydrationWarning>
              {now ? `${dateStr} — ${timeStr}` : ""}
            </span>

          </div>
          <div className="text-xs sm:text-sm italic opacity-90">
            Informez‑vous sur les changements climatiques et la météo au&nbsp;Canada
          </div>
          {/* Barre décorative inspirée du header */}
          <div className="h-[2px] w-2/3 bg-white/40 rounded-full overflow-hidden">
            <div className="w-1/2 h-full bg-white"></div>
          </div>
        </div>
      </div>
    </footer>
  );
}
