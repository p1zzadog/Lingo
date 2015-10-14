var googleTranslate = require('google-translate')('AIzaSyCXW-bazvWNiDrpfLvCGNUASEzSAjucZTk');

var getTranslation = function(req, res){
	googleTranslate.translate(req.body.word, req.body.from, req.body.to, function(err, translation){
		if (err){
			console.log('Error...:', err)
			res.send(err)
		}
		else{
			console.log('Translation...:', translation)
			res.send(translation)
		}
	})
}


module.exports = {
	getTranslation : getTranslation
}