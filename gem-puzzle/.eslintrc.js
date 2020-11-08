module.exports = {
    "root": true,
    "parser": "@typescript-eslint/parser",
    "plugins": [
      "@typescript-eslint"
    ],
    "env": {
        "browser": true,
        "es6": true
    },
        "extends": [
            "airbnb-base",
            'plugin:@typescript-eslint/recommended',  
            'prettier/@typescript-eslint',  
            'plugin:prettier/recommended',
        ],
    "globals": {
        "Atomics": "readonly",
        "SharedArrayBuffer": "readonly"
    },
    "parserOptions": {
        "ecmaVersion": 2018,
        "sourceType": "module"
    },
    "settings": {
        "import/resolver": {
          "node": {
            "extensions": [".js", ".jsx", ".ts", ".tsx"]
          }
        }
      },
    "rules": {
        
    }
};
