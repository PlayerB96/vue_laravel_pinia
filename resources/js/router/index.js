import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../stores/auth';

export function createVueRouter(pinia) {
    const router = createRouter({
        history: createWebHistory(),
        routes: [
            {
                path: '/login',
                name: 'login',
                component: () => import('../pages/LoginPage.vue'),
                meta: { guestOnly: true },
            },
            {
                path: '/dashboard',
                component: () => import('../layouts/AppLayout.vue'),
                meta: { requiresAuth: true },
                children: [
                    {
                        path: '',
                        name: 'dashboard',
                        component: () => import('../pages/DashboardPage.vue'),
                    },
                    {
                        path: 'consulta-precio',
                        name: 'price-lookup',
                        component: () => import('../pages/PriceLookupPage.vue'),
                    },
                ],
            },
        ],
    });

    router.beforeEach((to) => {
        const auth = useAuthStore(pinia);

        if (to.meta.requiresAuth && !auth.authenticated) {
            return { name: 'login', replace: true };
        }
        if (to.meta.guestOnly && auth.authenticated) {
            return { name: 'dashboard', replace: true };
        }

        return true;
    });

    return router;
}
