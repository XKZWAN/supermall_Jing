module.exports = {
  configureWebpack: {
    resolve: {
      // extensions: [],  默认已经配置过了  不需要配置
      alias: {
        // router store 不需要配置  因为可以用this.router this.store引用
        'assets': '@/assets',
        'common': '@/common',
        'network': '@/network',
        'components': '@/components',
        'views': '@/views'
      }

    }
  }
}