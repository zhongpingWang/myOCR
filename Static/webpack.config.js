
const path = require("path");
const rm = require('rimraf');
const chalk = require("chalk");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
//多进程压缩代码
const ParallelUglifyPlugin = require('webpack-parallel-uglify-plugin');
//多进程
var HappyPack = require("happyPack");
//线程池  共享
const happyThreadPool = HappyPack.ThreadPool({ size: 5 });

const DefinePlugin = require("webpack/lib/DefinePlugin");
const DllReferencePlugin = require("webpack/lib/DllReferencePlugin");


const webpack = require("webpack");
//const CommonsChunkPlugin = require("webpack/lib/optimize/CommonsChunkPlugin");


//导出支持三种 对象 函数（/promise） 数组
module.exports = function (env = {}, argv) {
    //env 传入的参数 argv 配置参数
    

    // process.env.NODE_ENV ==='production' js 代码中使用 编译会直接替换


    var devtool = "source-map",

        watch = true,

        watchOptions = {
            //不监听的文件或文件夹 可以正则
            ignored: /node modules/,
            //发现变化 等待时间后 执行编译 提升性能 
            aggregateTimeout: 300,
            //轮询文件变化时间
            poll: 1000
        },

        entry = {
            app: './index.js'
        },

        output = {
            //__dirname是node.js中一个全部变量，它指向当前执行脚本所在的目录
            path: path.resolve(__dirname, './dist'),
            publicPath: './dist',
            filename: 'js/[name].js'
        },

        //插件
        plugins = [],

        //编译配置
        module = {},

        resolve = {
            //后缀
            extensions: ['.js', '.vue', ".less", ".es6"],
            //别名
            alias: {
                'getters': path.resolve(__dirname, './src/vuex/getters'),
                'actions': path.resolve(__dirname, './src/vuex/actions')
            }
        },

        //配置如何展示性能提示 创建超过250kb的资源 / bytes
        performance = {
            hints: false
            //maxEntrypointSize: 25000000
        },

        //告诉 Webpack 如何去寻找 Loader
        resolveLoader = {
            modules: ["node_modules"], //, "myModules"
            //入口文件的后缀
            extensions: [".js", ".json"]
        }

    //module
    module = {
        rules: [
            {
                test: /\.vue$/,
                loader: 'vue-loader',
                options: {
                    loaders: {
                        // Since sass-loader (weirdly) has SCSS as its default parse mode, we map
                        // the "scss" and "sass" values for the lang attribute to the right configs here.
                        // other preprocessors should work out of the box, no loader config like this necessary.
                        'less': ExtractTextPlugin.extract({ fallback: 'vue-style-loader', use: ['css-loader', 'less-loader'] }),
                        'css': ExtractTextPlugin.extract({ fallback: 'vue-style-loader', use: 'css-loader' })
                    }
                },
                
            },
            {
                test:  [/\.less$/, /\.css$/],
                //多进程处理
                use: ExtractTextPlugin.extract({
                    use: ['happypack/loader/?id=css']
                }),
                //use: ExtractTextPlugin.extract({ fallback: 'style-loader', use: ['css-loader', 'less-loader'] }),
               // include: path.resolve(__dirname, "src"),
                //exclude: path.resolve(__dirname, "node_modules")
            },
            
            {
                test: /\.js$/,
                use: ["happypack/loader/?id=babel"],
                //loader: 'babel-loader',
                exclude: /node_modules/
            },
            {
                test: /\.es6$/,
                use: ["happypack/loader/?id=babel"],
                //loader: 'babel-loader',
                exclude: /node_modules/
            },
            {
                test: /\.(png|jpg|gif|svg)$/,
                loader: 'url-loader',
                options: {
                    name: 'imgs/[name].[ext]?[hash:4]',
                    limit: 1,
                    //path: path.resolve(__dirname, '/dist'),
                    publicPath: "../",  //编译完成后
                }
            },
            {
                test: /\.(woff|eot|ttf|otf|svg)(\?.*)?$/,
                loader: 'url-loader',
                query: {
                    limit: 1,
                    name: 'css/fonts/[name].[hash:4].[ext]',
                    publicPath: "../",  //编译完成后
                }
            }
        ]
    };

    //插件

    //// 启用作用域提升特性来避免这种额外的性能损耗 
    plugins.push(new webpack.optimize.ModuleConcatenationPlugin());

    //将css 文件独立成文件
    plugins.push(new ExtractTextPlugin('/css/index.css'));
    
    //多进行样式
    plugins.push(  new HappyPack({
        //公用线程池
        threadPool: happyThreadPool,
        id: "css",
        loaders: [{
            loader: "css-loader",
            options: {
                minimize: true
            }
        }, {
            loader: "less-loader"
        }]
    }));

    plugins.push( new HappyPack({
        id: "babel",
        //子进程数量
        threads: 3,
        //输入日志
        verbose: true,
        //公用线程池
        threadPool: happyThreadPool,
        loaders: ['babel-loader?cacheDirectory']

    }));
     

    //加载vue dll
    plugins.push( new DllReferencePlugin({
        manifest: require("./distLibs/libs.manifest.json")
    }));

    //生产环境
    if (env['production']) {

        //生产环境 删除dist文件重新构建
        rm(path.join(__dirname, "dist"), err => {
            if (err) throw err
            //声音
            //process.stdout.write("\x07"); 
            //绿色字体输出
            console.log(chalk.green("\n\n删除 dist 文件夹成功\n\n"));

        });

        //生产不需要source map 不监听
        devtool = false;
        watch = false;

        //压缩代码
        plugins.push(new ParallelUglifyPlugin({
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
                    drop_console: false,
                    //／内嵌己定义但是只用到了一次的变量
                    collapse_vars: true,
                    //／提取出出现多次但是没有定义成变量去引用的静态值
                    reduce_vars: true
                }
            }
        }));

        //压缩css
        plugins.push(new OptimizeCssAssetsPlugin());

        //有些插件 拿个这个参数会优化
        plugins.push(new DefinePlugin({
            'process.env': {
                //json.stringify 是把 双引号 改为 单引号
                NODE_ENV: JSON.stringify('production')
            }
        }));
    }

    //返回一个对象 webpack 配置
    return {

        devtool,

        entry,

        output,

        module: module,

        plugins: plugins,

        watch,

        watchOptions,

        resolve,

        performance,

        resolveLoader
    }

}