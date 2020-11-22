const path = require("path");
const HTMLWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCssAssetsWebpackPlugin = require("optimize-css-assets-webpack-plugin");
const TerserWebpackPlugin = require("terser-webpack-plugin");
const ESLintPlugin = require("eslint-webpack-plugin");

const isDevelopment = process.env.NODE_ENV === "development";
const isProduction = !isDevelopment;

const optimization = () => {
  const config = {
    splitChunks: {
      chunks: "all"
    }
  };

  if (isProduction) {
    config.minimizer = [new OptimizeCssAssetsWebpackPlugin(), new TerserWebpackPlugin()];
  }

  return config;
};

const fileName = (ext) => (isDevelopment ? `[name].${ext}` : `[name].[hash].${ext}`);

module.exports = {
  context: path.resolve(__dirname, "src"),
  mode: "development",
  entry: {
    main: ["@babel/polyfill", "./index.js"],
    about: ["./about.js"]
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: fileName("js")
  },
  resolve: {
    extensions: [".js"],
    alias: {
      "@models": path.resolve(__dirname, "src/models")
    }
  },
  optimization: optimization(),
  devServer: {
    port: 4200
  },
  plugins: [
    new HTMLWebpackPlugin({
      template: "./index.html",
      minify: {
        collapseWhitespace: isProduction
      }
    }),
    new CleanWebpackPlugin(),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, "src/assets/favicon.ico"),
          to: path.resolve(__dirname, "dist")
        }
      ]
    }),
    new MiniCssExtractPlugin({
      filename: fileName("css")
    }),
    new ESLintPlugin()
  ],
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader
          },
          "css-loader"
        ]
      },
      {
        test: /\.s(a|c)ss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader
          },
          "css-loader",
          "sass-loader"
        ]
      },
      {
        test: /\.(jpg|jpeg|svg|gif|png|ico)$/,
        use: ["file-loader"]
      },
      {
        test: /\.(ttf|wof|wof2|eot)$/,
        use: ["file-loader"]
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
            plugins: ["@babel/plugin-proposal-class-properties"]
          }
        }
      }
    ]
  }
};
