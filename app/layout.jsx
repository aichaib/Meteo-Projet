
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Météo Canada - Données climatiques",
  description: "Explorez les données météorologiques du Canada",
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body>
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
