// webpack.config.js
const path = require('path');

module.exports = {
    entry: "/js/src/index.js",
    output: {
        path:"/js/out/"
    },
    module: {
        rules: [
            {
                test: /\.?js$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: ['@babel/preset-env', '@babel/preset-react']
                    }
                }
            },
            {
                
            }
        ]
    },
    devServer: {
        port: 3000
    }
};
