var googleTranslate = require('google-translate')('AIzaSyCXW-bazvWNiDrpfLvCGNUASEzSAjucZTk');
var model = require('../models/model.js');
var questionIndex = 0;

// utility functions
var compareArrays = function(array1, array2) {
	for (var i=0; i<array2.length; i++){
		if (array1[i] !== array2[i]) {
			return false
		};
	};
};

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

};

var getNextQuestion = function(req, res){
	if (questionIndex < model.wordBank.length){
	res.send(model.questionBank[questionIndex].translatedText);
	questionIndex++;
	}
	else {
		res.send('All done!')
	}
}

var checkResponse = function(req, res){
	var userResponse = req.body.response.toLowerCase().split('');
	var answer = model.wordBank[questionIndex-1].toLowerCase().split('');
	if (Math.abs(userResponse.length - answer.length)>1){
		res.send('incorrect');
	}
	else if(compareArrays(userResponse, answer) === false){
		res.send('also incorrect');
	}
	else {
		res.send('correct');
	};
	
	console.log('userResponse: ', userResponse);
	console.log('answer: ', answer);
}

module.exports = {
	getTranslation  : getTranslation,
	languageSelect  : languageSelect,
	getNextQuestion : getNextQuestion,
	checkResponse   : checkResponse
}