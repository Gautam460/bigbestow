import { Head } from '@inertiajs/react';

export default function Index() {
    return (
        <div className="p-6">
            <Head title="Users" />
            <h2 className="text-2xl font-black text-gray-900 mb-2">Users</h2>
            <p className="text-gray-500 text-sm mb-8">Manage registered customers and staff.</p>
            <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center text-gray-400 font-bold">
                User management system is ready.
            </div>
        </div>
    );
}
