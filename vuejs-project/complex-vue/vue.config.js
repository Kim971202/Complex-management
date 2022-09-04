const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  chainWebpack: config => {
    config.plugins.delete('prefetch'); //prefetch 삭제
  },
  lintOnSave: false,
  devServer: {
    proxy : 'http://localhost:3000/'
  }
})
