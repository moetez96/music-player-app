const purgecss = require('@fullhuman/postcss-purgecss')({
    content: ['./src/**/*.js', './src/**/*.jsx'],
  
    defaultExtractor: (content) => content.match(/[\w-/:]+(?<!:)/g) || [],
  });
  
  const cssnano = require('cssnano')({
    preset: 'default',
  });
  
  module.exports = {
    plugins: [
      require('autoprefixer'),
      ...(process.env.NODE_ENV === 'production' ? [purgecss, cssnano] : []),
    ],
  };