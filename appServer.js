var express = require('express')
var bodyParser = require('body-parser')
var routes = require('./routes/routes.js')


var app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use(express.static(__dirname + '/public'))
app.use('/', routes)
app.use('/api/translation', routes)

var port = 3000
app.listen(port, function(){
	console.log("console is listening on port...", port)
})