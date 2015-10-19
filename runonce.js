// RUN ME ONCE

var mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/LingoDB')

var model = require('./models/model.js')

var wordSchema = mongoose.Schema({
	word : {type: String, required: true}
});

var Words = mongoose.model('Words', wordSchema)

for (i=0; i<model.wordPool.length; i++){
	console.log(i)
	var newWord = new Words({
		word : model.wordPool[i]
	});

	newWord.save(function(err, data){
		if (err){
			console.log(err)
		};
	});
};
