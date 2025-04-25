// vue.config.js
module.exports = {
  chainWebpack: (config) => {
    config.module.rules.delete('svg');

    config.module
      .rule('svg')
      .test(/\.svg$/)
      .use('vue-svg-loader')
      .loader('vue-svg-loader')
      .options({
        svgo: {
          plugins: [
            { removeStyleElement: false }, // Не удалять встроенные стили
            { cleanupAttrs: true },
            { removeDoctype: true },
            { removeComments: true },
          ],
        },
      });
  },
};