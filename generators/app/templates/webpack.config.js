const path = require('path');
<% if (hasDashboard || hasGraphic) { -%>
const HtmlWebpackPlugin = require('html-webpack-plugin');
<% } -%>
<% if (hasExtension) { -%>
const nodeExternals = require('webpack-node-externals');
<% } -%>

<% if (hasExtension) { -%>
const extensionConfig = {
    target: "node",
    entry: './src/extension/index.js',
    output: {
        filename: 'index.js',
        path: path.join(__dirname, 'extension'),
        libraryTarget: 'commonjs2'
    },
    mode: 'production',
    devtool: 'source-map',
    externals: [nodeExternals()],
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            [
                                '@babel/preset-env',
                                {modules: 'commonjs'}
                            ]
                        ],
                        plugins: ['add-module-exports']
                    }
                }
            }
        ]
    },
    performance: {
        hints: false
    }
};
<% } -%>

<% if (hasDashboard) { -%>
// Add more dashboard panel names here as needed
const dashboardNames = [
    'panel'
];

let dashboardEntries = {}, dashboardPlugins = [];
dashboardNames.forEach(name => {
    dashboardEntries[name] = [`./src/dashboard/${name}.js`];
    dashboardPlugins.push(new HtmlWebpackPlugin({
        filename: `${name}.html`,
        template: `./src/dashboard/${name}.html`,
        chunks: [name]
    }));
});

const dashboardConfig = {
    entry: dashboardEntries,
    output: {
        filename: '[name].js',
        path: path.join(__dirname, 'dashboard')
    },
    plugins: dashboardPlugins,
    devtool: 'source-map',
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader'
                ]
            }
        ]
    },
    mode: 'production'
};
<% } -%>

<% if (hasGraphic) { -%>
// Add more graphics names here as needed
const graphicNames = [
    'index'
];

let graphicEntries = {}, graphicPlugins = [];
graphicNames.forEach(name => {
    graphicEntries[name] = [`./src/graphics/${name}.js`];
    graphicPlugins.push(new HtmlWebpackPlugin({
        filename: `${name}.html`,
        template: `./src/graphics/${name}.html`,
        chunks: [name]
    }));
});

const graphicsConfig = {
    entry: graphicEntries,
    output: {
        filename: '[name].js',
        path: path.join(__dirname, 'graphics')
    },
    plugins: graphicPlugins,
    devtool: 'source-map',
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader'
                ]
            }
        ]
    },
    mode: 'production'
};
<% } -%>

module.exports = [
<% if (hasExtension) { -%>
    extensionConfig,
<% } -%>
<% if (hasDashboard) { -%>
    dashboardConfig,
<% } -%>
<% if (hasGraphic) { -%>
    graphicsConfig,
<% } -%>
];