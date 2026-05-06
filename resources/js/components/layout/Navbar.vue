<script setup>
import { Menu, Moon, Sun } from 'lucide-vue-next';
import { useTheme } from '../../composables/useTheme';

defineProps({
    appName: {
        type: String,
        required: true,
    },
    userEmail: {
        type: String,
        required: true,
    },
});

defineEmits(['toggle-sidebar', 'logout']);

const { isDark, toggleTheme } = useTheme();
</script>

<template>
    <header
        class="sticky top-0 z-50 flex h-14 shrink-0 items-center justify-between gap-4 border-b border-brand-border/40 bg-white/95 px-4 shadow-sm shadow-brand/5 backdrop-blur-md dark:border-accent-border/25 dark:bg-zinc-900/95 dark:shadow-accent/5"
    >
        <div class="flex items-center gap-3">
            <button
                type="button"
                class="inline-flex rounded-lg p-2 text-accent hover:bg-accent-subtle lg:hidden dark:text-accent-muted dark:hover:bg-accent/15"
                aria-label="Abrir menú"
                @click="$emit('toggle-sidebar')"
            >
                <Menu class="size-6 shrink-0" :stroke-width="2" aria-hidden="true" />
            </button>
            <span
                class="truncate bg-linear-to-r from-accent to-brand bg-clip-text text-sm font-bold tracking-tight text-transparent dark:from-white dark:via-accent-muted dark:to-brand-muted"
            >
                {{ appName }}
            </span>
        </div>

        <div class="flex items-center gap-3">
            <button
                type="button"
                class="inline-flex size-8 items-center justify-center rounded-full text-zinc-500 hover:bg-brand-muted/60 hover:text-brand-foreground dark:text-zinc-400 dark:hover:bg-brand/15 dark:hover:text-brand"
                :aria-label="isDark ? 'Activar modo claro' : 'Activar modo oscuro'"
                @click="toggleTheme"
            >
                <Sun v-if="isDark" class="size-4 shrink-0" :stroke-width="2" aria-hidden="true" />  
                <Moon v-else class="size-4 shrink-0" :stroke-width="2" aria-hidden="true" />
            </button>
            <span class="hidden max-w-[200px] truncate text-xs text-zinc-500 sm:inline dark:text-zinc-400">{{
                userEmail
            }}</span>
            <button
                type="button"
                class="shrink-0 rounded-lg border border-accent-border/70 bg-accent-subtle px-3 py-1.5 text-sm font-semibold text-accent hover:border-accent hover:bg-accent-muted dark:border-accent-border/40 dark:bg-accent/10 dark:text-accent-muted dark:hover:bg-accent/20"
                @click="$emit('logout')"
            >
                Cerrar sesión
            </button>
        </div>
    </header>
</template>
