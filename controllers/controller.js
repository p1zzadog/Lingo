var googleTranslate = require('google-translate')('AIzaSyCXW-bazvWNiDrpfLvCGNUASEzSAjucZTk');

var getTranslation = function(req, res){
	googleTranslate.translate(req.body.word, req.body.from, req.body.to, function(err, translation){
		if (err){
			res.send(err)
		}
		else{
			res.send(translation)
		}
	})
}


module.exports = {
	getTranslation : getTranslation
}