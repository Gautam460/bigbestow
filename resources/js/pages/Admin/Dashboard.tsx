import { Head } from '@inertiajs/react';
import { 
    ShoppingCart, 
    Users, 
    TrendingUp,
    DollarSign,
    Package
} from 'lucide-react';

export default function AdminDashboard() {
    return (
        <div className="p-4 sm:p-6 lg:p-8">
            <Head title="Admin Dashboard" />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {[
                    { label: 'Revenue', value: '$42,560', change: '+12.5%', icon: DollarSign, color: 'emerald' },
                    { label: 'Orders', value: '1,284', change: '+8.2%', icon: ShoppingCart, color: 'blue' },
                    { label: 'Conversion', value: '3.45%', change: '-0.4%', icon: TrendingUp, color: 'purple' },
                    { label: 'Avg Order', value: '$84.20', change: '+2.1%', icon: Package, color: 'amber' },
                ].map((stat, i) => (
                    <div key={i} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm transition-all hover:shadow-md">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-2 bg-gray-50 rounded-lg text-gray-600">
                                <stat.icon className="w-5 h-5" />
                            </div>
                            <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                                stat.change.startsWith('+') ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                            }`}>
                                {stat.change}
                            </span>
                        </div>
                        <div className="text-gray-500 text-xs font-medium uppercase tracking-wider mb-1">{stat.label}</div>
                        <div className="text-2xl font-black text-gray-900">{stat.value}</div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Sales Chart Placeholder */}
                <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-lg font-black text-gray-900">Sales Analytics</h3>
                            <p className="text-xs text-gray-400 font-medium">Monthly performance overview</p>
                        </div>
                    </div>
                    
                    <div className="h-64 flex items-end gap-2 relative">
                        <div className="absolute inset-x-0 top-0 h-full flex flex-col justify-between pointer-events-none opacity-10">
                            {[1, 2, 3, 4, 5].map(i => <div key={i} className="border-t border-gray-900 w-full"></div>)}
                        </div>
                        {[40, 70, 45, 90, 65, 85, 55, 100, 75, 95, 60, 80].map((h, i) => (
                            <div key={i} className="flex-1 bg-indigo-100 hover:bg-indigo-600 transition-all rounded-t-md relative group cursor-pointer" style={{ height: `${h}%` }}>
                                <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                                    ${h * 120}
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-between mt-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">
                        <span>Jan</span>
                        <span>Apr</span>
                        <span>Jul</span>
                        <span>Oct</span>
                        <span>Dec</span>
                    </div>
                </div>

                {/* Top Products */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                    <h3 className="text-lg font-black text-gray-900 mb-6 tracking-tight">Top Products</h3>
                    <div className="space-y-4">
                        {[
                            { name: 'SS Master English Willow', sales: 142, price: '$299' },
                            { name: 'MRF Genius Grand', sales: 98, price: '$349' },
                            { name: 'SG Scorer Kashmir', sales: 76, price: '$85' },
                            { name: 'DSC Intense Willow', sales: 54, price: '$279' },
                        ].map((prod, i) => (
                            <div key={i} className="flex items-center justify-between group cursor-pointer border-b border-gray-50 pb-4 last:border-0 last:pb-0">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center text-xl">🏏</div>
                                    <div>
                                        <div className="font-bold text-gray-900 text-sm">{prod.name}</div>
                                        <div className="text-[10px] text-gray-400 font-bold uppercase">{prod.sales} sales</div>
                                    </div>
                                </div>
                                <div className="text-sm font-black text-gray-900">{prod.price}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
