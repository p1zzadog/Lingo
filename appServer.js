var express = require('express');
var bodyParser = require('body-parser');
var routes = require('./routes/routes.js');


var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/public'));


app.use('/', routes);
app.use('/page/translate', routes);
app.use('/page/quiz', routes);
app.use('/page/progress', routes);

app.use('/api/translation', routes);
app.use('/quiz/language-select', routes);
app.use('/quiz/get-next-question', routes);
app.use('/quiz/check-response', routes);

var port = 3000;
app.listen(port, function(){
	console.log("console is listening on port...", port);
});