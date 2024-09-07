module.exports = {
    extends: [
        'eslint:recommended',
        'plugin:svelte/recommended'
    ],
    plugins: ['svelte'],
    rules: {
        'svelte/a11y-click-events-have-key-events': 'off',
        'svelte/a11y-anchors': 'off',
        'svelte/a11y-img-redundant-alt': 'off',
        'svelte/a11y-label-has-associated-control': 'off',
        'svelte/a11y-role-has-required-aria-props': 'off',
        'svelte/a11y-role-valid-aria-props': 'off',
        'svelte/a11y-tabindex-no-positive': 'off',
        'svelte/a11y-valid-aria-roles': 'off',
        'svelte/a11y-valid-aria-properties': 'off'
    },
    overrides: [
        {
            files: ['*.svelte'],
            processor: 'svelte/svelte'
        }
    ],
    settings: {
        'svelte3/ignore-styles': () => true
    }
};
