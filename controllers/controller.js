var googleTranslate = require('google-translate')('AIzaSyCXW-bazvWNiDrpfLvCGNUASEzSAjucZTk');
var model = require('../models/model.js');
var questionIndex = 0;
var scratchpad = require('./scratchpad.js');
var User = require('../models/user.js');


// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
// utility functions
// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-

var createQuiz = function(english, translation, user){
	var wordsTR = translation.map(function(word){
		return word.translatedText
	});
	var newQuiz = new model.Quiz({
		wordsEN : english,
		wordsTR : wordsTR,
		user    : user,
	});
	newQuiz.save(function(){});
};

// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
// Translate Controller
// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-

var getTranslation = function(req, res){
	googleTranslate.translate(req.body.word, req.body.from, req.body.to, function(err, translation){
		if (err){res.send(err);}
		else{
			res.send(translation);
		};
	});
};

// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
// Quiz Controllers
// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-

var languageSelect = function(req, res){
	for (var i=0; i<10; i++) {
		model.wordBankEN[i] = model.wordPool[Math.floor(Math.random()*21110 +1)];
	};
	googleTranslate.translate(model.wordBankEN, 'en', req.body.languageSelection, function(err, translations){
		if(err){res.send(err);}
		else{
			model.questionBank = translations;
			createQuiz(model.wordBankEN, model.questionBank, req.user._id);
			res.send('okay');
		};
	});
	questionIndex = 0;
};

var getNextQuestion = function(req, res){
	if (questionIndex < model.wordBankEN.length){
	res.send(model.questionBank[questionIndex].translatedText);
	questionIndex++;
	}
	else {
		res.send('All done!')
	};
};

var checkResponse = function(req, res, quizId){
	var userResponse = req.body.response.toLowerCase().split('');
	var answer = model.wordBankEN[questionIndex-1].toLowerCase().split('');
	var incorrect = false;

	// algorithm will try to determine if answer is wrong by one character and count it provisionally correct
	// 1) one character swapped
	// 2) one character ommitted
	// 3) one character added

	// CASE: WRONG: answer and response differ by more than two characters
	if (Math.abs(userResponse.length - answer.length)>1) {
		console.log('res.send0')
		res.send({status:'incorrect', reason:'Incorrect'});
		incorrect = true;
	}
	// CASE: userResponse is one character longer than correct answer
	else if (userResponse.length - answer.length === 1) {
		scratchpad.removeExtra(userResponse, answer, req, res, incorrect);
	}
	// CASE: userResponse is one character shorter than correct answer
	else if (userResponse.length - answer.length === -1) {
		scratchpad.addMissing(userResponse, answer, req, res, incorrect);		
	}
	// CASE: userResponse and Answer lengths are equal
	else {
		scratchpad.equalLength(userResponse, answer, req, res, incorrect);
	};

	// if(incorrect === true) {
	// 	Quiz.update({},)
	// }
};

module.exports = {
	getTranslation  : getTranslation,
	languageSelect  : languageSelect,
	getNextQuestion : getNextQuestion,
	checkResponse   : checkResponse,
	wordBankEN      : model.wordBankEN
}