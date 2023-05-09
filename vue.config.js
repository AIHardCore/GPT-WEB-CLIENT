/*
 * @Description:: 请补充填写
 * @Version: 1.0
 * @Author: smallWhite
 * @Date: 2023-03-20 20:49:33
 * @LastEditors: smallWhite
 * @LastEditTime: 2023-03-28 09:48:39
 * @FilePath: /chat_gpt/vue.config.js
 */
const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
    productionSourceMap: false,
    transpileDependencies: true,
    devServer: {
        port: 3000
    },
    publicPath: './',
    chainWebpack: config => {
        const CompressionWebpackPlugin = require('compression-webpack-plugin')
        if (process.env.NODE_ENV === 'production') {
            config.plugin('CompressionPlugin').use(
                new CompressionWebpackPlugin({
                    test: /\.(js|css)$/,
                    threshold: 10240, // 超过10kb的文件就压缩
                    deleteOriginalAssets:false, // 不删除源文件
                    minRatio: 0.8
                })
            )
        }
    }
})