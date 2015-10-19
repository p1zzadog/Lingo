// var wordBankTesting = ['boogers', 'hello', 'thanks', 'stupid', 'cat', 'dog', 'horse', 'frog', 'water', 'noodle' ];
var wordPool = require('./wordpool.json').wordlist
var mongoose = require('mongoose');

var quizBankEN = [];
var quizBankTR = [];



var quizSchema = mongoose.Schema({
	wordsEN : {
		type: Array,
		required: true
	},
	wordsTR : {
		type: Array,
		required: true
	},
	user : {
		type: String,
		required: true
	},
	wordsCorrect : {
		type:Array
	},
	wordsIncorrect : {
		type: Array
	}
});

var Quiz = mongoose.model('Quiz', quizSchema);

module.exports= {
	wordPool   : wordPool,
	quizBankEN : quizBankEN,
	quizBankTR : quizBankTR,
	Quiz       : Quiz,
}