const path = require('node:path')
const nodeExternals = require('webpack-node-externals')
const CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = {
    entry: './bin/server.ts',  // 项目入口打包文件
    target: 'node',   // 打包为 Node.js环境
    externals: [nodeExternals()] ,  // 不打包node_modules中的模块
    module:{
        rules:[
            {
                test: /\.ts$/,
                use: 'ts-loader',
                exclude: /node_modules/
            }
        ]
    },
    plugins:[
        new CopyWebpackPlugin({
            patterns:[
                {
                    from: path.resolve(__dirname,'public'),
                }
            ]
        })
    ],
    resolve:{
        alias:{
            "@": path.resolve(__dirname,"."),
            "r": path.resolve(__dirname,"routes"),
            "m": path.resolve(__dirname,"model"),
            "cfg": path.resolve(__dirname,"config"),
            "#": path.resolve(__dirname,"tyeps"),
            "u": path.resolve(__dirname,"utils")
        },
        extensions: ['.ts','.js']
    },
    output:{
        filename: 'app.js',
        path: path.resolve(__dirname, 'dist')
    },
    mode: 'production',
}