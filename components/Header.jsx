import Image from 'next/image';
import Link from 'next/link';
export default function Header() {
    return (
        <header className="flex items-center justify-between bg-white  cursor-pointer shadow p-4 mb-6">
            <div className="flex items-center">
                <Link href="/" className="flex items-center">
                    <Image
                        src="/img/logo.webp"
                        alt="ClimateWatch Logo"
                        width={40}
                        height={40}
                        className="mr-3"
                    />
                </Link>

                <Link href="/" className="text-2xl font-bold cursor-pointer">
                    <h1>ClimateWatch</h1>
                </Link>

            </div>
        </header>
    );
}