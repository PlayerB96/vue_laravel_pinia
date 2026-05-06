<script setup>
import { inject, ref } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import { Moon, Sun } from 'lucide-vue-next';
import { updateCsrfToken } from '../lib/csrf';
import { useAuthStore } from '../stores/auth';
import { useTheme } from '../composables/useTheme';

const router = useRouter();
const appName = inject('appName', 'App');
const showDemoCredentials = inject('showDemoCredentials', false);

const email = ref('');
const password = ref('');
const remember = ref(false);
const errorEmail = ref('');
const submitting = ref(false);
const { isDark, toggleTheme } = useTheme();
const authStore = useAuthStore();

async function submit() {
    errorEmail.value = '';
    submitting.value = true;

    try {
        const { data } = await axios.post('/login', {
            email: email.value,
            password: password.value,
            remember: remember.value,
        });

        if (data.csrf_token) {
            updateCsrfToken(data.csrf_token);
        }

        authStore.setAfterLogin(data.user.email);
        await router.replace({ name: 'dashboard' });
    } catch (e) {
        if (e.response?.status === 422) {
            const errs = e.response.data.errors ?? {};
            errorEmail.value = errs.email?.[0] ?? e.response.data.message ?? 'Datos no válidos.';
        } else if (e.response?.status === 419) {
            errorEmail.value = 'Sesión expirada. Recarga la página.';
        } else {
            errorEmail.value = 'No se pudo iniciar sesión.';
        }
    } finally {
        submitting.value = false;
    }
}

function fillDemo() {
    email.value = 'demo@ejemplo.com';
    password.value = 'password';
}
</script>

<template>
    <div class="relative flex min-h-screen flex-col items-center justify-center gap-8 overflow-hidden p-6">
        <div
            class="pointer-events-none absolute -left-32 top-0 size-112 rounded-full bg-brand/20 blur-3xl dark:bg-brand/10"
            aria-hidden="true"
        />
        <div
            class="pointer-events-none absolute -right-24 bottom-0 size-104 rounded-full bg-accent/18 blur-3xl dark:bg-accent/12"
            aria-hidden="true"
        />
        <button
            type="button"
            class="absolute right-4 top-4 z-10 inline-flex size-8 items-center justify-center rounded-full border border-brand-border/40 bg-white/80 text-accent shadow-sm backdrop-blur-sm hover:bg-accent-subtle dark:border-accent-border/30 dark:bg-zinc-900/80 dark:text-accent-muted dark:hover:bg-accent/15"
            :aria-label="isDark ? 'Activar modo claro' : 'Activar modo oscuro'"
            @click="toggleTheme"
        >
            <Sun v-if="isDark" class="size-4 shrink-0" :stroke-width="2" aria-hidden="true" />
            <Moon v-else class="size-4 shrink-0" :stroke-width="2" aria-hidden="true" />
        </button>
        <div class="w-full max-w-sm">
            <div class="relative rounded-2xl border border-brand-border/40 bg-linear-to-br from-white via-white to-accent-subtle/40 p-px shadow-lg shadow-brand/10 dark:border-accent-border/25 dark:from-zinc-900 dark:via-zinc-900 dark:to-accent/10 dark:shadow-accent/5">
                <div class="rounded-2xl bg-white/95 px-5 pb-6 pt-8 backdrop-blur-sm dark:bg-zinc-900/95">
                    <div class="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-linear-to-br from-accent to-brand shadow-md shadow-accent/25">
                        <span class="text-lg font-black text-white">{{ appName.charAt(0).toUpperCase() }}</span>
                    </div>
                    <h1 class="text-center text-xl font-bold tracking-tight text-zinc-900 dark:text-white">{{ appName }}</h1>
                    <p class="mt-1 text-center text-sm text-zinc-600 dark:text-zinc-400">Moda, accesorios y caja rápida</p>

                    <form class="mt-8 flex flex-col gap-5" @submit.prevent="submit">
                <div class="flex flex-col gap-2">
                    <label for="email" class="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Correo</label>
                    <input
                        id="email"
                        v-model="email"
                        type="email"
                        required
                        autocomplete="username"
                        class="rounded-xl border border-accent-border/50 bg-accent-subtle/30 px-3 py-2.5 text-sm text-zinc-900 outline-none ring-accent/30 placeholder:text-zinc-400 focus:border-accent focus:bg-white focus:ring-2 dark:border-accent-border/25 dark:bg-zinc-950 dark:text-zinc-50 dark:placeholder:text-zinc-500 dark:focus:border-accent-muted dark:focus:ring-accent/40"
                        placeholder="nombre@ejemplo.com"
                    />
                    <p v-if="errorEmail" class="text-sm text-red-600 dark:text-red-400">{{ errorEmail }}</p>
                </div>

                <div class="flex flex-col gap-2">
                    <label for="password" class="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Contraseña</label>
                    <input
                        id="password"
                        v-model="password"
                        type="password"
                        required
                        autocomplete="current-password"
                        class="rounded-xl border border-brand-border/60 bg-brand-subtle/40 px-3 py-2.5 text-sm text-zinc-900 outline-none ring-brand/25 placeholder:text-zinc-400 focus:border-brand focus:bg-white focus:ring-2 dark:border-brand-border/30 dark:bg-zinc-950 dark:text-zinc-50 dark:focus:border-brand dark:focus:ring-brand/30"
                    />
                </div>

                <label class="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                    <input v-model="remember" type="checkbox" class="size-4 rounded border-accent-border text-accent focus:ring-accent dark:border-accent-border/50 dark:bg-zinc-950 dark:focus:ring-accent/50" />
                    Recordarme
                </label>

                <button
                    type="submit"
                    :disabled="submitting"
                    class="inline-flex h-11 items-center justify-center rounded-xl bg-linear-to-r from-accent to-accent-hover px-4 text-sm font-semibold text-white shadow-md shadow-accent/25 hover:brightness-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:opacity-60 dark:shadow-accent/15"
                >
                    {{ submitting ? 'Entrando…' : 'Entrar' }}
                </button>
                    </form>
                </div>
            </div>

            <div v-if="showDemoCredentials" class="mt-6 rounded-xl border border-dashed border-brand-border/70 bg-brand-muted/40 p-4 dark:border-accent-border/35 dark:bg-accent/10">
                <p class="mb-3 text-xs font-semibold uppercase tracking-wide text-accent dark:text-accent-muted">
                    Acceso de prueba (solo entorno local)
                </p>
                <div class="flex flex-col gap-3">
                    <button
                        type="button"
                        class="text-left text-xs font-medium text-brand-foreground underline decoration-brand/40 underline-offset-2 dark:text-brand"
                        @click="fillDemo"
                    >
                        Rellenar demo (demo@ejemplo.com / password)
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>
