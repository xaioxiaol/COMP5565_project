/// <reference types="react" />
/// <reference types="react-dom" />

interface Window {
  ethereum?: {
    isMetaMask?: boolean;
    request: (...args: any[]) => Promise<any>;
    on: (event: string, callback: (...args: any[]) => void) => void;
    removeListener: (event: string, callback: (...args: any[]) => void) => void;
  };
}

declare module '*.json' {
  const value: any;
  export default value;
}

declare module 'react-hot-toast' {
  import { ReactNode } from 'react';

  export interface ToastOptions {
    duration?: number;
    position?: string;
  }

  interface Toast {
    (message: string | ReactNode, options?: ToastOptions): string;
    success(message: string | ReactNode, options?: ToastOptions): string;
    error(message: string | ReactNode, options?: ToastOptions): string;
  }

  export const Toaster: React.FC<{ position?: string }>;
  const toast: Toast;
  export default toast;
} 