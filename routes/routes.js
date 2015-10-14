var express = require('express')
var router = express.Router()
var controller = require('../controllers/controller.js')

router.get('/', function(req, res){
	res.sendFile('/html/index.html', {root: './public'})
})

router.post('/api/translation', controller.getTranslation)


module.exports = router