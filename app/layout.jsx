
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
export const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <Header />
      <body>
        {children}
      </body>
      <Footer />
    </html>
  );
}
