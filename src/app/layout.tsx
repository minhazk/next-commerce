import Footer from '@/components/Footer';
import './globals.css';
import { Inter } from 'next/font/google';
import NavBar from '@/components/NavBar';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
    title: 'Create Next App',
    description: 'Generated by create next app',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang='en'>
            <body className={`${inter.className} flex min-h-screen flex-col`}>
                <div className='container mx-auto flex-grow px-5 sm:px-6 lg:px-12'>
                    <NavBar />
                    {children}
                </div>
                <Footer />
            </body>
        </html>
    );
}
