// webpack.config.js
const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

module.exports = {
  entry: './src/init-umd.js', // your entry point that mounts/initializes the search bar
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'react-ai-search-bar.bundle.js',
    library: {
      name: 'ReactAISearchBar',
      type: 'umd',
      export: 'default'
    },
    globalObject: 'this'
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: 'babel-loader'
      },
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, 'css-loader']
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'react-ai-search-bar.css'
    })
  ],
  resolve: {
    extensions: ['.js', '.jsx']
  },
  mode: 'production'
}
