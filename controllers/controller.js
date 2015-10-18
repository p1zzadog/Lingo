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
	var spliceCount = 0

	// algorithm will try to determine if answer is wrong by one character and count it provisionally correct
	// 1) one character swapped
	// 2) one character ommitted
	// 3) one character added

	// CASE: WRONG: answer and response differ by more than two characters
	if (Math.abs(userResponse.length - answer.length)>1) {
		console.log('res.send0')
		res.send({status:'incorrect', reason:'Incorrect'});
	}
	// CASE: userResponse is one character longer than correct answer
	else if (userResponse.length - answer.length === 1) {
		// loop over the length of shorter word (answer)
		for (var i = 0; i<answer.length; i++){
			// if an incorrect character is found, DELETE it and tally the change
			if (userResponse[i] !== answer[i] && spliceCount < 1){
				var letterDeleted = userResponse.splice(i, 1);
				spliceCount++;
				i--;
			}
			// WRONG: if an incorrect character is found and a character was previously deleted, 
			// the answer must be wrong by more than one character
			else if (userResponse[i] !== answer[i] && spliceCount >= 1){
				console.log('res.send1')
				res.send({status:'incorrect', reason:'Incorrect'});
				break;
			};
			// PROVISIONAL CORRECT: either an extra character was added at the end of the answer (and no deletion occurred),
			// or an extra character was typed mid-word and fixed by the single deletion
			if (i===(answer.length-1) && spliceCount <=1){
				console.log('res.send2')
				res.send({status:'provisional correct', reason:'Correct, but it looks like there was an extra letter there. ' + letterDeleted + ' was removed'});
				break;
			};
		};		
	}
	// CASE: userResponse is one character shorter than correct answer
	else if (userResponse.length - answer.length === -1) {
		// loop over the length of shorter word (userResponse)
		for (var i = 0; i<userResponse.length; i++){
			// If an incorrect character is found, ADD the correct character and tally the change
			if (userResponse[i] !== answer[i] && spliceCount<1){
				userResponse.splice(i, 0, answer[i]);
				var letterAdded = answer[i];
				spliceCount++;
			}
			// WRONG: if an incorrect character is found and a character was previously added,
			// the answer must be wrong by more than one character
			else if (userResponse[i] !== answer[i] && spliceCount >=1) {
				console.log('res.send3')
				res.send({status:'incorrect', reason:'Incorrect'});
				break;
			};
			// PROVISIONAL CORRECT: a character must have been omitted and no more than one addition occured
			if (i===(userResponse.length-1)) {
				// making sure letterAdded is defined in the case the last letter is the missing letter
				if (spliceCount === 0) {
					var letterAdded = answer[answer.length-1];
				};
				console.log('res.send4')
				res.send({status:'provisional correct', reason:'Correct, but it looks like there was a missing letter. ' + letterAdded + ' was missing'});
				break;
			};
		};
		
	}
	// CASE: userResponse and Answer lengths are equal
	else {
		// loop over the length of one of the arrays (which one is arbitrary)
		for (var i = 0; i<answer.length; i++) {
			// if an incorrect character is found, REPLACE it with the correct character and tally the change
			if (userResponse[i] !== answer[i]) {
				var letterReplaced = userResponse.splice(i, 1, answer[i]);
				var letterReplacement = answer[i];
				spliceCount++;
			};
		};
		// examine the splice count
		switch (spliceCount) {
			// EXACTLY CORRECT: no replacements made
			case 0:
				console.log('res.send5')
				res.send({status:'correct', reason:'Correct!'});
				break;
			// PROVISIONAL CORRECT: one replacement made
			case 1:
				console.log('res.send6')
				res.send({status:'provisional correct', reason:'Correct, but it looks like a letter was wrong. ' + letterReplaced + ' was replaced with ' + letterReplacement});
				break;
			// WRONG: more than one replacement made
			default:
				console.log('res.send7')
				res.send({status:'incorrect', reason:'Incorrect'});
		};
	};
};

module.exports = {
	getTranslation  : getTranslation,
	languageSelect  : languageSelect,
	getNextQuestion : getNextQuestion,
	checkResponse   : checkResponse
}