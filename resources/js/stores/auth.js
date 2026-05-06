import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', {
    state: () => ({
        authenticated: false,
        userEmail: '',
    }),
    actions: {
        initFromDom(el) {
            this.authenticated = el.dataset.authenticated === '1';
            this.userEmail = el.dataset.userEmail ?? '';
        },
        setAfterLogin(email) {
            this.authenticated = true;
            this.userEmail = email;
        },
        clear() {
            this.authenticated = false;
            this.userEmail = '';
        },
    },
});
