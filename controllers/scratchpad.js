var removeExtra = function(userResponse, answer, req, res, incorrect){
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
			incorrect = true;
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
			return res.send({status:'provisional correct', reason:'Correct, but it looks like there was an extra letter there. ' + letterDeleted + ' was removed'});
			break;
		};
	};		
};

var addMissing = function(userResponse, answer, req, res, incorrect){
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
			incorrect = true;
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
			return res.send({status:'provisional correct', reason:'Correct, but it looks like there was a missing letter. ' + letterAdded + ' was missing'});
			break;
		};
	};
};

var equalLength = function(userResponse, answer, req, res, incorrect){
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
			return res.send({status:'correct', reason:'Correct!'});
			break;
		// PROVISIONAL CORRECT: one replacement made
		case 1:
			console.log('res.send6')
			return res.send({status:'provisional correct', reason:'Correct, but it looks like a letter was wrong. ' + letterReplaced + ' was replaced with ' + letterReplacement});
			break;
		// WRONG: more than one replacement made
		default:
			console.log('res.send7')
			incorrect = true;
			return res.send({status:'incorrect', reason:'Incorrect'});
	};
};

module.exports = {
	removeExtra : removeExtra,
	addMissing : addMissing,
	equalLength : equalLength
};