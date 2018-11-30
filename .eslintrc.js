module.exports = {
  extends: [
    'eslint:recommended',
    "plugin:vue/strongly-recommended"
  ],
  rules: {
    'vue/no-unused-vars': 'error',
    'no-console': 'off',
  },
  env: {
    'node': true,
    'commonjs': true
  }
}