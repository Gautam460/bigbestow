import { Link, usePage } from '@inertiajs/react';
import { 
    LayoutDashboard, 
    ShoppingCart, 
    Tags, 
    Users, 
    Gift, 
    PackageSearch, 
    Image as ImageIcon,
    Layers,
    Boxes,
    User,
    ShoppingBag,
    Heart,
    MapPin,
    Settings
} from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';

export function AppSidebar() {
    const { auth } = usePage().props;
    const user = auth.user;
    
    // Check if user is admin (assuming spatie roles are in auth.roles or check a flag)
    // For now, let's assume 'admin@admin.com' or checking a simple logic
    const isAdmin = user && (user.email === 'admin@admin.com' || (user.roles && user.roles.some(r => r === 'Super Admin' || r === 'Admin')));

    const adminNavItems = [
        { title: 'Dashboard', href: '/admin', icon: LayoutDashboard },
        { title: 'Categories', href: '/admin/categories', icon: Tags },
        { title: 'Subcategories', href: '/admin/subcategories', icon: Layers },
        { title: 'Products', href: '/admin/products', icon: PackageSearch },
        { title: 'Inventory', href: '/admin/inventory', icon: Boxes },
        { title: 'Orders', href: '/admin/orders', icon: ShoppingCart },
        { title: 'Coupons', href: '/admin/coupons', icon: Gift },
        { title: 'Users', href: '/admin/users', icon: Users },
        { title: 'Banners', href: '/admin/banners', icon: ImageIcon },
    ];

    const customerNavItems = [
        { title: 'My Dashboard', href: '/dashboard', icon: LayoutDashboard },
        { title: 'My Orders', href: '/orders', icon: ShoppingBag },
        { title: 'Wishlist', href: '/wishlist', icon: Heart },
        { title: 'My Addresses', href: '/addresses', icon: MapPin },
        { title: 'Profile Settings', href: '/settings/profile', icon: User },
    ];

    const mainNavItems = isAdmin ? adminNavItems : customerNavItems;
    const footerNavItems = [];

    return (
        <Sidebar collapsible="none" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={isAdmin ? '/admin' : '/dashboard'} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
