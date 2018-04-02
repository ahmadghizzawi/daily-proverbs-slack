module.exports = {
    "extends": "airbnb-base",
    "env": {
      "node": true,
      "es6": true
    },
    "parserOptions": {
      "sourceType": "module",
      "ecmaVersion": 2017
    },
    "rules": {
      // Additional, per-project rules...
      "no-underscore-dangle": [2, { "allow": ['_date'] }],
      "no-console": ["warn", { allow: ["warn", "error"] }]
    }
};