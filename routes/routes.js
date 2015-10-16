var express = require('express')
var router = express.Router()
var controller = require('../controllers/controller.js')

router.get('/', function(req, res){
	res.sendFile('/html/index.html', {root: './public'});
});
router.get('/page/translate', function(req, res){
	res.sendFile('/html/translate.html', {root: './public'});
});
router.get('/page/quiz', function(req, res){
	res.sendFile('/html/quiz.html', {root: './public'});
});
router.get('/page/progress', function(req, res){
	res.sendFile('/html/progress.html', {root: './public'});
});

router.post('/api/translation', controller.getTranslation);
router.post('/quiz/language-select', controller.languageSelect);
router.get('/quiz/get-next-question', controller.getNextQuestion);
router.post('/quiz/check-response', controller.checkResponse);

module.exports = router