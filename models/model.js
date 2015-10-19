var wordBankTesting = ['boogers', 'hello', 'thanks', 'stupid', 'cat', 'dog', 'horse', 'frog', 'water', 'noodle' ];
var wordPool = require('./wordbank.json').wordlist
var wordBankEN = [];
var questionBankForeign = [];

var mongoose = require('mongoose');

// var quizSchema = mongoose.schema({
	
// })

// mongoose


module.exports= {
	wordPool : wordPool,
	wordBankEN : wordBankEN,
	questionBankForeign : questionBankForeign,
}