var googleTranslate = require('google-translate')('AIzaSyCXW-bazvWNiDrpfLvCGNUASEzSAjucZTk');
var model = require('../models/model.js');
var questionIndex = 0;

// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
// utility functions
// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-



// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
// request handler functions
// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-

var getTranslation = function(req, res){
	googleTranslate.translate(req.body.word, req.body.from, req.body.to, function(err, translation){
		if (err){res.send(err);}
		else{
			res.send(translation);
		};
	});
};

var languageSelect = function(req, res){
	googleTranslate.translate(model.wordBank, 'en', req.body.languageSelection, function(err, translations){
		if(err){res.send(err);}
		else{
			model.questionBank = translations;
			res.send('Okay!');
		};
	});
	questionIndex = 0;
};

var getNextQuestion = function(req, res){
	if (questionIndex < model.wordBank.length){
	res.send(model.questionBank[questionIndex].translatedText);
	questionIndex++;
	}
	else {
		res.send('All done!')
	};
};

var checkResponse = function(req, res){
	var userResponse = req.body.response.toLowerCase().split('');
	var answer = model.wordBank[questionIndex-1].toLowerCase().split('');

	if (Math.abs(userResponse.length - answer.length)>1) {
		res.send('incorrect');
	}
	else if (userResponse.length - answer.length === 1) {
		for (var i = 0; i<answer.length; i++){
			userResponse[i] !== answer[i] ? res.send('incorrect') : res.send('correct but 1 character off')
		};
	}
	else if (userResponse.length - answer.length === -1) {
		for (var i = 0; i<userResponse.length; i++){
			userResponse[i] !== answer[i] ? res.send('incorrect') : res.send('correct but 1 character off')
		};
	}
	else {
		var spliceCount = 0;
		for (var i = 0; i<answer.length; i++) {
			if (userResponse[i] !== answer[i]) {
				userResponse = userResponse.splice(i, 0, answer[i]);
				spliceCount++;
			};
		};
		switch (spliceCount) {
			case 0:
				res.send('correct');
				break;
			case 1:
				res.send('correct but 1 character off');
				break;
			default:
				res.send('incorrect');
		};
	};
};

module.exports = {
	getTranslation  : getTranslation,
	languageSelect  : languageSelect,
	getNextQuestion : getNextQuestion,
	checkResponse   : checkResponse
}