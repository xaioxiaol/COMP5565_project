import { ReactNode } from 'react';
import Navbar from './Navbar';
import { Toaster } from 'react-hot-toast';

interface LayoutProps {
    children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <main className="py-8">
                {children}
            </main>
            <Toaster position="top-right" />
        </div>
    );
} 