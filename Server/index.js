'use strict';
const express = require('express')
const path = require("path");
const app = express()

const cookieParser = require('cookie-parser')
const config = require('config-lite')(__dirname);
const connectMongo = require('connect-mongo')
const session = require('express-session')
const bodyParser = require('body-parser')
const router = require("./routes/index.js");

//数据库连接
//const dbUtil = require("./dbUtil/index.js");

app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'ejs');
app.engine("html", require("ejs").__express);
app.set('view engine', 'html');


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(cookieParser());

const MongoStore = connectMongo(session);
app.use(session({
    name: config.session.name,
    secret: config.session.secret,
    resave: true,
    rolling: true,
    saveUninitialized: false,
    cookie: config.session.cookie,
    //将session存进数据库  用来解决负载均衡的问题
    store: new MongoStore({
        url: config.url,
        touchAfter: 24 * 3600
    })
}))


app.all('*', (req, res, next) => {
    const {
        origin,
        Origin,
        referer,
        Referer
    } = req.headers;
    const allowOrigin = origin || Origin || referer || Referer || '*';
    res.header("Access-Control-Allow-Origin", allowOrigin);
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.header("Access-Control-Allow-Credentials", true); //可以带cookies
    res.header("X-Powered-By", 'Express');
    if (req.method == 'OPTIONS') {
        res.sendStatus(200);
    } else {
        next();
    }
});

//页面
app.get('/', (req, res) =>{
    res.writeHead(200, {'Content-Type': 'text/plain'}); 
    res.end('Hello World\n');
});


//页面
app.get('/page/**', (req, res) => res.render('index', {
    title: "文字识别"
}));

//其他路由
router(app);

//静态资源
//app.use('/static', express.static(__dirname + '/static'));

//静态资源路径 导向
//app.use(express.static(__dirname + '/static'));

//404
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

//错误信息页面
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

app.listen(9001, () => console.log('Example app listening on port 9001!'));