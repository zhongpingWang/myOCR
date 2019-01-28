const path = require('path')
const webpack = require('webpack')
const ParallelUglifyPlugin = require('webpack-parallel-uglify-plugin');


module.exports = {

    entry: {
        libs: ['vue', 'vue-router','vuex','element-ui']
    },

    output: {
        path: path.join(__dirname, './distLibs'),
        filename: '[name].dll.js',
        library: '_dll_[name]'
    },

    plugins: [

        new webpack.DllPlugin({
            path: path.join(__dirname, 'distLibs', '[name].manifest.json'),
            name: '_dll_[name]'
        }),

        new ParallelUglifyPlugin({

            uglifyJS: {
                output: {
                    //／最紧凑的输出
                    beautify: false,
                    //／删除所有的注释
                    comments: false,
                },
                compress: {
                    //在 UglifyJS 删除没有用到的代码时不输出警告
                    warnings: false,
                    //／删除所有、 console 、语句，可以兼容 IE 浏览器
                    drop_console: true,
                    //／内嵌己定义但是只用到了一次的变量
                    collapse_vars: true,
                    //／提取出出现多次但是没有定义成变量去引用的静态值
                    reduce_vars: true
                }
            }
        })

    ]
}