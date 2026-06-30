import { Head } from '@inertiajs/react';

export default function Index() {
    return (
        <div className="p-6">
            <Head title="Inventory" />
            <h2 className="text-2xl font-black text-gray-900 mb-2">Inventory Management</h2>
            <p className="text-gray-500 text-sm mb-8">Monitor stock levels and warehouse data.</p>
            <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center text-gray-400 font-bold">
                Inventory tracking is ready.
            </div>
        </div>
    );
}
