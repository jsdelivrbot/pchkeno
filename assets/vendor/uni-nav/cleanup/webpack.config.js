var ExtractTextPlugin = require("extract-text-webpack-plugin");
module.exports = {
    entry: "./assets/js/uninav.js",
    output: {
        path: __dirname,
        filename: "dist/PCHUniversalNavigation.js"
    },
    resolve: {
        extensions: ['', '.js', '.jsx', '.json']
    },
    module: {
        loaders: [
            { test: /\.css$/, loader: ExtractTextPlugin.extract("style-loader", "css-loader") },
            { test: /\.(png|jpg)$/, loader: 'url-loader' },
            { test: /\.scss$/, loader: ExtractTextPlugin.extract("style-loader", "css-loader!sass-loader") }, 
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                loader: 'babel',
                query: {
                    presets: ['es2015'] 
                }
            }
        ]
    },
    plugins: [new ExtractTextPlugin("dist/PCHUniversalNavigation.css", { allChunks: false })]
};
