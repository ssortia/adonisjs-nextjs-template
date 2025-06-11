const { configApp } = require('@adonisjs/eslint-config')
const rootConfig = require('../../.eslintrc.js')

// We're using the root config but adding AdonisJS-specific rules
const serverConfig = {
  ...rootConfig,
  overrides: [
    ...(rootConfig.overrides || []),
    {
      files: ['**/*.ts', '**/*.js'],
      rules: {
        // AdonisJS specific overrides
        'class-methods-use-this': 'off',
        'import/no-unresolved': 'off', // For AdonisJS alias imports with #
        'import/extensions': 'off',
        'import/no-extraneous-dependencies': [
          'error',
          {
            devDependencies: [
              '**/*.test.{ts,js}',
              '**/*.spec.{ts,js}',
              '**/test/**/*.{ts,js}',
              '**/tests/**/*.{ts,js}',
              '**/*.config.{ts,js}',
              'ace.js',
            ],
          },
        ],
      },
    },
  ],
}

module.exports = serverConfig
