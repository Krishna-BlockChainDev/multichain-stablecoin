module.exports = {
	env: {
		browser: false,
		es2021: true,
		mocha: true,
		node: true,
	},
	parser: '@typescript-eslint/parser',
	parserOptions: {
		ecmaVersion: 2021,
		sourceType: 'module',
	},
	plugins: ['@typescript-eslint'],
	extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'plugin:node/recommended', 'prettier'],
	rules: {
		'node/no-unpublished-import': 'off',
		'node/no-missing-import': 'off',
		'node/no-unsupported-features/es-syntax': 'off',
		'node/no-unpublished-require': 'off',
		'@typescript-eslint/no-var-requires': 'off',
		'@typescript-eslint/no-explicit-any': 'off',
		'semi': ['error', 'always'],
		'quotes': ['error', 'single'],
	},
};
