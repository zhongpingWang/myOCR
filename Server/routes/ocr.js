const express = require("express");
const router = express.Router();

var BaiduSDK = require("../aip-node-sdk-2.3.7/src/index");

//baidu sdk
var AipOcrClient = BaiduSDK.ocr;

// 设置APPID/AK/SK
var APP_ID = "15491837";
var API_KEY = "Y6ffNg4T9Wnh7UZSt47M1Azw";
var SECRET_KEY = "jNlBQc5gBmZbTmV96Fqocc87vPZRrgZY";

// 新建一个对象，建议只保存一个对象调用服务接口
var client = new AipOcrClient(APP_ID, API_KEY, SECRET_KEY);


var HttpClient = BaiduSDK.HttpClient;

// 设置request库的一些参数，例如代理服务地址，超时时间等
// request参数请参考 https://github.com/request/request#requestoptions-callback
HttpClient.setRequestOptions({
    timeout: 5000
});

// 也可以设置拦截每次请求（设置拦截后，调用的setRequestOptions设置的参数将不生效）,
// 可以按需修改request参数（无论是否修改，必须返回函数调用参数）
// request参数请参考 https://github.com/request/request#requestoptions-callback
HttpClient.setRequestInterceptor(function (requestOptions) {
    // 查看参数
    // console.log(requestOptions)
    // 修改参数
    requestOptions.timeout = 5000;
    // 返回参数
    return requestOptions;
});


var fs = require('fs');


router.get('/', function (req, res, next) {

    res.render('index', {
        title: "文字识别"
    });
})


router.post('/api/generalBasic', function (req, res, next) {

    //接收前台POST过来的base64
    var base64 = req.body.base64;

    // 调用通用文字识别, 图片参数为本地图片
    client.generalBasic(base64).then(function (result) {

        res.writeHead(200, {
            "Content-Type": 'application/json',
            'charset': 'utf-8'
        });
        res.write(JSON.stringify(result));
        
        res.end();

    }).catch(function (err) {

        // 如果发生网络错误
        res.writeHead(200, {
            "Content-Type": 'application/json',
            'charset': 'utf-8'
        });
        res.write(JSON.stringify(err));
        res.end();
    });

})

router.post('/api/webImage', function (req, res, next) {

    //接收前台POST过来的base64
    var webUrl = req.body.imgUrl;

    // 调用通用文字识别, 图片参数为本地图片
    client.webImage(webUrl).then(function (result) {
        res.writeHead(200, {
            "Content-Type": 'application/json',
            'charset': 'utf-8'
        });
        res.write(JSON.stringify(result));
        res.end();
    }).catch(function (err) {
        // 如果发生网络错误
        console.log(err);
    });

})

router.post('/api/handwriting', function (req, res, next) {

    //接收前台POST过来的base64
    var base64 = req.body.base64;

    // 调用通用文字识别, 图片参数为本地图片
    client.handwriting(base64).then(function (result) {
        res.writeHead(200, {
            "Content-Type": 'application/json',
            'charset': 'utf-8'
        });
        res.write(JSON.stringify(result));
        res.end();
    }).catch(function (err) {
        // 如果发生网络错误
        console.log(err);
    });
});

exports = module.exports = router;