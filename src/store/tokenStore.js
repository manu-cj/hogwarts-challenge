import { writable } from 'svelte/store';

export const tokenStore = writable({
    accessToken: localStorage.getItem('accessToken') || '',
    refreshToken: localStorage.getItem('refreshToken') || ''
});

export const updateAccessToken = (newAccessToken, refreshToken) => {
    tokenStore.update(tokens => {
        const updatedTokens = {
            ...tokens,
            accessToken: newAccessToken,
            refreshToken: refreshToken
        };
        localStorage.setItem('tokens', JSON.stringify(updatedTokens)); // Mise à jour de l'objet complet dans localStorage
        return updatedTokens;
    });
};


