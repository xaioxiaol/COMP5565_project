import { Web3Provider } from '@/context/Web3Context';
import Layout from '@/components/Layout';
import ErrorBoundary from '@/components/ErrorBoundary';
import type { AppProps } from 'next/app';
import '@/styles/globals.css';

export default function App({ Component, pageProps }: AppProps) {
    return (
        <ErrorBoundary>
            <Web3Provider>
                <Layout>
                    <Component {...pageProps} />
                </Layout>
            </Web3Provider>
        </ErrorBoundary>
    );
} 