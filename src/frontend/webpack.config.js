module.exports = {
    entry: {
        index: "/jsx/src/index.jsx",
    },
    output: {
        path:"/jsx/out/"
    },
    context: "/jsx/src/",
    resolve: {
        extensions: ['', '.js', '.jsx'],
    },
    module: {
        rules: [
            {
                test: /\.?jsx$/,
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
