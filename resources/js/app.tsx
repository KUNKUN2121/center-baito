import '../css/app.css';
import './bootstrap';

import { createInertiaApp } from '@inertiajs/react';
import AppBar from './Layouts/AppBar';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';

const appName = import.meta.env.VITE_APP_NAME || 'シフト管理';

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.tsx`,
            import.meta.glob('./Pages/**/*.tsx'),
        ),
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(
            <>
            <AppBar />
            <App {...props} />
            </>
        );
    },
    progress: {
        color: '#4B5563',
    },
});
