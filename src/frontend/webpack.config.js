import CopyPlugin from "copy-webpack-plugin";

export default {
  entry: {
    index: "/jsx/src/index.tsx",
  },
  output: {
    path: "/jsx/out/",
  },
  context: "/jsx/src/",
  resolve: {
    extensions: ["", ".js", ".jsx", ".ts", ".tsx", ".css"],
  },
  module: {
    rules: [
      {
        test: /\.?tsx$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [
              "@babel/preset-env",
              ["@babel/preset-react", { runtime: "automatic" }],
            ],
          },
        },
      },
      {
        test: /\.s?css$$/i,
        use: ["style-loader", "css-loader", "sass-loader"],
      },
      {
        test: /\.(ts|tsx)$/,
        loader: "ts-loader",
      },
    ],
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        {
          from: "/jsx/interfaces/256 x 256/",
          to: "/jsx/out/assets/avatars/256x256/",
        },
      ],
    }),
  ],
};
