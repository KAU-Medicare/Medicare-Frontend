const { defineConfig } = require('@vue/cli-service');

module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    proxy: {
      '/api': {
        target: 'https://kau-medicare.shop',
        changeOrigin: true,
      },
    },
  },
  pwa: {
    name: 'KAU-MediCare',
    themeColor: '#4DBA87',
    msTileColor: '#000000',
    appleMobileWebAppCapable: 'yes',
    appleMobileWebAppStatusBarStyle: 'black',
    
    // 아이콘 설정
    iconPaths: {
      favicon32: 'img/icons/favicon-32x32.png',
      favicon16: 'img/icons/favicon-16x16.png',
      appleTouchIcon: 'img/icons/apple-touch-icon-152x152.png',
      maskIcon: 'img/icons/safari-pinned-tab.svg',
      msTileImage: 'img/icons/msapplication-icon-144x144.png'
    },
    
    // 서비스 워커 설정
    workboxOptions: {
      skipWaiting: true, // 새 버전 배포 시 즉시 활성화
      clientsClaim: true, // 활성화 후 PWA가 페이지 제어
    }
  }
});
