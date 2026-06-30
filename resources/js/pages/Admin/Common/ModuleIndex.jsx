import { Head } from '@inertiajs/react';
import { Plus } from 'lucide-react';

export default function ModuleIndex({ title, description, items = [], columns = [] }) {
    return (
        <div className="p-6">
            <Head title={title} />
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                    <h2 className="text-2xl font-black text-gray-900">{title}</h2>
                    <p className="text-gray-500 text-sm">{description}</p>
                </div>
                <button className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-all">
                    <Plus className="w-5 h-5 mr-2" /> Add New
                </button>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/50">
                                {columns.map((col, i) => (
                                    <th key={i} className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">{col.label}</th>
                                ))}
                                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {items.length > 0 ? items.map((item, i) => (
                                <tr key={i} className="hover:bg-gray-50/50 transition-colors group">
                                    {columns.map((col, j) => (
                                        <td key={j} className="px-6 py-4 text-sm font-medium text-gray-700">{item[col.key]}</td>
                                    ))}
                                    <td className="px-6 py-4 text-center text-gray-400">...</td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={columns.length + 1} className="px-6 py-12 text-center text-gray-400 font-medium">
                                        No records found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
