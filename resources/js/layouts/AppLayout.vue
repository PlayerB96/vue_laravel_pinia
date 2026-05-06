<script setup>
import { storeToRefs } from 'pinia';
import { inject, ref } from 'vue';
import { RouterView, useRouter } from 'vue-router';
import axios from 'axios';
import Navbar from '../components/layout/Navbar.vue';
import Sidenav from '../components/layout/Sidenav.vue';
import { updateCsrfToken } from '../lib/csrf';
import { useAuthStore } from '../stores/auth';

const appName = inject('appName', 'App');
const router = useRouter();
const authStore = useAuthStore();
const { userEmail } = storeToRefs(authStore);

const sidebarOpen = ref(false);

async function logout() {
    try {
        const { data } = await axios.post('/logout');
        if (data.csrf_token) {
            updateCsrfToken(data.csrf_token);
        }
    } catch {
        //
    }
    authStore.clear();
    await router.replace({ name: 'login' });
}
</script>

<template>
    <div class="min-h-screen bg-transparent">
        <Sidenav :open="sidebarOpen" @close="sidebarOpen = false" />

        <div class="flex min-h-screen flex-col lg:pl-64">
            <Navbar :app-name="appName" :user-email="userEmail" @toggle-sidebar="sidebarOpen = !sidebarOpen" @logout="logout" />

            <main class="flex flex-1 flex-col gap-6 p-6">
                <RouterView />
            </main>
        </div>
    </div>
</template>
