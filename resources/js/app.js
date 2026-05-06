import './bootstrap';
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import { createVueRouter } from './router';
import { useAuthStore } from './stores/auth';

const el = document.getElementById('app');

if (el) {
    const pinia = createPinia();
    const router = createVueRouter(pinia);

    const app = createApp(App);

    app.use(pinia);
    app.use(router);

    useAuthStore(pinia).initFromDom(el);

    app.provide(
        'appName',
        el.dataset.appName ?? 'App',
    );
    app.provide(
        'showDemoCredentials',
        el.dataset.showDemoCredentials === '1',
    );

    app.mount(el);
}
