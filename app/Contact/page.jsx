import Contact from "@/components/Contact";
export const metadata = {
    title: "Contact",
    description: "Page de contact pour envoyer un message",
};
export default function Page() {
    return (
        <div className="min-h-screen bg-primary-dark text-white">
        <Contact />
        </div>
    );
    }