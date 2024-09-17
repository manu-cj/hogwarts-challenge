import { writable } from 'svelte/store';

function createConnectionStore() {
  const { subscribe, set } = writable(false);

  function update() {
    const isLogin = JSON.parse(localStorage.getItem('isLogin'));
    if (isLogin) {
      const tokens = JSON.parse(localStorage.getItem('tokens'));
      set(!!tokens);
    } else {
      set(false);
    }
  }

  update();

  window.addEventListener('storage', update);

  return {
    subscribe,
    update
  };
}

export const isConnected = createConnectionStore();