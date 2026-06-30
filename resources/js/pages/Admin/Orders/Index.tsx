import { Head } from '@inertiajs/react';

export default function Index() {
    return (
        <div className="p-6">
            <Head title="Orders" />
            <h2 className="text-2xl font-black text-gray-900 mb-2">Orders</h2>
            <p className="text-gray-500 text-sm mb-8">Manage customer orders and fulfillment.</p>
            <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center text-gray-400 font-bold">
                Order management system is ready to be connected.
            </div>
        </div>
    );
}
