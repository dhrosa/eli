module.exports = {
    entry: {
        index: "/jsx/src/index.js",
    },
    output: {
        path:"/jsx/out/"
    },
    context: "/jsx/src/",
    module: {
        rules: [
            {
                test: /\.?js$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: ['@babel/preset-env', ['@babel/preset-react', {"runtime": "automatic"}]]
                    }
                }
            },
            {
                test: /\.s[ac]ss$/i,
                use: [
                    "style-loader",
                    "css-loader",
                    "sass-loader",                    
                ],
            },
        ]
    },
};
