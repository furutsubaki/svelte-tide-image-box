module.exports = {
    root: true,
    parser: '@typescript-eslint/parser',
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
    ],
    plugins: [
        'svelte3',
        '@typescript-eslint',
    ],
    ignorePatterns: ['*.cjs, *.d.ts'],
    overrides: [{
        files: ['**/*.svelte'], processor: 'svelte3/svelte3',
        rules: {
            'svelte/indent': ['error', 4, { indentScript: false, SwitchCase: 1 }],
            indent: ['error', 4, { SwitchCase: 1 }],
        },
    }],
    settings: {
        'svelte3/typescript': () => require('typescript'),
    },
    parserOptions: {
        sourceType: 'module',
        ecmaVersion: 2020,
    },
    env: {
        browser: true,
        es2017: true,
        node: true,
    },
    rules: {
        indent: ['error', 4, { SwitchCase: 1 }],
        '@typescript-eslint/indent': ['error', 4],
        'linebreak-style': ['error', 'unix'],
        quotes: ['error', 'single'],
        semi: ['error', 'always'],
        'comma-dangle': ['error', 'always-multiline'],
        'no-unused-vars': 'off',
        '@typescript-eslint/no-unused-vars': 'off',
    },
};
