// webpack.config.js
const path = require('path')

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
        use: ['style-loader', 'css-loader'] // if you use CSS
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx']
  },
  mode: 'production'
}
