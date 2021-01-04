module.exports = {
    devServer: {
        // 设置主机地址
        // host:"localhost",
        host:"192.168.56.75",
        // host: '192.168.60.74',
        // 设置默认端口
        port: 8082,
        open: false,//项目启动时是否自动打开浏览器，我这里设置为false,不打开，true表示打开
        proxy: {
            '/api': {//代理api
                // target: "http://192.168.5.233:8089",//测试api地址
                target: "http://123.57.40.94:9100",//开发api地址
                changeOrigin: true,//是否跨域
                ws: true, // proxy websockets
                pathRewrite: {//重写路径
                    "^/api": ''
                }
            }
        }
    }
}
