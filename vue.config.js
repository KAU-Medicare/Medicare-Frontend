const { defineConfig } = require('@vue/cli-service');

module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    proxy: {
      '/api': {
        target: 'https://kau-medicare.shop', // Spring Boot 서버 주소
        changeOrigin: true,
        pathRewrite: { '^/api': '' } // 필요에 따라 경로 재작성
      }
    }
  }
});