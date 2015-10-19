var googleTranslate = require('google-translate')('AIzaSyCXW-bazvWNiDrpfLvCGNUASEzSAjucZTk');
var model = require('../models/model.js');
var scratchpad = require('./scratchpad.js');
var User = require('../models/user.js');


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

var createQuiz = function(english, translation, userId){
	var newQuiz = new model.Quiz({
		wordsEN : english,
		wordsTR : translation,
		user    : userId,
	});
	newQuiz.save(function(err, result){
		if (err) console.log(err);
		quizId = result._id
	});
};

// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
// Quiz Controllers
// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
var questionIndex = null;
var quizId = null;

var languageSelect = function(req, res){
	model.quizBankEN = generateQuizBank(model.wordPool);
	googleTranslate.translate(model.quizBankEN, 'en', req.body.languageSelection, function(err, translations){
		if(err) res.send(err);
		else{
			model.quizBankTR = translations.map(function(word){return word.translatedText});
			createQuiz(model.quizBankEN, model.quizBankTR, req.user._id);
			console.log(quizId)
			res.send('Okay');
		};
	});
	questionIndex = 0;
};

var getNextQuestion = function(req, res){
	if (questionIndex < model.quizBankEN.length){
	res.send(model.quizBankTR[questionIndex]);
	questionIndex++;
	}
	else res.send('All done!');
};

var checkResponse = function(req, res){
	var userResponse = req.body.response.toLowerCase().split('');
	var answer = model.quizBankEN[questionIndex-1].toLowerCase().split('');
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



	// SOMETHING IS WRONG HERE!!!!!!!!!
	if(incorrect === true) {
		model.Quiz.update( 
			{_id:quizId}, 
			{ $push: { wordsIncorrect: model.quizBankEN[questionIndex-1] } } 
		);
	}
	else { 
		console.log('update the quiz document: ', quizId)
		console.log('word to push: ', model.quizBankEN[questionIndex-1])
		model.Quiz.find({}, function(err, doc){
			console.log('doc is: ', doc)
		})
		model.Quiz.update(
			{_id:quizId}, 
			{ $push: { wordsCorrect: model.quizBankEN[questionIndex-1] } } 
		);
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