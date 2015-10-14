var googleTranslate = require('google-translate')('AIzaSyCXW-bazvWNiDrpfLvCGNUASEzSAjucZTk');
var model = require('../models/model.js')
var wordList = model.wordBank

var getTranslation = function(req, res){
	googleTranslate.translate(req.body.word, req.body.from, req.body.to, function(err, translation){
		if (err){
			res.send(err)
		}
		else{
			console.log('Translation...:', translation)
			res.send(translation)
		}
	})
}
var getWordList = function(req, res){
	googleTranslate.translate(wordList, 'en', req.body.languageSelection, function(err, translations){
		if(err){
			res.send(err)
		}
		else{
			res.send(translations)
		}
	})
}

module.exports = {
	getTranslation : getTranslation,
	getWordList    : getWordList,
}