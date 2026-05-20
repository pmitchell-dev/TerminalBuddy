const path = require('path')

module.exports = {
  entry: './src/index.ts',
  target: 'node',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'index.js',
    libraryTarget: 'commonjs2',
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.scss$/,
        use: ['sass-loader'],
        type: 'asset/source',
      },
      {
        test: /\.html$/,
        type: 'asset/source',
      },
      {
        test: /\.svg$/,
        type: 'asset/source',
      },
    ],
  },
  // Tabby provides these at runtime — do NOT bundle them
  externals: {
    'tabby-core': 'commonjs tabby-core',
    'tabby-settings': 'commonjs tabby-settings',
    '@angular/core': 'commonjs @angular/core',
    '@angular/common': 'commonjs @angular/common',
    '@angular/forms': 'commonjs @angular/forms',
    '@angular/platform-browser': 'commonjs @angular/platform-browser',
    'rxjs': 'commonjs rxjs',
    'rxjs/operators': 'commonjs rxjs/operators',
    'zone.js': 'commonjs zone.js',
    'reflect-metadata': 'commonjs reflect-metadata',
  },
  mode: 'production',
}
