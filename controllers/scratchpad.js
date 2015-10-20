var model = require('../models/model.js')

var tooManyChars = function(userResponse, anser, req, res, freshQuestion, correctness, quizId, questionIndex){
	console.log('res.send0')
	correctness = false;
	updateQuizDoc(freshQuestion, correctness, quizId, questionIndex)
	res.send({status:'incorrect', reason:'Incorrect'});
}

var removeExtra = function(userResponse, answer, req, res, freshQuestion, correctness, quizId, questionIndex){
	var spliceCount = 0;
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
			correctness = false;
			updateQuizDoc(freshQuestion, correctness, quizId, questionIndex);
			return res.send({status:'incorrect', reason:'Incorrect'});
			break;
		};
		// PROVISIONAL CORRECT: either an extra character was added at the end of the answer (and no deletion occurred),
		// or an extra character was typed mid-word and fixed by the single deletion
		if (i===(answer.length-1) && spliceCount <=1){
			console.log('res.send2')
			if (spliceCount === 0) {
				var letterDeleted = userResponse[userResponse.length-1];
			}
			updateQuizDoc(freshQuestion, correctness, quizId, questionIndex);
			return res.send({status:'provisional correct', reason:'Correct, but it looks like there was an extra letter there. ' + letterDeleted + ' was removed'});
			break;
		};
	};		
};

var addMissing = function(userResponse, answer, req, res, freshQuestion, correctness, quizId, questionIndex){
	var spliceCount = 0;
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
			correctness = false;
			updateQuizDoc(freshQuestion, correctness, quizId, questionIndex);
			return res.send({status:'incorrect', reason:'Incorrect'});
			break;
		};
		// PROVISIONAL CORRECT: a character must have been omitted and no more than one addition occured
		if (i===(userResponse.length-1)) {
			// making sure letterAdded is defined in the case the last letter is the missing letter
			if (spliceCount === 0) {
				var letterAdded = answer[answer.length-1];
			};
			console.log('res.send4')
			updateQuizDoc(freshQuestion, correctness, quizId, questionIndex);
			return res.send({status:'provisional correct', reason:'Correct, but it looks like there was a missing letter. ' + letterAdded + ' was missing'});
			break;
		};
	};
};

var equalLength = function(userResponse, answer, req, res, freshQuestion, correctness, quizId, questionIndex){
	var spliceCount = 0;
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
			updateQuizDoc(freshQuestion, correctness, quizId, questionIndex);
			return res.send({status:'correct', reason:'Correct!'});
			break;
		// PROVISIONAL CORRECT: one replacement made
		case 1:
			console.log('res.send6')
			updateQuizDoc(freshQuestion, correctness, quizId, questionIndex);
			return res.send({status:'provisional correct', reason:'Correct, but it looks like a letter was wrong. ' + letterReplaced + ' was replaced with ' + letterReplacement});
			break;
		// WRONG: more than one replacement made
		default:
			console.log('res.send7')
			correctness = false
			updateQuizDoc(freshQuestion, correctness, quizId, questionIndex);
			return res.send({status:'incorrect', reason:'Incorrect'});
	};
};

updateQuizDoc = function(freshness, isCorrect, quizId, questionIndex){
	
	if(isCorrect === false && freshness === true) {
		model.Quiz.update( 
			{_id:quizId}, 
			{ $push: { wordsIncorrect: model.quizBankEN[questionIndex-1] } } ,
			function(err, result) {
				if (err) console.log('error', err);
				if (result) console.log('result', result);
			}
		);
	}
	if(isCorrect === true && freshness === true) { 
		model.Quiz.update(
			{_id:quizId}, 
			{ $push: { wordsCorrect: model.quizBankEN[questionIndex-1] } } ,
			function(err, result) {
				if (err) console.log('error', err);
				if (result) console.log('result', result);
			}
		);
	};
};

module.exports = {
	tooManyChars : tooManyChars,
	removeExtra : removeExtra,
	addMissing : addMissing,
	equalLength : equalLength,
	updateQuizDoc : updateQuizDoc
};