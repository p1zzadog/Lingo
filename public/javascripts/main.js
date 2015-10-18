angular.module('lingoApp', []);

angular.module('lingoApp').controller('lingoController', ['$scope', '$http', function($scope, $http){
	$scope.greeting = "hello";
	
	$scope.translateWord = function(){
		$http.post('/api/translation', $scope.translate)
			.then(function(returnData){
				console.log(returnData);
				if (returnData.data.translatedText){
					$scope.translatedWord = returnData.data.translatedText;
				}
				else {
					$scope.translatedWord = "Sorry there was an issue";
				};
			});				
		};

}]);

angular.module('lingoApp').controller('quizController', ['$scope', '$http', '$timeout', function($scope, $http, $timeout){

	// see the translated word bank
	$scope.enableCheatMode = function(){
	$scope.cheatMode = true;
	$http.get('/quiz/cheatMode').then(function(returnData){
		$scope.wordBankEN = returnData.data
	});
	};

	// utility functions
	var checkReturnData = function(returnData){
		if (returnData.data === 'incorrect') {
			return false;
		}
		else{
			return true;
		};
	};

	var getNextQuestion = function(){
		$http({
			method: 'get',
			url: '/quiz/get-next-question'
		}).then(function(nextQuestion){
			$scope.question = nextQuestion.data;
		});
	}

	// View related functions
	
	$scope.languageSelectForm = true
	$scope.languageSelect = function(){
		$http.post('/quiz/language-select', { languageSelection : $scope.languageSelection } )
			.then(function(returnData){
				returnData.data ? $scope.beginQuizShow = true : console.log('something went wrong!');
			});
		};

	$scope.beginQuiz = function(){
		$scope.beginQuizShow = !$scope.beginQuizShow;
		$scope.quizShow = true;
		getNextQuestion();
	};

	$scope.submitResponse = function(){
		console.log($scope.quizResponse)
		$http({
			method: 'post',
			url: '/quiz/check-response',
			data: {response : $scope.quizResponse},
		}).then(function(returnData){
			console.log(returnData.data)
			switch (returnData.data.status) {
				case 'correct':
					$scope.feedbackMessage = returnData.data.reason;
					$timeout(function(){						
						getNextQuestion();
						$scope.feedbackMessage = '';
					}, 2000);
					break;
				case 'provisional correct':
					$scope.feedbackMessage = returnData.data.reason;
					$timeout(function(){
						getNextQuestion();
						$scope.feedbackMessage = '';
					}, 2000);
					break;
				default:
					$scope.feedbackMessage = returnData.data.reason;
			};
			
		});
		
		$scope.quizResponse = '';
	};



}]);