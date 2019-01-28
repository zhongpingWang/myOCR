

const userInfo = require('./userInfo');
const orcInfo = require('./ocr');

exports = module.exports = function(app){
	app.use('/userinfo', userInfo);
	app.use('/ocr', orcInfo);
};