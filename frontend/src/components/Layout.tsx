import { ReactNode } from 'react';
import Navbar from './Navbar';
import { Toaster } from 'react-hot-toast';

interface LayoutProps {
    children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
    return (
        <div className="min-h-screen">
            <Navbar />
            <main className="">
                {children}
            </main>
            <Toaster position="top-right" />
        </div>
    );
} 