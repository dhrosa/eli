// webpack.config.js
const path = require('path');

module.exports = {
    entry: {
        index: "/jsx/src/index.js",
        ConversationList: "/jsx/src/ConversationList.js",
    },
    output: {
        path:"/jsx/out/"
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
};
