// vue.config.js

module.exports = {
    // options...
    chainWebpack: config => {
        config.module
            .rule('aframe-assets')
            .test(/\.(obj|mtl)$/)
            .use('file-loader')
            .loader('file-loader')
    }
}