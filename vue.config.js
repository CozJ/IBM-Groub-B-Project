// vue.config.js

module.exports = {
  // options...
  chainWebpack: config => {
    config.module
      .rule("aframe-assets")
      .test(/\.(obj|mtl|gltf)$/)
      .use("file-loader")
      .loader("file-loader");

    config.module
      .rule("aframe-physics-assets")
      .test("/.js$/")
      .include.add(function() {
        return ["src", require.resolve("aframe-physics-system")];
      })
      .end()
      .use("babel-loader")
      .loader("babel-loader");
  }
};
