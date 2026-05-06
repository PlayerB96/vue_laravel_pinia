<script setup>
import { Home, ScanBarcode, ShoppingCart } from 'lucide-vue-next';
import { RouterLink } from 'vue-router';

defineProps({
    open: {
        type: Boolean,
        default: false,
    },
});

defineEmits(['close']);
</script>

<template>
    <div>
        <div
            v-show="open"
            class="fixed inset-0 z-40 bg-black/40 lg:hidden"
            aria-hidden="true"
            @click="$emit('close')"
        />

        <aside
            class="fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-brand-border/35 bg-white dark:border-accent-border/20 dark:bg-zinc-900 lg:translate-x-0"
            :class="open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'"
            aria-label="Navegación principal"
        >
            <div
                class="flex h-14 items-center border-b border-brand-border/30 bg-linear-to-r from-brand-muted/50 via-accent-subtle/60 to-brand-muted/40 px-4 dark:border-accent-border/25 dark:from-accent/10 dark:via-zinc-900 dark:to-brand/10 lg:hidden"
            >
                <span class="text-xs font-semibold uppercase tracking-wide text-brand-foreground/90 dark:text-zinc-200">Menú</span>
            </div>

            <div class="hidden h-24 shrink-0 flex-col justify-end bg-linear-to-br from-accent via-accent-hover to-brand px-4 pb-4 pt-6 lg:flex">
                <p class="text-[10px] font-semibold uppercase tracking-widest text-white/80">Retail</p>
                <p class="text-sm font-bold leading-tight text-white">Moda y accesorios</p>
            </div>

            <nav class="flex flex-1 flex-col gap-1 overflow-y-auto p-3">
                <RouterLink
                    :to="{ name: 'dashboard' }"
                    class="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-zinc-700 hover:bg-accent-subtle dark:text-zinc-200 dark:hover:bg-accent/10"
                    active-class=""
                    exact-active-class="border border-accent-border/50 bg-accent-subtle font-semibold text-accent dark:border-accent-border/35 dark:bg-accent/15 dark:text-accent-muted"
                    @click="$emit('close')"
                >
                    <Home class="size-5 shrink-0 text-accent dark:text-accent-muted" :stroke-width="2" aria-hidden="true" />
                    Inicio
                </RouterLink>

                <RouterLink
                    :to="{ name: 'price-lookup' }"
                    class="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-zinc-700 hover:bg-brand-muted/70 dark:text-zinc-200 dark:hover:bg-brand/10"
                    active-class=""
                    exact-active-class="border border-brand-border bg-brand-muted/80 font-semibold text-brand-foreground dark:border-brand-border/40 dark:bg-brand/15 dark:text-brand"
                    @click="$emit('close')"
                >
                    <ScanBarcode class="size-5 shrink-0 text-brand dark:text-brand" :stroke-width="2" aria-hidden="true" />
                    Consulta precio
                </RouterLink>

                <span
                    class="flex cursor-not-allowed items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-zinc-400 dark:text-zinc-600"
                    title="Próximamente"
                >
                    <ShoppingCart class="size-5 shrink-0 opacity-50" :stroke-width="2" aria-hidden="true" />
                    Caja
                </span>
            </nav>
        </aside>
    </div>
</template>
