const path = require("path");
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: {
    index: "./src/index.js",
    style: "./src/style.css"
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, "dist"),
    clean: true,
  },
  devServer: {
    static: './dist',
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: "asset/resource",
      },
    ],
  },
  mode: "development",
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html'
    })
  ],
};
