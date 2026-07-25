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
            <body className="min-h-screen bg-gray-50 flex flex-col font-sans antialiased">
                <ClientProviders>
                    {children}
                </ClientProviders>
            </body>
        </html>
    );
}
