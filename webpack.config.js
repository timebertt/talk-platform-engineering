const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

const devMode = process.env.NODE_ENV !== 'production';

// Use host-relative requests by default for local serving (e.g., dev server).
let baseURL = null;
if (process.env.NETLIFY) {
  switch (process.env.CONTEXT) {
    case 'production':
      // For production deploys, use the site's main address as the base URL.
      // This always works, no matter if the site is requested on its main address or via a proxied address.
      // If the site is requested via a proxied request, assets will be loaded via the main address.
      baseURL = process.env.URL;
      break;
    case 'branch-deploy':
      baseURL = process.env.DEPLOY_PRIME_URL;
      break;
    default:
      // In deploy previews, use the unique URL for an individual deploy.
      // With this, older deploy previews still work by using the correct base URL.
      baseURL = process.env.DEPLOY_URL;
      break;
  }
}

let canonicalURL = 'https://talks.timebertt.dev/platform-engineering/';
if (process.env.BRANCH && process.env.BRANCH !== 'main') {
  canonicalURL += process.env.BRANCH + '/';
}

module.exports = {
  mode: devMode ? 'development' : 'production',
  entry: './index.js',
  output: {
    path: path.join(__dirname, 'dist'),
    publicPath: '',
    filename: devMode ? '[name].js' : '[name].[contenthash].js',
    assetModuleFilename: '[name].[hash][ext][query]',
    clean: true
  },
  devtool: devMode ? 'inline-source-map' : 'source-map',
  devServer: {
    // Use the host machine's local IP on the network.
    // This is useful for opening the slides on a mobile device while editing.
    // Comment out this line if you're offline or in a VPN.
    host: 'local-ip'
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'index.ejs',
      title: 'Platform Engineering: A Practical Guide to the Cloud-Native Toolkit',
      meta: {
        'viewport': 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no'
      },
      base: {
        href: baseURL,
        target: '_blank'
      },
      // in production mode, hash is included in output filename, no need to append a hash query
      hash: devMode
    }),
    new webpack.DefinePlugin({
      // In development mode, use the browser's location as the QR code URL.
      // This is useful for opening the slides on a mobile device while editing.
      SLIDES_URL: devMode ? 'window.location.href' : JSON.stringify(canonicalURL)
    })
  ].concat(devMode ? [] : [new MiniCssExtractPlugin({
    filename: '[name].[contenthash].css',
    chunkFilename: '[id].[contenthash].css'
  })]),
  resolveLoader: {
    modules: ['node_modules', path.resolve('./webpack/loaders')]
  },
  module: {
    rules: [
      {
        test: /\.(svg|png|jpg|gif)$/,
        use: {
          // using file-loader instead of asset modules because it allows us to get the final URL in our custom loaders
          loader: 'file-loader',
          options: {
            name: '[name].[contenthash].[ext]',
          }
        }
      },
      {
        test: /\.md$/,
        type: 'asset/resource',
        use: [
          'markdown-loader'
        ]
      },
      {
        test: /\.css$/i,
        use: [
          devMode ? 'style-loader' : MiniCssExtractPlugin.loader,
          'css-loader'
        ]
      }
    ]
  },
  optimization: {
    runtimeChunk: 'single',
    moduleIds: 'deterministic',
    minimizer: [
      `...`,
      new CssMinimizerPlugin()
    ],
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all'
        }
      }
    }
  }
};
