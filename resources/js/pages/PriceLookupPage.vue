<script setup>
import { Barcode, Camera, Search, X } from 'lucide-vue-next';
import { nextTick, onMounted, ref } from 'vue';
import { useBarcodeScanner } from '../composables/useBarcodeScanner';
import { findProductByCode } from '../data/mockProducts';

const SCANNER_ELEMENT_ID = 'price-barcode-scanner';

const codeInput = ref('');
const inputEl = ref(null);
const product = ref(null);
const notFound = ref(false);
const lastQuery = ref('');

function focusInput() {
    nextTick(() => {
        inputEl.value?.focus();
        inputEl.value?.select?.();
    });
}

const { scanning, startingCamera, cameraError, openScanner, closeScanner } = useBarcodeScanner({
    elementId: SCANNER_ELEMENT_ID,
    async onDecode(code) {
        codeInput.value = code;
        lookup();
    },
    onClosed: () => focusInput(),
});

function lookup() {
    const q = codeInput.value.trim();
    lastQuery.value = q;
    notFound.value = false;
    product.value = null;

    if (!q) {
        focusInput();

        return;
    }

    const found = findProductByCode(q);
    if (found) {
        product.value = found;
    } else {
        notFound.value = true;
    }

    focusInput();
}

function clearAll() {
    codeInput.value = '';
    product.value = null;
    notFound.value = false;
    lastQuery.value = '';
    focusInput();
}

function onSubmit() {
    lookup();
}

onMounted(() => {
    focusInput();
});
</script>

<template>
    <div class="mx-auto flex w-full max-w-lg flex-col gap-4 pb-4">
        <header class="flex flex-col gap-2 rounded-2xl border border-brand-border/40 bg-linear-to-r from-white via-accent-subtle/50 to-brand-muted/50 p-4 shadow-sm dark:border-accent-border/25 dark:from-zinc-900 dark:via-accent/10 dark:to-brand/10">
            <h1 class="text-xl font-bold tracking-tight text-zinc-900 dark:text-white">Consulta precio</h1>
            <p class="text-sm leading-snug text-zinc-600 dark:text-zinc-300">
                Escanea con pistola (termina en <span class="font-semibold text-accent dark:text-accent-muted">Enter</span>),
                usa la <span class="font-semibold text-brand-foreground dark:text-brand">cámara</span> o escribe el SKU.
            </p>
        </header>

        <button
            type="button"
            class="flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl border border-accent-border/60 bg-white px-4 text-sm font-semibold text-accent shadow-sm hover:bg-accent-subtle dark:border-accent-border/40 dark:bg-zinc-900 dark:text-accent-muted dark:hover:bg-accent/15"
            @click="openScanner"
        >
            <Camera class="size-5 shrink-0" :stroke-width="2" aria-hidden="true" />
            Escanear con cámara
        </button>

        <p v-if="cameraError && !scanning" class="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-200">
            {{ cameraError }}
        </p>

        <form class="flex flex-col gap-3" @submit.prevent="onSubmit">
            <label for="price-code" class="sr-only">Código de producto o prenda</label>
            <div
                class="flex gap-2 rounded-2xl border-2 border-brand-border/60 bg-white p-2 shadow-md shadow-brand/5 dark:border-accent-border/35 dark:bg-zinc-900 dark:shadow-none"
            >
                <div class="flex min-w-0 flex-1 items-center gap-2 px-2">
                    <Barcode class="size-6 shrink-0 text-brand dark:text-brand" :stroke-width="2" aria-hidden="true" />
                    <input
                        id="price-code"
                        ref="inputEl"
                        v-model="codeInput"
                        type="text"
                        inputmode="text"
                        autocomplete="off"
                        autocorrect="off"
                        spellcheck="false"
                        enterkeyhint="search"
                        placeholder="Código o SKU…"
                        class="min-h-12 w-full min-w-0 border-0 bg-transparent text-lg font-semibold tracking-wide text-zinc-900 outline-none placeholder:text-zinc-400 dark:text-zinc-50 dark:placeholder:text-zinc-500"
                    />
                </div>
                <button
                    type="submit"
                    class="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-linear-to-br from-accent to-accent-hover px-4 py-3 text-sm font-semibold text-white shadow-md shadow-accent/20 hover:brightness-105 dark:shadow-accent/15"
                >
                    <Search class="size-5 sm:hidden" :stroke-width="2" aria-hidden="true" />
                    <span class="hidden sm:inline">Consultar</span>
                </button>
            </div>
            <div class="flex flex-wrap items-center gap-2 text-xs text-zinc-600 dark:text-zinc-400">
                <span class="inline-flex items-center gap-1 rounded-full border border-brand-border/50 bg-brand-muted/50 px-2.5 py-1 dark:border-brand-border/25 dark:bg-brand/10">
                    Prueba:
                    <code class="font-mono font-medium text-brand-foreground dark:text-brand">REM-NEG-XL</code>
                </span>
                <span class="inline-flex items-center gap-1 rounded-full border border-accent-border/50 bg-accent-subtle px-2.5 py-1 dark:border-accent-border/30 dark:bg-accent/10">
                    EAN:
                    <code class="font-mono font-medium text-accent dark:text-accent-muted">7501055901369</code>
                </span>
            </div>
        </form>

        <article
            v-if="product"
            class="rounded-2xl border border-accent-border/60 bg-linear-to-b from-accent-subtle/90 via-white to-brand-muted/40 p-5 shadow-md shadow-accent/10 dark:border-accent-border/30 dark:from-accent/15 dark:via-zinc-900 dark:to-brand/15 dark:shadow-brand/5"
            aria-live="polite"
        >
            <p class="text-xs font-bold uppercase tracking-wide text-accent dark:text-accent-muted">
                {{ product.category }}
            </p>
            <h2 class="mt-2 text-2xl font-bold leading-tight text-zinc-900 dark:text-white">
                {{ product.name }}
            </h2>
            <dl class="mt-4 grid gap-3 text-sm">
                <div class="flex items-baseline justify-between gap-3 border-t border-accent-border/40 pt-3 dark:border-accent-border/25">
                    <dt class="font-medium text-zinc-600 dark:text-zinc-400">Precio</dt>
                    <dd class="text-right text-4xl font-black tabular-nums tracking-tight text-brand dark:text-brand">
                        ${{ product.price.toLocaleString('es-CL') }}
                    </dd>
                </div>
                <div class="flex justify-between gap-3 border-t border-brand-border/40 pt-3 dark:border-brand-border/25">
                    <dt class="text-zinc-600 dark:text-zinc-400">Talla</dt>
                    <dd class="font-semibold text-zinc-900 dark:text-zinc-100">{{ product.size }}</dd>
                </div>
                <div class="flex justify-between gap-3 border-t border-brand-border/40 pt-3 dark:border-brand-border/25">
                    <dt class="text-zinc-600 dark:text-zinc-400">Color</dt>
                    <dd class="text-right font-semibold text-zinc-900 dark:text-zinc-100">{{ product.color }}</dd>
                </div>
                <div class="flex justify-between gap-3 border-t border-accent-border/35 pt-3 dark:border-accent-border/20">
                    <dt class="text-zinc-600 dark:text-zinc-400">SKU</dt>
                    <dd class="font-mono text-sm font-semibold text-accent dark:text-accent-muted">{{ product.sku }}</dd>
                </div>
                <div class="flex justify-between gap-3 border-t border-accent-border/35 pt-3 dark:border-accent-border/20">
                    <dt class="text-zinc-600 dark:text-zinc-400">Código barras</dt>
                    <dd class="font-mono text-sm font-semibold text-zinc-800 dark:text-zinc-200">{{ product.barcode }}</dd>
                </div>
            </dl>
            <button
                type="button"
                class="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-brand-border bg-white py-3 text-sm font-semibold text-brand-foreground hover:bg-brand-muted dark:border-brand-border/40 dark:bg-zinc-950 dark:text-brand dark:hover:bg-brand/20"
                @click="clearAll"
            >
                <X class="size-4" :stroke-width="2" aria-hidden="true" />
                Limpiar y siguiente
            </button>
        </article>

        <div
            v-if="notFound"
            class="rounded-2xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-900/60 dark:bg-amber-950/40"
            role="alert"
        >
            <p class="text-base font-semibold text-amber-950 dark:text-amber-100">Producto no encontrado</p>
            <p class="mt-1 text-sm text-amber-900/90 dark:text-amber-200/90">
                Código ingresado:
                <span class="font-mono font-medium">{{ lastQuery || '—' }}</span>
            </p>
            <p class="mt-2 text-sm text-amber-900/80 dark:text-amber-200/80">Revisa el SKU o vuelve a escanear el código.</p>
        </div>

        <Teleport to="body">
            <div
                v-if="scanning"
                class="fixed inset-0 z-100 flex flex-col bg-black/95"
                role="dialog"
                aria-modal="true"
                aria-labelledby="scanner-title"
            >
                <div class="flex shrink-0 items-center justify-between gap-3 border-b border-white/10 bg-linear-to-r from-accent/90 via-accent-hover to-brand px-4 py-3 text-white">
                    <p id="scanner-title" class="text-sm font-bold">Apunta al código de barras</p>
                    <button
                        type="button"
                        class="inline-flex items-center gap-2 rounded-xl bg-white/15 px-3 py-2 text-sm font-semibold text-white hover:bg-white/25"
                        @click="closeScanner"
                    >
                        <X class="size-4" :stroke-width="2" aria-hidden="true" />
                        Cerrar
                    </button>
                </div>

                <div class="relative min-h-0 flex-1 px-3 pb-6">
                    <div :id="SCANNER_ELEMENT_ID" class="mx-auto h-full min-h-[min(55vh,360px)] w-full max-w-lg overflow-hidden rounded-2xl bg-black" />

                    <p v-if="startingCamera" class="pointer-events-none absolute inset-x-0 top-1/3 text-center text-sm text-white/80">
                        Iniciando cámara…
                    </p>
                </div>

                <p class="shrink-0 px-4 pb-6 text-center text-xs text-white/70">
                    Buena luz y mantén el código dentro del recuadro. Si no aparece el permiso, revisa la configuración del sitio en el navegador.
                </p>
            </div>
        </Teleport>
    </div>
</template>
