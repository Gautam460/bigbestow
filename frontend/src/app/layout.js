import '../css/app.css';
import '../css/custom.css';
import ClientProviders from './ClientProviders';

export const metadata = {
    title: 'Bigbestow | Premium Cricket Equipment Store',
    description: 'Find top-quality bats, gear, apparel, and accessories for cricket lovers and professionals worldwide.',
};

export default function RootLayout({ children }) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className="min-h-screen bg-[#F5F7FA] text-gray-900 flex flex-col font-sans antialiased selection:bg-indigo-500/30 selection:text-indigo-900">
                <ClientProviders>
                    {children}
                </ClientProviders>
            </body>
        </html>
    );
}
