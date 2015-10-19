// var wordBankTesting = ['boogers', 'hello', 'thanks', 'stupid', 'cat', 'dog', 'horse', 'frog', 'water', 'noodle' ];
var wordPool = require('./wordbank.json').wordlist
var mongoose = require('mongoose');
var random = require('mongoose-simple-random');

var wordSchema = mongoose.Schema({
	word : {type: String, required: true}
});
wordSchema.plugin(random);
var Words = mongoose.model('Words', wordSchema);



var wordBankEN = [];
var questionBankForeign = [];



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
	wordPool : wordPool,
	wordBankEN : wordBankEN,
	questionBankForeign : questionBankForeign,
	Quiz : Quiz,
}