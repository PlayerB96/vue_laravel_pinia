import { computed, ref } from 'vue';

const STORAGE_KEY = 'app-theme';
const theme = ref('light');
const initialized = ref(false);

function getSystemTheme() {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
        return 'light';
    }

    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function applyTheme(nextTheme) {
    if (typeof document === 'undefined') {
        return;
    }

    document.documentElement.classList.toggle('dark', nextTheme === 'dark');
}

function initTheme() {
    if (initialized.value || typeof window === 'undefined') {
        return;
    }

    const stored = window.localStorage.getItem(STORAGE_KEY);
    theme.value = stored === 'dark' || stored === 'light' ? stored : getSystemTheme();
    applyTheme(theme.value);
    initialized.value = true;
}

function setTheme(nextTheme) {
    const normalized = nextTheme === 'dark' ? 'dark' : 'light';
    theme.value = normalized;
    applyTheme(normalized);

    if (typeof window !== 'undefined') {
        window.localStorage.setItem(STORAGE_KEY, normalized);
    }
}

function toggleTheme() {
    setTheme(theme.value === 'dark' ? 'light' : 'dark');
}

export function useTheme() {
    initTheme();

    return {
        theme,
        isDark: computed(() => theme.value === 'dark'),
        setTheme,
        toggleTheme,
    };
}

export { initTheme };
