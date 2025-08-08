import Members from "@/components/Pages/Members";

export const metadata = {
    title: "Membres du groupe",
    description: "Page présentant les membres du groupe de projet",
};  

export default function Page() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
            <main className="container mx-auto px-4 py-8">
                <h1 className="text-4xl font-bold text-center mb-8 bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                    Membres du groupe
                </h1>
                <Members />
            </main>
        </div>
    );
}

    