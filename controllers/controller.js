var googleTranslate = require('google-translate')('AIzaSyCXW-bazvWNiDrpfLvCGNUASEzSAjucZTk');
var model = require('../models/model.js');
var scratchpad = require('./scratchpad.js');
var User = require('../models/user.js');

// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
// utility vars
// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
var questionIndex = 0;
var activeQuiz;
var freshQuestion = true;
var correctness = true;

// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
// utility functions
// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
var generateQuizBank = function(wordPool){
	var quizBank = [];
	for (var i=0; i<10; i++) {
		quizBank[i] = wordPool[Math.floor(Math.random()*21110 +1)];
	};
	return quizBank;
};

var createQuiz = function(en, tr, user){
	var newQuiz = new model.Quiz({
		wordsEN : en,
		wordsTR : tr,
		user    : user,
		wordsCorrect: [],
		wordsIncorrect: [],
	});
	newQuiz.save(function(err, result){
		if (err) console.log(err);
		activeQuiz = result._id
	});
};

// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
// Quiz Controllers
// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-

var languageSelect = function(req, res){
	model.quizBankEN = generateQuizBank(model.wordPool);
	googleTranslate.translate(model.quizBankEN, 'en', req.body.languageSelection, function(err, translations){
		if(err) res.send(err);
		else{
			model.quizBankTR = translations.map(function(word){return word.translatedText.toLowerCase()});
			createQuiz(model.quizBankEN, model.quizBankTR, req.user._id);
			res.send('Okay');
		};
	});
	questionIndex = 0;
};

var getNextQuestion = function(req, res){
	if (questionIndex < model.quizBankEN.length){
	res.send(model.quizBankTR[questionIndex]);
	questionIndex++;
	freshQuestion = true;
	correctness = true;
	}
	else res.send('All done!');
};

var checkResponse = function(req, res){
	var userResponse = req.body.response.toLowerCase().split('');
	var answer = model.quizBankEN[questionIndex-1].toLowerCase().split('');
	

	// algorithm will try to determine if answer is wrong by one character and count it provisionally correct
	// 1) one character swapped
	// 2) one character ommitted
	// 3) one character added

	// CASE: WRONG: answer and response differ by more than two characters
	if (Math.abs(userResponse.length - answer.length)>1) {		
		scratchpad.tooManyChars(userResponse, answer, req, res, freshQuestion, correctness, activeQuiz, questionIndex);
		freshQuestion = false;
	}
	// CASE: userResponse is one character longer than correct answer
	else if (userResponse.length - answer.length === 1) {
		scratchpad.removeExtra(userResponse, answer, req, res, freshQuestion, correctness, activeQuiz, questionIndex);
		freshQuestion = false;
	}
	// CASE: userResponse is one character shorter than correct answer
	else if (userResponse.length - answer.length === -1) {
		scratchpad.addMissing(userResponse, answer, req, res, freshQuestion, correctness, activeQuiz, questionIndex);
		freshQuestion = false;
	}
	// CASE: userResponse and Answer lengths are equal
	else {
		scratchpad.equalLength(userResponse, answer, req, res, freshQuestion, correctness, activeQuiz, questionIndex);
		freshQuestion = false;
	};
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

module.exports = {
	getTranslation  : getTranslation,
	languageSelect  : languageSelect,
	getNextQuestion : getNextQuestion,
	checkResponse   : checkResponse,
}