import HomeClient from '@/components/HomeClient';

export const metadata = {
    title: 'Premium Cricket Bats & Equipment - Bigbestow',
    description: 'The finest cricket equipment for professionals and amateurs.',
};

export default async function Page() {
    let initialProps = {};
    try {
        const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
        const res = await fetch(`${backendUrl}/api/home`, { 
            next: { revalidate: 60 } 
        });
        
        if (res.ok) {
            initialProps = await res.json();
        }
    } catch (e) {
        console.error('Failed to fetch initial home data:', e);
    }

    return <HomeClient initialProps={initialProps} />;
}
