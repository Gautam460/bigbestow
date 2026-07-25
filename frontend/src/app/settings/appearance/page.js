'use client';

import React from 'react';
import { Head } from '@/lib/inertia-compat';
import AppearanceTabs from '@/components/appearance-tabs';
import Heading from '@/components/heading';
import SettingsLayout from '@/layouts/settings/layout';

export default function AppearancePage() {
    return (
        <SettingsLayout>
            <div className="space-y-6">
                <Head title="Appearance settings | Bigbestow" />
                <h1 className="sr-only">Appearance settings</h1>

                <Heading
                    variant="small"
                    title="Appearance settings"
                    description="Update your account's appearance and theme settings"
                />
                <div className="mt-4">
                    <AppearanceTabs />
                </div>
            </div>
        </SettingsLayout>
    );
}
