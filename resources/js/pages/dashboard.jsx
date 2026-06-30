import { Head, Link } from '@inertiajs/react';
import { ShoppingBag, Heart, MapPin, Package, Clock, CheckCircle } from 'lucide-react';

export default function Dashboard() {
    return (
        <div className="p-4 sm:p-6 lg:p-8 bg-gray-50/30 min-h-screen">
            <Head title="My Dashboard" />

            {/* Header Section */}
            <div className="mb-8">
                <h1 className="text-2xl font-black text-gray-900 tracking-tight">My Account</h1>
                <p className="text-gray-500 text-sm">Welcome back to BigBestow. Track your gear and orders.</p>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-4">
                    <div className="p-3 bg-indigo-50 rounded-xl text-indigo-600">
                        <ShoppingBag className="w-6 h-6" />
                    </div>
                    <div>
                        <div className="text-2xl font-black text-gray-900">04</div>
                        <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">Total Orders</div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-4">
                    <div className="p-3 bg-rose-50 rounded-xl text-rose-600">
                        <Heart className="w-6 h-6" />
                    </div>
                    <div>
                        <div className="text-2xl font-black text-gray-900">12</div>
                        <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">Wishlist Items</div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-4">
                    <div className="p-3 bg-amber-50 rounded-xl text-amber-600">
                        <MapPin className="w-6 h-6" />
                    </div>
                    <div>
                        <div className="text-2xl font-black text-gray-900">02</div>
                        <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">Saved Addresses</div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Recent Orders */}
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-black text-gray-900 tracking-tight">Recent Orders</h3>
                        <Link href="/orders" className="text-xs font-bold text-indigo-600 hover:underline">View All</Link>
                    </div>
                    
                    <div className="space-y-4">
                        {[
                            { id: '#BB-4921', date: 'Oct 12, 2023', status: 'Delivered', price: '$299.00', color: 'emerald' },
                            { id: '#BB-4810', date: 'Sep 28, 2023', status: 'In Transit', price: '$85.00', color: 'amber' },
                        ].map((order, i) => (
                            <div key={i} className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:border-gray-200 transition-all cursor-pointer group">
                                <div className="flex items-center gap-4">
                                    <div className="p-2 bg-gray-50 rounded-lg text-gray-400">
                                        <Package className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <div className="font-bold text-gray-900 text-sm group-hover:text-indigo-600 transition-colors">{order.id}</div>
                                        <div className="text-[10px] text-gray-400 font-bold uppercase">{order.date}</div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="font-black text-gray-900 text-sm">{order.price}</div>
                                    <div className={`text-[10px] font-bold text-${order.color}-600 bg-${order.color}-50 px-2 py-0.5 rounded-lg uppercase inline-block`}>
                                        {order.status}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Account Summary */}
                <div className="space-y-6">
                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                        <h3 className="text-lg font-black text-gray-900 tracking-tight mb-6">Account Tracking</h3>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 bg-indigo-50/50 rounded-xl border border-indigo-100">
                                <div className="flex items-center gap-3">
                                    <Clock className="w-5 h-5 text-indigo-600" />
                                    <span className="text-sm font-bold text-gray-700">Last Login</span>
                                </div>
                                <span className="text-xs font-bold text-indigo-600">Today, 2:45 PM</span>
                            </div>
                            <div className="flex items-center justify-between p-4 bg-emerald-50/50 rounded-xl border border-emerald-100">
                                <div className="flex items-center gap-3">
                                    <CheckCircle className="w-5 h-5 text-emerald-600" />
                                    <span className="text-sm font-bold text-gray-700">Profile Status</span>
                                </div>
                                <span className="text-xs font-bold text-emerald-600">100% Complete</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl p-6 text-white shadow-lg shadow-indigo-200">
                        <h4 className="text-xl font-black mb-2 italic">BigBestow Prime</h4>
                        <p className="text-indigo-100 text-xs mb-4 leading-relaxed">Enjoy free express shipping and exclusive early access to new cricket willow drops.</p>
                        <button className="w-full py-3 bg-white text-indigo-600 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-gray-50 transition-all">
                            Upgrade Now
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

Dashboard.layout = (page) => page;

