<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class RolesAndPermissionsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Reset cached roles and permissions
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // Create permissions
        \Spatie\Permission\Models\Permission::firstOrCreate(['name' => 'manage products']);
        \Spatie\Permission\Models\Permission::firstOrCreate(['name' => 'manage categories']);
        \Spatie\Permission\Models\Permission::firstOrCreate(['name' => 'manage orders']);
        \Spatie\Permission\Models\Permission::firstOrCreate(['name' => 'manage users']);

        // Create roles and assign created permissions
        $role1 = \Spatie\Permission\Models\Role::firstOrCreate(['name' => 'Super Admin']);
        $role1->givePermissionTo(\Spatie\Permission\Models\Permission::all());

        $role2 = \Spatie\Permission\Models\Role::firstOrCreate(['name' => 'Admin']);
        $role2->givePermissionTo(['manage products', 'manage categories', 'manage orders']);

        $role3 = \Spatie\Permission\Models\Role::firstOrCreate(['name' => 'User']);

        // 1. Create Super Admin
        $superAdmin = \App\Models\User::firstOrCreate(
            ['email' => 'superadmin@bigbestow.com'],
            [
                'name' => 'Super Admin',
                'password' => \Illuminate\Support\Facades\Hash::make('password'),
            ]
        );
        $superAdmin->assignRole($role1);

        // 2. Create Admin
        $admin = \App\Models\User::firstOrCreate(
            ['email' => 'admin@bigbestow.com'],
            [
                'name' => 'Store Admin',
                'password' => \Illuminate\Support\Facades\Hash::make('password'),
            ]
        );
        $admin->assignRole($role2);

        // 3. Create Regular User
        $user = \App\Models\User::firstOrCreate(
            ['email' => 'user@bigbestow.com'],
            [
                'name' => 'Regular User',
                'password' => \Illuminate\Support\Facades\Hash::make('password'),
            ]
        );
        $user->assignRole($role3);
    }
}
