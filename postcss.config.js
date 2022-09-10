module.exports = {
    port: 8080,
    server: {
        baseDir: "./dist",
        host: "localhost"
    },
    plugins: {
        autoprefixer: {}
    },
    devServer: {
        host: "localhost",
        hot: true,
        disableHostCheck: true
    },
    configureWebpack: {
        devServer: {
            host: "localhost",
            hot: true,
            disableHostCheck: true
        }
    }
};