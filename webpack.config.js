const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const HtmlWebpackTagsPlugin = require('html-webpack-tags-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = (env) => {
    if (!env) env = {};
    const PRODUCTION = env.production === undefined ? false : env.production;

    return {
        devtool: 'source-map',
        mode: PRODUCTION ? 'production' : 'development',
        entry: {
            index: './src/index.tsx',
        },
        output: {
            path: path.join(__dirname, 'dist'),
            filename: '[name].js'
        },
        resolve: {
            extensions: ['.ts', '.tsx', '.js']
        },
        module: {
            rules: [
                // Правило для .ts .tsx
                {
                    test: /\.tsx?$/,
                    loader: 'ts-loader',
                    exclude: /node_modules/,
                },
                // Правило подгрузки sass, scss, css
                {
                    test: /\.(sa|sc|c)ss$/,
                    use: [
                        {
                            loader: MiniCssExtractPlugin.loader,
                            options: {
                                publicPath: './style'
                            }
                        },
                        'css-loader',
                        'sass-loader'
                    ]
                },
                // Правило подставки $WEBPACK: переменных
                {
                    test: /(\.(sa|sc|c)ss|\.[tj]sx?)$/,
                    exclude: /node_modules/,
                    loader: 'string-replace-loader',
                    options: {
                        // multiple: REPLACEMENTS
                    }
                }
            ]
        },
        plugins: [
            new MiniCssExtractPlugin({
                filename: "style/style-[id].css",
                chunkFilename: "style/style-[id].css"
            }),
            new CopyWebpackPlugin({
                patterns: [
                    {
                        from: "./src/ui/assets/",
                        to: "./assets"
                    },
                    {
                        from: "./node_modules/bootstrap/dist/css/bootstrap.min.css",
                        to: "./css/"
                    },
                    {
                        from: "./node_modules/@fortawesome/fontawesome-free/webfonts",
                        to: "./webfonts"
                    },
                    {
                        from: "./node_modules/@fortawesome/fontawesome-free/css/all.min.css",
                        to: "./css/font-awesome.min.css"
                    },
                ]
            }),
            new HtmlWebpackPlugin({
                template: "./src/index.html",
                filename: "index.html",
                chunks: ["index"]
            }),
            new HtmlWebpackTagsPlugin({
                tags: ['css/bootstrap.min.css', 'css/font-awesome.min.css', 'css/reactjs-popup.css'],
                files: ['index.html'],
                append: true,
            })
        ],
    };
};