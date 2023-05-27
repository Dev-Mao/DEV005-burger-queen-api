module.exports = {
    "env": {
        "browser": true,
        "commonjs": true,
        "es2021": true,
        "node": true
    },
    "extends": [
        "eslint:recommended",
        "plugin:jest/recommended"
      ],
      "plugins": [
        "jest"
      ],
    "overrides": [
    ],
    "parserOptions": {
        "ecmaVersion": "latest"
    },
    "rules": {
        "no-underscore-dangle": "off",
        "consistent-return": "off",
        "no-shadow": "off",
        "no-console": ["error", {
          "allow": ["info", "warn", "error"]
        }]
    }
}
