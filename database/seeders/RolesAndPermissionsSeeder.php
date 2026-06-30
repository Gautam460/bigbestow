<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class RolesAndPermissionsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Reset cached roles and permissions
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // 1. Create Permissions (यहाँ आप अपनी ज़रूरत के अनुसार और भी permissions जोड़ सकते हैं)
        $permissions = [
            'manage products',
            'manage categories',
            'manage orders',
            'manage users',
            'manage settings',
        ];

        foreach ($permissions as $perm) {
            Permission::firstOrCreate(['name' => $perm]);
        }

        // 2. Create Three Roles: superadmin, admin, user
        $superAdminRole = Role::firstOrCreate(['name' => 'superadmin']);
        $adminRole = Role::firstOrCreate(['name' => 'admin']);
        $userRole = Role::firstOrCreate(['name' => 'user']);

        // Superadmin को सभी permissions दे रहे हैं
        $superAdminRole->givePermissionTo(Permission::all());

        // Admin को केवल प्रोडक्ट्स, केटेगरी और ऑर्डर्स की permission दी है
        $adminRole->givePermissionTo(['manage products', 'manage categories', 'manage orders']);

        // User (ग्राहक) को कोई एडमिन permission नहीं दी गई है

        // ---------------------------------------------------------
        // 3. Default Login Credentials (यहाँ से आप Username/Email और Password देख या बदल सकते हैं)
        // ---------------------------------------------------------

        // 1️⃣ SUPER ADMIN LOGIN
        // Email: superadmin@bigbestow.com | Password: password123
        $superAdmin = User::firstOrCreate(
            ['email' => 'superadmin@bigbestow.com'],
            [
                'name' => 'Super Admin',
                'password' => Hash::make('password123'),
            ]
        );
        $superAdmin->assignRole($superAdminRole);

        // 2️⃣ ADMIN LOGIN
        // Email: admin@bigbestow.com | Password: password123
        $admin = User::firstOrCreate(
            ['email' => 'admin@bigbestow.com'],
            [
                'name' => 'Store Admin',
                'password' => Hash::make('password123'),
            ]
        );
        $admin->assignRole($adminRole);

        // 3️⃣ NORMAL USER LOGIN
        // Email: user@bigbestow.com | Password: password123
        $user = User::firstOrCreate(
            ['email' => 'user@bigbestow.com'],
            [
                'name' => 'Normal User',
                'password' => Hash::make('password123'),
            ]
        );
        $user->assignRole($userRole);
    }
}
